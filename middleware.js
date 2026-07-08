import { NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/create-course']

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Client-side auth guards handle redirect; middleware just passes through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
