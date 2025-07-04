import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretToken = process.env.SECRET_TOKEN;

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secret = new TextEncoder().encode(secretToken);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.userRole;
    const pathname = req.nextUrl.pathname;

    // Route khusus admin
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard/admin")
    ) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Route khusus director
    if (
      pathname.startsWith("/director") ||
      pathname.startsWith("/dashboard/director")
    ) {
      if (role !== "director") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Route umum untuk semua role
    const allowRoles = ["admin", "director"];
    if (pathname.startsWith("/profile") && !allowRoles.includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
export const config = {
  matcher: [
    "/admin/:path*",
    "/director/:path*",
    "/dashboard/admin/:path*",
    "/dashboard/director/:path*",
    "/profile/:path*",
  ],
};
