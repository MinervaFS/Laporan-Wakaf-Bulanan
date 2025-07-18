import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Validasi schema
const infoUmumSchema = z.object({
  name: z.string().optional(),
  periode: z.coerce.date().optional(), // ← pakai coerce agar string -> Date
});

export async function PUT(req, context) {
  try {
    const cookieStore = cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN);
    const role = decode.userRole;
    const userId = decode.userId;

    const { params } = context;
    const id = parseInt(params.id);

    // Ambil dan validasi body
    const body = await req.json();
    const parsed = infoUmumSchema.parse(body);

    // Cari data existing
    const existing = await prisma.infoumum.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hanya admin atau pemilik data yang boleh edit
    if (role !== "admin" && existing.userId !== userId) {
      return NextResponse.json(
        { message: "Anda tidak punya izin untuk mengedit data ini" },
        { status: 403 }
      );
    }

    // Update data
    const updated = await prisma.infoumum.update({
      where: { id },
      data: {
        name: parsed.name,
        periode: parsed.periode,
      },
    });

    return NextResponse.json({
      message: "Data berhasil diubah",
      data: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}

// Validasi input
// const infoUmumSchema = z.object({
//   name: z.string().min(1, "Nama wajib diisi"),
//   periode: z.date({ required_error: "Periode wajib diisi" }),
// });

// export async function PUT(req, { params }) {
//   try {
//     const cookieStore = cookies();
//     const getToken = cookieStore.get("token");

//     if (!getToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN);
//     const role = decode.role;
//     const userId = decode.userId;

//     const id = parseInt(params.id); // ambil ID dari URL
//     const body = await req.json();
//     const parsed = infoUmumSchema.parse(body);

//     // Cek apakah data ada dan sesuai pemiliknya
//     const existing = await prisma.infoumum.findUnique({
//       where: { id },
//     });

//     if (!existing) {
//       return NextResponse.json(
//         { message: "Data tidak ditemukan" },
//         { status: 404 }
//       );
//     }

//     if (role !== "admin" && existing.userId !== userId) {
//       return NextResponse.json(
//         { message: "Anda tidak punya izin untuk mengedit data ini" },
//         { status: 403 }
//       );
//     }

//     const updated = await prisma.infoumum.update({
//       where: { id },
//       data: {
//         name: parsed.name,
//         periode: parsed.periode,
//       },
//     });

//     return NextResponse.json({
//       message: "Data berhasil diubah",
//       data: updated,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { message: "Validasi gagal", errors: error.errors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Terjadi kesalahan server", error: error.message },
//       { status: 500 }
//     );
//   }
// }
