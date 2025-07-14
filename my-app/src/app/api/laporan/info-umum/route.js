import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const infoUmumSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  periode: z
    .string()
    .min(1, "Periode wajib diisi")
    .transform((val) => new Date(val)),
});

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(getToken.value, process.env.SECRET_TOKEN); //verifikasi token input harus login dulu

    const body = await req.json();
    const parsed = infoUmumSchema.parse(body);

    const createData = await prisma.infoumum.create({
      data: {
        name: parsed.name,
        periode: parsed.periode,
      },
    });

    return NextResponse.json({
      message: "Info Umum created successfully",
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
    const role = decode.role;

    if (role !== "admin") {
      return NextResponse.json(
        { message: "Hanya admin yang bisa menghapus seluruh data" },
        { status: 403 }
      );
    }

    const id = req.nextUrl.searchParams.get("id");
    const deleteData = await prisma.infoumum.delete({
      where: {
        id: id,
      },
    });
    if (!deleteData) {
      return NextResponse.json({ message: "Data tidak ditemukan" });
    } else {
      return NextResponse.json(
        { message: "Delete data berhasil" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
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
    const role = decode.role;

    // Hanya admin yang boleh melihat semua data
    if (role !== "admin") {
      return NextResponse.json(
        { message: "Hanya admin yang bisa melihat data ini" },
        { status: 403 }
      );
    }

    const getInfoUmum = await prisma.infoumum.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Data berhasil diambil",
      data: getInfoUmum,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
