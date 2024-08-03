import type { NextAuthConfig } from 'next-auth';
import { NextRequest, NextResponse, userAgent } from 'next/server'
 
export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      const isOnSettings = request.nextUrl.pathname.startsWith('/settings');
      const isOnSurvey = request.nextUrl.pathname.startsWith('/survey');
      const isOnGenerateReport = request.nextUrl.pathname.startsWith('/generate-report');
      const isOnHome = request.nextUrl.pathname === '/';



      // console.log (userAgent(request))

      if(isLoggedIn){
        
        if(isOnHome){
          return Response.redirect(new URL('/dashboard', request.nextUrl));
        } else {
          return true
        }

      } else {
        if(isOnDashboard || isOnSettings || isOnHome || isOnGenerateReport){
          return false
        } else {
          return true
        }
      }

    },
  }

} satisfies NextAuthConfig;