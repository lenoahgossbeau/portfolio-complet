import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Détecter un sous-domaine (ex: jean-dupont.localhost:3000)
  const parts = host.split('.');

  // En développement : sous-domaine sur localhost
  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    const slug = parts[0];
    // ✅ Rediriger vers la page frontend /researcher/[slug]
    url.pathname = `/researcher/${slug}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Matcher : toutes les routes sauf API, assets statiques, favicon
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
