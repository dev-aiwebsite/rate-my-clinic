import type { NextAuthConfig } from 'next-auth';
 
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
      const url = request.nextUrl.clone();
      const isLoggedIn = auth?.user;
      const isOnDashboard = url.pathname.startsWith('/dashboard');
      const isOnSettings = url.pathname.startsWith('/settings');
      const isOnSurvey = url.pathname.startsWith('/survey');
      const isOnGenerateReport = url.pathname.startsWith('/generate-report');
      const isOnHome = url.pathname === '/';
      const loginRestrictedPath = url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/forgot-password') || 
      url.pathname.startsWith('/signup')
      
    
      if(isLoggedIn){
        
        if(isOnHome || loginRestrictedPath){
          return Response.redirect(new URL('/dashboard', url));
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