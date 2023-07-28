import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthSession } from './lib/auth';

export async function middleware(req: NextRequest) {
  // if (req.nextUrl.pathname.startsWith('/api/anon')) {
  //   let anon_cookie = req.cookies.get('anon_userId');
  //   if (!anon_cookie || !anon_cookie.value.startsWith('anon')) {
  //     return new Response("Unauthorized'", {
  //       status: 401,
  //     });
  //   }
  // }

  // if (req.nextUrl.pathname.startsWith('/api/user')) {
  //   const session = await getAuthSession();
  //   if (!session) {
  //     return new Response('Unauthorized', { status: 401 });
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:function*'],
};
