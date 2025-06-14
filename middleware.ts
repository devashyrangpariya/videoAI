import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

function handleRedirects(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Redirect /videos to /video
  if (url.pathname === '/videos' || url.pathname.startsWith('/videos/')) {
    const newUrl = new URL(url);
    newUrl.pathname = url.pathname.replace('/videos', '/video');
    return NextResponse.redirect(newUrl);
  }
  
  return null;
}

export default withAuth(
  function middleware(request: NextRequest) {
    // Check for redirects first
    const redirectResponse = handleRedirects(request);
    if (redirectResponse) return redirectResponse;
    
    // Otherwise proceed with auth middleware
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        )
          return true;

        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
