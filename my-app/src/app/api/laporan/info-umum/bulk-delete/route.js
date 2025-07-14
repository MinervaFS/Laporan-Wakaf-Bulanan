import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN);
    const role = decode.role;
    const userId = decode.userId;

    const body = await req.json();
    const idsToDelete = body.ids;

    if (!Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return NextResponse.json(
        { message: "ID yang akan dihapus wajib dikirim dalam array" },
        { status: 400 }
      );
    }

    if (role === "admin") {
      // Admin bisa hapus semua
      const result = await prisma.infoumum.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });

      return NextResponse.json(
        { message: `${result.count} data berhasil dihapus oleh admin` },
        { status: 200 }
      );
    } else if (role === "director") {
      // Director hanya boleh hapus milik sendiri
      const result = await prisma.infoumum.deleteMany({
        where: {
          id: { in: idsToDelete },
          userId: userId, // hanya yang sesuai dengan user
        },
      });

      return NextResponse.json(
        { message: `${result.count} data berhasil dihapus oleh director` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Role tidak dikenali" },
        { status: 403 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
