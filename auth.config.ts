import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isInProfile = nextUrl.pathname.startsWith('/profile');
        const onOrders = nextUrl.pathname.startsWith('/orders');
        const onLogin = nextUrl.pathname.startsWith('/login');
        const onRegister = nextUrl.pathname.startsWith('/register');

        if (isInProfile) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        } 
        if (onOrders) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        }
        if (isLoggedIn && (onLogin || onRegister)) {
          const url = nextUrl.clone();
          url.pathname = '/';
          return NextResponse.redirect(url); // Redirect authenticated users to home page
        }
        return true;
      },
    },
    providers: [],
  } satisfies NextAuthConfig;