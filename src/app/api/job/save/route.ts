import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { JobValidator } from '@/lib/validators/job';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import z from 'zod';

// add a job to archive
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

    // check archive
    const url = new URL(req.url);
    const archiveId = url.searchParams.get('archiveId');
    if (!archiveId) {
      return new Response('Please provide an archive id', { status: 422 });
    }
    const existingArchive = await db.archive.findFirst({
      where: {
        id: archiveId,
        userId,
      },
    });

    if (!existingArchive) {
      return new Response('Archive not found', { status: 404 });
    }

    // check job
    const body = await req.json();
    const jobData = JobValidator.parse(body);

    // job with the same key already exists
    const existingJob = await db.job.findFirst({
      where: {
        key: jobData.key,
      },
    });

    if (existingJob) {
      if (existingJob.archiveId === archiveId) {
        return new Response('Job exists in this archive', { status: 409 });
      }

      // job exists in another archive, move to the current archive
      const updatedJob = await db.job.update({
        where: {
          key: existingJob.key,
        },
        data: {
          archiveId,
        },
      });

      return new Response(JSON.stringify(updatedJob));
    }

    const savedJob = await db.job.create({
      data: {
        userId,
        archiveId,
        ...jobData,
      },
    });

    return new Response(JSON.stringify(savedJob));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }
    return new Response('Internal server error', { status: 500 });
  }
}

// delete a job from archive
export async function DELETE(req: NextRequest) {
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

    // check archive
    const url = new URL(req.url);
    const archiveId = url.searchParams.get('archiveId');
    const jobKey = url.searchParams.get('jobKey');

    if (!archiveId) {
      return new Response('Please provide an archive id', { status: 422 });
    }

    if (!jobKey) {
      return new Response('Please provide a job key', { status: 422 });
    }

    const existingArchive = await db.archive.findFirst({
      where: {
        id: archiveId,
        userId,
      },
    });

    if (!existingArchive) {
      return new Response('Archive not found', { status: 404 });
    }

    // check job
    const existingJob = await db.job.findFirst({
      where: {
        key: jobKey,
        userId,
        archiveId,
      },
    });

    if (!existingJob) {
      return new Response('Job not found', { status: 404 });
    }

    await db.job.delete({
      where: {
        key: jobKey,
        userId,
        archiveId,
      },
    });

    return new Response('Job deleted');
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }
    return new Response('Internal server error', { status: 500 });
  }
}
