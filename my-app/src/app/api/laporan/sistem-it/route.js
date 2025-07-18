import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import z from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const sisteminformasiteknologiSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  periode: z.coerce.date({ required_error: "Periode wajib wajib diisi" }),
  pengemabanganSistem: z
    .string()
    .min(1, "Pengembangan sistem diisi")
    .optional(),
  catatanTeknisNonTeknis: z.string().optional(),
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
    const parsed = sisteminformasiteknologiSchema.parse(body);

    const createData = await prisma.sisteminformasiteknologi.create({
      data: {
        name: parsed.name,
        periode: parsed.periode,
        pengemabanganSistem: parsed.pengemabanganSistem,
        catatanTeknisNonTeknis: parsed.catatanTeknisNonTeknis,
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
      console.log("ZOD ERROR:", error.errors);
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

    const decode = jwt.verify(getToken.value, process.env.SECRET_TOKEN);
    const { userRole: role, userId } = decode;

    // cari lewat parameter di url
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "ID data yang akan dihapus tidak ditemukan" },
        { status: 400 }
      );
    }

    // cari id yg sesuai di database
    const targetData = await prisma.sisteminformasiteknologi.findUnique({
      where: {
        id: parseInt(id),
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

    if (!targetData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek role jika admin makan bisa hapus semua data
    if (role === "admin") {
      await prisma.sisteminformasiteknologi.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        { message: "Data berhasil dihapus oleh admin" },
        { status: 200 }
      );
    }

    // cek jika bukan admin maka hanya bisa menghapus data miliknya saja
    if (role === "director") {
      // Cek apakah data yang ditargetkan (targetData) dimiliki oleh user yang sedang login atau mendapat sebuah token di db
      if (targetData.user.id !== userId) {
        return NextResponse.json(
          { message: "Anda tidak memiliki izin untuk menghapus data ini" },
          { status: 403 }
        );
      }

      // maka dia hanya bisa menghapus berdasarkan role dia karena bukan admin
      await prisma.sisteminformasiteknologi.delete({
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

    let getsisteminformasiteknologi;

    if (role === "admin") {
      getsisteminformasiteknologi =
        await prisma.sisteminformasiteknologi.findMany({
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
      getsisteminformasiteknologi =
        await prisma.sisteminformasiteknologi.findMany({
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
      data: getsisteminformasiteknologi,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
