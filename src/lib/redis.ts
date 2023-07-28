import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URI_JOBS!);
const redisCancellation = new Redis(process.env.REDIS_URI_CANCELLATION!);
const redisFinish = new Redis(process.env.REDIS_URI_FINISH!);

export { redis, redisCancellation, redisFinish };
