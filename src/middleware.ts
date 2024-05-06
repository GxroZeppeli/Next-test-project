import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth';
import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';
 
// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {

//   }
// }
 
// export default auth((req) => {
//   if (req.auth && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register'))) {
//     return NextResponse.redirect("/");
//   }
// })

export default NextAuth(authConfig).auth; // path guarding in config, since bcrypt won't run in middleware
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)',
    // '/login',
    // '/register',
  ],
};