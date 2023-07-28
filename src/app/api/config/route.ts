import { getAuthSession } from '@/lib/auth';
import z from 'zod';
import { db } from '@/lib/db';
import { ConfigValidator } from '@/lib/validators/config';
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
    const config = ConfigValidator.parse(body);
    const createdConfig = await db.config.create({
      data: {
        userId,
        ...config,
      },
    });
    return new Response(JSON.stringify(createdConfig));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }
    return new Response('Internal server err', { status: 500 });
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
    const config = ConfigValidator.parse(body);

    if (!config.id) {
      return new Response('Please include config id', { status: 422 });
    }

    const existingConfig = await db.config.findFirst({
      where: {
        id: config.id,
        userId,
      },
    });

    if (!existingConfig) {
      return new Response('Config not found', { status: 404 });
    }

    const updatedConfig = await db.config.update({
      where: {
        id: config.id,
        userId,
      },
      data: {
        name: config.name,
        body: config.body,
      },
    });

    return new Response(JSON.stringify(updatedConfig));
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
      const config = await db.config.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!config) {
        return new Response('Config not found', { status: 404 });
      }

      return new Response(JSON.stringify(config));
    }

    const configs = await db.config.findMany({
      where: {
        userId,
      },
    });
    return new Response(JSON.stringify(configs));
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }

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
      return new Response('Please include a config id', { status: 422 });
    }

    const existingConfig = await db.config.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingConfig) {
      return new Response('Config not found', { status: 404 });
    }

    await db.config.delete({
      where: {
        id,
        userId,
      },
    });

    return new Response('Config deleted successfully');
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err.code, err.message);
    }

    return new Response('Could not delete config this time. Please try later', {
      status: 500,
    });
  }
}
