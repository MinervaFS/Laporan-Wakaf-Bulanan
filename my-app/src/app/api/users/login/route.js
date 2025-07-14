import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const secretToken = process.env.SECRET_TOKEN;

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak ditemukan", status: 400 },
        { status: 400 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(
      parsed.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Password salah", status: 400 },
        { status: 400 }
      );
    }

    if (!secretToken) {
      console.error("SECRET_TOKEN tidak ditemukan di environment variables");
      return NextResponse.json(
        { message: "Konfigurasi server tidak valid", status: 500 },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userRole: user.role || "user",
      },
      secretToken,
      { expiresIn: "7d" }
    );

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: "Login berhasil",
      user: userWithoutPassword,
      status: 200,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Email & Password harus sesuai",
          errors: error.errors,
          status: 400,
        },
        { status: 400 }
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
        status: 500,
      },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { prisma } from "../../../../../lib/prisma";
// import { z } from "zod";
// import bcrypt from "bcrypt";

// const userSchema = z.object({
//   name: z.string().min(1, "Nama wajib diisi"),
//   email: z.string().email("Email tidak valid"),
//   password: z.string().min(6, "Password minimal 6 karakter"),
// });

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const parsed = userSchema.parse(body);

//     const existingUser = await prisma.user.findUnique({
//       where: { email: parsed.email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "Email sudah terdaftar", status: 400 },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(parsed.password, 10);

//     const user = await prisma.user.create({
//       data: {
//         name: parsed.name,
//         email: parsed.email,
//         password: hashedPassword,
//         // role: "user",
//       },
//     });

//     return NextResponse.json({
//       message: "User created successfully",
//       data: user,
//       status: 200,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { message: "Validasi tidak sesuai", errors: error.errors, status: 400 },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "Terjadi kesalahan server",
//         error: error.message,
//         status: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

// // export async function GET() {
// //   try {
// //     // Ambil semua user dari database
// //     const users = await prisma.user.findMany({
// //       select: {
// //         id: true,
// //         name: true,
// //         email: true,
// //         // role: true,
// //         createdAt: true,
// //       },
// //       orderBy: {
// //         createdAt: "desc",
// //       },
// //     });

// //     return NextResponse.json({ data: users, status: 200 });
// //   } catch (error) {
// //     return NextResponse.json(
// //       {
// //         message: "Gagal mengambil data user",
// //         error: error.message,
// //         status: 500,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// export async function GET() {
//   try {
//     const dataUsers = await prisma.user.findMany();
//     return NextResponse.json({ data: dataUsers, status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: "Terjadi kesalahan server",
//         error: error.message,
//         status: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

// // import { NextResponse } from "next/server";
// // import { prisma } from "../../../../../lib/prisma";
// // import { z } from "zod";
// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";

// // const secretToken = process.env.SECRET_TOKEN;
// // const expiredCookies = 60 * 60 * 24;

// // const loginSchema = z.object({
// //   email: z.string().email("Email tidak valid"),
// //   password: z
// //     .string()
// //     .min(6, "Password minimal 6 karakter")
// //     .max(100, "Password terlalu panjang"),
// // });

// // export async function POST(req) {
// //   try {
// //     const body = await req.json();
// //     const parsed = loginSchema.parse(body);
// //     if (!parsed) {
// //       return NextResponse.json(
// //         {
// //           message: "Data tidak valid",
// //           errors: parsed.error.errors,
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     const { email, password } = parsed.data;

// //     const user = await prisma.user.findUnique({
// //       where: { email },
// //     });
// //     if (!user) {
// //       return NextResponse.json(
// //         {
// //           message: "Akun tidak ditemukan",
// //           errors: parsed.error.errors,
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     const isMatchPw = await bcrypt.compare(password, user.password);
// //     if (!isMatchPw) {
// //       return NextResponse.json(
// //         {
// //           message: "Password tidak sesuai",
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     const token = jwt.sign(
// //       {
// //         userId: user.id,
// //         email: user.email,
// //         role: user.role,
// //       },
// //       secretToken,
// //       { expiresIn: "7d" }
// //     );

// //     const response = NextResponse.json(
// //       {
// //         message: "Login Berhasil",
// //         user: {
// //           userId: user.id,
// //           email: user.email,
// //           role: user.role,
// //         },
// //       },
// //       { status: 200 }
// //     );

// //     response.cookies.set("token", token, {
// //       httpOnly: true,
// //       secure: true, // di production selalu https
// //       maxAge: expiredCookies,
// //       sameSite: "strict",
// //       path: "/",
// //     });
// //     console.log("ENV:", process.env.NODE_ENV);
// //     return response;
// //   } catch (error) {
// //     return NextResponse.json(
// //       {
// //         message: "Failed to login",
// //         error: error.message,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }
