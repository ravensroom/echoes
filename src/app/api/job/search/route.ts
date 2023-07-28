import z from 'zod';
import { ConfigValidator } from '@/lib/validators/config';
import { createId } from '@paralleldrive/cuid2';
import { startScrapers } from '@/services/scrapers';
import { redis } from '@/lib/redis';
import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // get userId
    const session = await getAuthSession();
    let userId;
    if (session) {
      userId = session.user.id;
    } else {
      const anonUserIdCookie = req.cookies.get('anon_userId');
      if (!anonUserIdCookie || !anonUserIdCookie.value.startsWith('anon')) {
        return new Response(
          'Please provide an anon_userId in cookie or login',
          {
            status: 401,
          }
        );
      }
      userId = anonUserIdCookie.value;
    }

    // prepare data
    const body = await req.json();
    const config = ConfigValidator.parse(body);
    const searchId = createId();
    const redisKey = `${userId}#${searchId}`;

    startScrapers(redisKey, config);
    return new Response(searchId);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // check query param
    const url = new URL(req.url);
    const searchId = url.searchParams.get('searchId');
    if (!searchId) {
      return new Response('Please include searchId as query param', {
        status: 422,
      });
    }

    // get userId
    const session = await getAuthSession();
    let userId;
    if (session) {
      userId = session.user.id;
    } else {
      const anonUserIdCookie = req.cookies.get('anon_userId');
      if (!anonUserIdCookie || !anonUserIdCookie.value.startsWith('anon')) {
        return new Response(
          'Please provide an anon_userId in cookie or login',
          {
            status: 401,
          }
        );
      }
      userId = anonUserIdCookie.value;
    }

    // get all jobs with the corresponding key
    const redisKey = `${userId}#${searchId}`;
    const jobsObj = await redis.hgetall(redisKey);
    const jobs = Object.values(jobsObj).map((job) => JSON.parse(job));
    return new Response(JSON.stringify(jobs));
  } catch (err) {
    return new Response('Internal server error', { status: 500 });
  }
}
