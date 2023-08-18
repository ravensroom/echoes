import { getAuthSession } from '@/lib/auth';
import z from 'zod';
import { db } from '@/lib/db';
import { ArchiveValidator } from '@/lib/validators/archive';
import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';

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

    const body = await req.json();
    const { name } = ArchiveValidator.parse(body);
    const createdArchive = await db.archive.create({
      data: {
        userId,
        name,
      },
      include: {
        jobs: true,
      },
    });
    return new Response(JSON.stringify(createdArchive));
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

export async function PATCH(req: NextRequest) {
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

    const body = await req.json();
    const { id, name } = ArchiveValidator.parse(body);

    if (!id) {
      return new Response('Please include archive id', { status: 422 });
    }

    const existingArchive = await db.archive.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingArchive) {
      return new Response('Archive not found', { status: 404 });
    }

    const updatedArchive = await db.archive.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
      },
      include: {
        jobs: true,
      },
    });

    return new Response(JSON.stringify(updatedArchive));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }

    return new Response(
      'Could not create contact this time. Please try later',
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
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

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      const archive = await db.archive.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!archive) {
        return new Response('Archive not found', { status: 404 });
      }

      return new Response(JSON.stringify(archive));
    }

    const archives = await db.archive.findMany({
      where: {
        userId,
      },
      include: {
        jobs: true,
      },
    });
    return new Response(JSON.stringify(archives));
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }

    return new Response('Could not get contacts. Please try later', {
      status: 500,
    });
  }
}

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

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Please include a archive id', { status: 422 });
    }

    const existingArchive = await db.archive.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        jobs: true,
      },
    });

    if (!existingArchive) {
      return new Response('Config not found', { status: 404 });
    }

    for (const job of existingArchive.jobs) {
      await db.job.delete({
        where: {
          id: job.id,
        },
      });
    }

    await db.archive.delete({
      where: {
        id,
        userId,
      },
    });

    return new Response('Archive deleted successfully');
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }

    return new Response('Could not delete config this time. Please try later', {
      status: 500,
    });
  }
}
