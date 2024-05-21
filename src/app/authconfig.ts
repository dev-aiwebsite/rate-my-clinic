import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      const isOnSettings = request.nextUrl.pathname.startsWith('/settings');
      if (isOnDashboard || isOnSettings) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page        
      } else if (isLoggedIn) {
        // return Response.redirect(new URL('/dashboard', request.nextUrl));
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }
      const trustedHosts = ['https://h1lwf00kudd4tiu1bkxtdxeam.js.wpenginepowered.com', '*'];
      const host = request.headers.get('host');
      if (host && !trustedHosts.includes(host)) {
        throw new Error('Untrusted host');
      }
      return true;
    },
  }

} satisfies NextAuthConfig;