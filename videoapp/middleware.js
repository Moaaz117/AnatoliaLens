import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const userProtectedRoutes = [
  '/upload',
  '/my-videos',
  '/api/videos/upload',
  '/api/videos/delete',
  '/api/videos/my',
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (userProtectedRoutes.some(route => pathname.startsWith(route))) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/upload',
    '/my-videos',
    '/api/videos/upload',
    '/api/videos/delete',
    '/api/videos/my',
  ],
};