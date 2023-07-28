import axios from 'axios';
import cheerio from 'cheerio';
import { ConfigData } from '@/lib/validators/config';
import { redisCancellation } from '@/lib/redis';

export async function shouldCancel(redisKey: string) {
  const status = await redisCancellation.get(redisKey);
  return status === '1';
}

export function jobIsDesired(
  titleIncludes: string[],
  titleExcludes: string[],
  title: string
): boolean {
  const titleWords = title.toLowerCase().split(/[\s(),.;\-|\/]+/);

  for (let word of titleWords) {
    word = word.toLowerCase();
    if (titleExcludes.includes(word)) return false;
    if (titleIncludes.includes(word) || titleIncludes.length === 0) return true;
  }

  return false;
}

export function getPriorityPoints(
  priorityList: ConfigData['body']['priorityList'],
  description: string
) {
  const priorityMap = new Map();
  const descriptionWords = description.toLowerCase().split(/[\s(),.;\-|\/]+/);
  let priorityPoints = 0;
  for (const word of descriptionWords) {
    if (word in priorityList) {
      priorityPoints += priorityList[word];
      if (!priorityMap.has(word)) priorityMap.set(word, priorityList[word]);
      else {
        priorityMap.set(word, priorityMap.get(word) + priorityList[word]);
      }
    }
  }
  const priorityHits: string[] = [];
  for (const [keyword, points] of priorityMap) {
    if (priorityList[keyword] === 0) {
      priorityHits.push(`${keyword}:0`);
      continue;
    }
    const times = points / priorityList[keyword];
    priorityHits.push(
      `${keyword}:${priorityList[keyword]}${times > 1 ? `*${times}` : ''}`
    );
  }
  return { priorityPoints, priorityHits };
}

export async function getParsedHTML(url: string) {
  let retryCount = 0;

  axios.interceptors.response.use(
    (response) => {
      retryCount = 0;
      return response;
    },
    (error) => {
      if (error.response.status === 429) {
        // If the error has status code 429, retry the request
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(
          `Responded with 429. Waiting for ${delay} ms before retrying...`
        );
        retryCount++;
        return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
          axios.request(error.config)
        );
      }
      return Promise.reject(error);
    }
  );

  try {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  } catch (e: any) {
    return new Error(e);
  }
}
