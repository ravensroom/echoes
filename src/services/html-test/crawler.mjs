import axios from 'axios';
import cheerio from 'cheerio';

const LINKEDIN_SEARCH__URL =
  'https://www.linkedin.com/jobs/search/?currentJobId=3553082764&f_TPR=r604800&keywords=software%20developer';

async function get(url) {
  const res = await axios.get(url);
  console.log(res.data);
}

const testLinkedin = async (url) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const jobCards = $('.jobs-search__results-list .base-card');
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
    const date = $(cardInfo)
      .find('.job-search-card__listdate')
      .eq(0)
      .attr('datetime');
    const jobData = { id: jobId, title, company, location, date };
    console.log(jobData);
    return;
  }
};

// get(LINKEDIN_SEARCH__URL);
testLinkedin(LINKEDIN_SEARCH__URL);
