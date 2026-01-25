import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Get the pathname without query parameters for canonical URL
  const { pathname } = request.nextUrl
  
  // Build canonical URL (without query params, without trailing slash)
  let canonicalPath = pathname.replace(/\/$/, '') || '/'
  const canonicalUrl = `https://idealcar.co.za${canonicalPath === '/' ? '' : canonicalPath}`
  
  // Set Link header for canonical URL (helps crawlers)
  response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
  
  return response
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files, api routes, and _next
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$|.*\\.svg$).*)',
  ],
}
