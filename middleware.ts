import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware((auth, request) => {
  try {
    if (isProtectedRoute(request)) auth().protect()
  } catch (error) {
    if (error instanceof Error) {
      console.error('Clerk middleware error:', error.message)
    } else {
      console.error('Clerk middleware error:', error)
    }
  }
})

export const config = {
  matcher: ['/(.*)'],
}
