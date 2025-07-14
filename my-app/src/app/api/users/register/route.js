import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const userSchema = z.object({
  username: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = userSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar", status: 400 },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        username: parsed.username,
        email: parsed.email,
        password: hashedPassword,
        // role: "user",
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validasi tidak sesuai", errors: error.errors, status: 400 },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
        error: error.message,
        status: 500,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Ambil semua user dari database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: users, status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Gagal mengambil data user",
        error: error.message,
        status: 500,
      },
      { status: 500 }
    );
  }
}

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
