import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const digitalisasidokSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  periode: z.coerce.date({ required_error: "Periode wajib diisi" }),
  dokumenTerdigitalisasi: z.coerce
    .number()
    .min(1, "Jumlah Dokumen wajib diisi"),
  totalDokdigitalisasi: z.coerce.number().min(1, "Jumlah Dokumen wajib diisi"),
  catatanDigitalDok: z.string().optional(),
});

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN); //verifikasi token input harus login dulu

    const body = await req.json();
    const parsed = digitalisasidokSchema.parse(body);

    const createData = await prisma.digitalisasidok.create({
      data: {
        name: parsed.name,
        periode: parsed.periode,
        dokumenTerdigitalisasi: parsed.dokumenTerdigitalisasi,
        totalDokdigitalisasi: parsed.totalDokdigitalisasi,
        catatanDigitalDok: parsed.catatanDigitalDok,
        userId: decode.userId,
      },
    });

    return NextResponse.json({
      message: "Data berhasil dibuat",
      data: createData,
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
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN); //verifikasi token input harus login dulu
    const { userRole: role, userId } = decode;

    const id = req.nextUrl.searchParams.get("id");
    console.log(id);

    if (!id) {
      return NextResponse.json(
        { message: "ID data yang akan dihapus tidak ditemukan" },
        { status: 400 }
      );
    }

    const targetData = await prisma.digitalisasidok.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, role: true },
        },
      },
    });

    if (!targetData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    if (role === "admin") {
      await prisma.digitalisasidok.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        { message: "Data berhasil dihapus oleh admin" },
        { status: 200 }
      );
    }

    if (role === "director") {
      if (targetData.user.id !== userId) {
        return NextResponse.json(
          { message: "Anda tidak memiliki izin untuk menghapus data ini" },
          { status: 403 }
        );
      }

      await prisma.digitalisasidok.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        { message: "Data berhasil dihapus oleh director" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Role tidak dikenali" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menghapus data", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN);
    const role = decode.userRole;
    const userId = decode.userId;

    let getdigitalisasidok;

    if (role === "admin") {
      getdigitalisasidok = await prisma.digitalisasidok.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });
    } else if (role === "director") {
      getdigitalisasidok = await prisma.digitalisasidok.findMany({
        where: {
          user: {
            role: "director", // hanya data yang dibuat oleh director
            id: userId, // hanya data milik director itu sendiri
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });
    } else {
      return NextResponse.json(
        { message: "Role tidak dikenali" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Data berhasil diambil",
      data: getdigitalisasidok,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
