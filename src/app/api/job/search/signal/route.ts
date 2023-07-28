import { getAuthSession } from '@/lib/auth';
import { redisFinish } from '@/lib/redis';
import { stopScrapers } from '@/services/scrapers';
import { NextRequest } from 'next/server';

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

    // get if finished status for scrapers with corresponding key
    const redisKey = `${userId}#${searchId}`;
    const finished = await redisFinish.get(redisKey);
    redisFinish.del(redisKey);
    return new Response(finished);
  } catch (err) {
    return new Response('Internal server error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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

    // send signal to stop scrapers with corresponding key
    const redisKey = `${userId}#${searchId}`;
    stopScrapers(redisKey);
    return new Response('OK');
  } catch (err) {
    return new Response('Internal server error', { status: 500 });
  }
}
