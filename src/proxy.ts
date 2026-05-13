import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Evitar loops: Se for a página de login ou ficheiro estático, ignora
  if (pathname.startsWith("/login") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // 2. Se não houver token, redireciona APENAS se não estiver no login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configuração atualizada para o Next 16
export const config = {
  matcher: [
    /*
     * Match todas as rotas exceto:
     * 1. api (rotas de API)
     * 2. _next/static (ficheiros estáticos)
     * 3. _next/image (otimização de imagem)
     * 4. favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
