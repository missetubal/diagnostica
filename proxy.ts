import { NextResponse, type NextRequest } from 'next/server';
import { DEVICE_ID_COOKIE } from '@/lib/device-id';

const TWO_YEARS_SECONDS = 60 * 60 * 24 * 365 * 2;

export function proxy(request: NextRequest) {
  if (request.cookies.get(DEVICE_ID_COOKIE)?.value) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(DEVICE_ID_COOKIE, crypto.randomUUID(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TWO_YEARS_SECONDS,
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
