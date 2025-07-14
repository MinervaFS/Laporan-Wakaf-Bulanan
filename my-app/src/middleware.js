import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretToken = process.env.SECRET_TOKEN;

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // Routes yang memerlukan authentication
  const protectedRoutes = ["/admin", "/director", "/dashboard", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes yang tidak boleh diakses jika sudah login
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const secret = new TextEncoder().encode(secretToken);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.userRole;

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
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (isAuthRoute && token) {
    try {
      const secret = new TextEncoder().encode(secretToken);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.userRole;

      // Redirect ke halaman sesuai role
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (role === "director") {
        return NextResponse.redirect(new URL("/director", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      // Token invalid, hapus cookie dan lanjutkan ke auth page
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/director/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};

// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const secretToken = process.env.SECRET_TOKEN;

// export async function middleware(req) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   try {
//     const secret = new TextEncoder().encode(secretToken);
//     const { payload } = await jwtVerify(token, secret);
//     const role = payload.userRole;
//     const pathname = req.nextUrl.pathname;

//     // Route khusus admin
//     if (
//       pathname.startsWith("/admin") ||
//       pathname.startsWith("/dashboard/admin")
//     ) {
//       if (role !== "admin") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }

//     // Route khusus director
//     if (
//       pathname.startsWith("/director") ||
//       pathname.startsWith("/dashboard/director")
//     ) {
//       if (role !== "director") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }

//     // Route umum untuk semua role
//     const allowRoles = ["admin", "director"];
//     if (pathname.startsWith("/profile") && !allowRoles.includes(role)) {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT verification failed:", err.message);
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }
// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/director/:path*",
//     "/dashboard/admin/:path*",
//     "/dashboard/director/:path*",
//     "/profile/:path*",
//   ],
// };
