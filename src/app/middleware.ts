// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/ssr"; // NUEVO
import { Database } from "./types/supabase"; // tu tipo generado desde Supabase

function getSubdomain(host: string): string | null {
  const [hostname] = host.split(":");

  if (hostname.endsWith("localhost")) {
    const match = hostname.match(/^([^.]+)\.localhost$/);
    return match ? match[1] : null;
  }

  if (hostname.endsWith(".foodynow.com.ar")) {
    const match = hostname.match(/^([^.]+)\.foodynow\.com\.ar$/);
    return match ? match[1] : null;
  }

  if (hostname.endsWith(".vercel.app")) {
    const match = hostname.match(/^([^.]+)\.[^.]+\.vercel\.app$/);
    return match ? match[1] : null;
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;
  const subdomain = getSubdomain(host);

  const isStaticAsset = pathname.startsWith("/_next")
    || pathname.startsWith("/api")
    || ["/favicon.ico", "/robots.txt", "/sitemap.xml"].includes(pathname);

  if (isStaticAsset || !subdomain) {
    return NextResponse.next();
  }

  // ⚙️ Supabase SSR
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // usa la Service Role para el middleware (solo para lectura segura)
  );

  const { data: merchant, error } = await supabase
    .from("merchants")
    .select("id, name")
    .eq("subdomain", subdomain)
    .single();

  if (error || !merchant) {
    const notFoundUrl = req.nextUrl.clone();
    notFoundUrl.pathname = "/not-found";
    return NextResponse.rewrite(notFoundUrl);
  }

  const res = NextResponse.next();
  res.headers.set("x-merchant-id", merchant.id);
  res.cookies.set("merchant_id", merchant.id, {
    path: "/",
    httpOnly: true,
  });

  return res;
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)",
};
