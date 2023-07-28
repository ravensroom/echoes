import log from 'npmlog';
import { redis, redisCancellation, redisFinish } from '@/lib/redis';
import { ConfigData } from '@/lib/validators/config';
import { JobData } from '@/lib/validators/job';
import {
  getParsedHTML,
  getPriorityPoints,
  jobIsDesired,
  shouldCancel,
} from './utils';

const linkedIn = {
  url: {
    searchBase: 'https://www.linkedin.com/jobs/search/?',
    jobPageBase: 'https://www.linkedin.com/jobs/view/',
    timeRange: {
      DAY: 'f_TPR=r86400',
      WEEK: 'f_TPR=r604800',
      MONTH: 'f_TPR=r2592000',
    },
    keywords: 'keywords=',
    location: 'location=',
    pagination: 'start=',
  },
  maxEntriesPerPage: 25,
};

export async function addLinkedInJobsToCache(
  redisKey: string,
  config: ConfigData
) {
  const {
    listOfSearchKeywords,
    timeRange,
    location,
    priorityList,
    titleExcludes,
    titleIncludes,
  } = config.body;

  const jobs = new Map<string, number[]>();
  let totalAdded = 0;

  // qeury each set of keywords
  for (let keywords of listOfSearchKeywords) {
    // check point
    if (await shouldCancel(redisKey)) {
      log.warn('Canceled', 'Scraping process canceled by user.');
      redis.del(redisKey);
      redisCancellation.del(redisKey);
      redisFinish.del(redisKey);
      return;
    }
    let start = 0,
      totalEntries = 0;
    let count = 0;
    let lastAddedAt = 0;
    // paginations
    do {
      if (count - lastAddedAt > 500) {
        log.warn('Timeout', `Long time no add..., break. ${totalAdded} Added`);
        redisFinish.set(redisKey, 1);
        redis.del(redisKey);
        redisCancellation.del(redisKey);
        return;
      }
      const url = getFullQueryUrl(timeRange, location, keywords, start);
      const $ = await getParsedHTML(url);
      if ($ instanceof Error) {
        log.error(
          `${keywords}`,
          `Error fetching jobs from ${start}, next start`
        );
        continue;
      }
      if (!totalEntries)
        totalEntries = +$('.results-context-header__job-count')
          .text()
          .replace(/[\,\+]/g, '');

      const jobCards = $('.jobs-search__results-list .base-card');
      // process all jobs from start, total numbers: linkedIn.maxEntriesPerPage
      for (const jobCard of jobCards) {
        // check point
        if (await shouldCancel(redisKey)) {
          log.warn('Canceled', 'Scraping process canceled by user.');
          redis.del(redisKey);
          redisCancellation.del(redisKey);
          redisFinish.del(redisKey);
          return;
        }
        count++;
        const jobId = $(jobCard)?.attr('data-entity-urn')?.split(':').at(-1);
        if (!jobId) continue;

        const { title, company, location, date } = getJobInfo($, jobCard);
        // log.info(
        //   `${keywords}`, at ${count} job / ${totalEntries} of title ${title}`
        // );

        const jobKey = `linkedin-${jobId}`;
        if (await redis.hexists(redisKey, jobKey)) {
          log.warn('added', `Job ${title} is already cached`);
          continue;
        }

        if (jobs.has(jobId)) {
          // log.warn(
          //   'visited',
          //   `Job (${title}) visited at [start, count]: ${jobs.get(jobId)}`,

          //   `Last add at ${lastAddedAt}`
          // );
          continue;
        }
        jobs.set(jobId, [start, count]);

        const isDesired = jobIsDesired(titleIncludes, titleExcludes, title);
        if (!isDesired) {
          //log.info('undesired`, Skip job of undesired title ${title}`);
          continue;
        }

        const href = `${linkedIn.url.jobPageBase}${jobId}`;
        const description = await getJobDescription(href);
        if (description instanceof Error) {
          log.error(
            jobId,
            `Error fetching description for job ${jobId}, next job`
          );
          continue;
        }

        const { priorityPoints, priorityHits } = getPriorityPoints(
          priorityList,
          description
        );

        const job: JobData = {
          id: jobKey,
          source: 'LINKEDIN',
          date,
          body: {
            title,
            company,
            href,
            location,
            description,
            priorityPoints,
            priorityHits,
          },
        };

        redis.hset(redisKey, jobKey, JSON.stringify(job));
        log.info(`${redisKey}`, `Added ${title} to cache`);
        totalAdded++;
      }
      start += linkedIn.maxEntriesPerPage;
    } while (start < totalEntries);
  }
  console.log('Query completed, added', totalAdded);
  redisFinish.set(redisKey, 1);
  redis.del(redisKey);
  redisCancellation.del(redisKey);
}

function getFullQueryUrl(
  timeRange: ConfigData['body']['timeRange'],
  location: string,
  keywords: string,
  start: number
) {
  const url =
    linkedIn.url.searchBase +
    linkedIn.url.timeRange[timeRange] +
    '&' +
    linkedIn.url.keywords +
    keywords.split(' ').join('%20') +
    '&' +
    linkedIn.url.location +
    location.split(' ').join('%20') +
    '&' +
    linkedIn.url.pagination +
    start;
  return url;
}

function getJobInfo($: cheerio.Root, jobCard: cheerio.Element) {
  // const linkElement = $(jobCard).find('.base-card__full-link')[0];
  // const href = $(linkElement).attr('href') as string;

  const cardInfo = $(jobCard).find('.base-search-card__info').eq(0);
  const title = $(cardInfo)
    .find('.base-search-card__title')
    .eq(0)
    .text()
    .trim();
  const company = $(cardInfo)
    .find('.base-search-card__subtitle a')
    .eq(0)
    .text()
    .trim();
  const location = $(cardInfo)
    .find('.job-search-card__location')
    .eq(0)
    .text()
    .trim();
  const date = $(cardInfo)
    .find('.job-search-card__listdate')
    .eq(0)
    .attr('datetime')!;

  return { title, company, location, date };
}

async function getJobDescription(url: string): Promise<string | Error> {
  const $ = await getParsedHTML(url);
  if ($ instanceof Error) {
    return $;
  }
  const jd = $('.show-more-less-html__markup');
  return $(jd).html() || '';
}
