import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth';
import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';

export default NextAuth(authConfig).auth; // path guarding in config, since bcrypt won't run in middleware
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};