import { redisCancellation, redisFinish } from '@/lib/redis';
import { addLinkedInJobsToCache } from './runners/linkedin';
import { ConfigData } from '@/lib/validators/config';

export function startScrapers(redisKey: string, config: ConfigData) {
  redisFinish.set(redisKey, 0);
  redisCancellation.set(redisKey, 0);
  addLinkedInJobsToCache(redisKey, config);
}

export function stopScrapers(redisKey: string) {
  redisCancellation.set(redisKey, 1);
}
