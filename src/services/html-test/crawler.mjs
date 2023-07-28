import axios from 'axios';
import cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import path from 'path';
import { writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LINKEDIN_SEARCH__URL =
  'https://www.linkedin.com/jobs/search/?currentJobId=3553082764&f_TPR=r604800&keywords=software%20developer';

const testLinkedin = async (url) => {
  const response = await axios.get(url);
  await writeFile(
    `${__dirname}/linkedin/linkedin_search_result.html`,
    response.data
  );

  const $ = cheerio.load(response.data);
  const jobCards = $('.jobs-search__results-list .base-card');
  const jobsData = [];
  for (let jobCard of jobCards) {
    const jobId = $(jobCard)?.attr('data-entity-urn')?.split(':').at(-1);
    if (!jobId) continue;
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
    const date =
      $(cardInfo).find('.job-search-card__listdate').eq(0).attr('datetime') ||
      $(cardInfo)
        .find('.job-search-card__listdate--new')
        .eq(0)
        .attr('datetime');

    const jobData = { id: jobId, title, company, location, date };
    jobsData.push(jobData);
  }
  writeFile(
    `${__dirname}/linkedin/linkedin_search_result.json`,
    JSON.stringify(jobsData)
  );
};

testLinkedin(LINKEDIN_SEARCH__URL);
