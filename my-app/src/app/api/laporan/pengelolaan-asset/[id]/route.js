import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const pengelolaanassetSchema = z.object({
  name: z.string().optional(),
  periode: z.coerce.date().optional(),
  jumlahAssetDikelola: z.coerce.number().optional(),
  penghasialAsset: z.coerce.number().optional(),
  jenisPengelolaanBaru: z.string().optional(),
});

export async function PUT(req, { params }) {
  try {
    const cookieStore = await cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN);
    const role = decode.userRole;
    const userId = decode.userId;

    const { id } = await params;

    const body = await req.json();
    const parsed = pengelolaanassetSchema.parse(body);

    const existing = await prisma.pengelolaanasset.findUnique({
      where: { id: parseInt(id) },
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
    const updated = await prisma.pengelolaanasset.update({
      where: { id: parseInt(id) },
      data: {
        name: parsed.name,
        periode: parsed.periode,
        jumlahAssetDikelola: parsed.jumlahAssetDikelola,
        penghasialAsset: parsed.penghasialAsset,
        jenisPengelolaanBaru: parsed.jenisPengelolaanBaru,
        userId: decode.userId,
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
