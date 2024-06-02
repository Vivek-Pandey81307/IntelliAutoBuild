import {
    clerkMiddleware,
    createRouteMatcher
  } from '@clerk/nextjs/server';
  
  const ignoredRoutes = [
    '/api/auth/callback/discord',
    '/api/auth/callback/notion',
    '/api/auth/callback/slack',
    '/api/flow',
    '/api/cron/wait',
  ];
  
  const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/forum(.*)',
  ]);
  
  const isIgnoredRoute = createRouteMatcher(ignoredRoutes);
  
  export default clerkMiddleware((auth, req) => {
    // Skip authentication for ignored routes
    if (isIgnoredRoute(req)) {
      return;
    }
  
    // Protect routes if they match the protected routes pattern
    if (isProtectedRoute(req)) {
      auth().protect();
    }
  });
  
  export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  };
  