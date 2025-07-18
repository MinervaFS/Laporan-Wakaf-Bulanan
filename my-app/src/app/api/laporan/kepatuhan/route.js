import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import z from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const kepatuhanhukumSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  periode: z.coerce.date({ required_error: "Periode wajib diisi" }),
  jumlahDokTerintegrasi: z.coerce.number().min(1, "Jumlah Asset wajib diisi"),
  jenisDokBaru: z.string().min(1, "Jenis Doku Baru Wajib Diisi"),
  catatanRegulasi: z.string().optional(),
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
    const parsed = kepatuhanhukumSchema.parse(body);

    const createData = await prisma.kepatuhanhukum.create({
      data: {
        name: parsed.name,
        periode: parsed.periode,
        jumlahDokTerintegrasi: parsed.jumlahDokTerintegrasi,
        jenisDokBaru: parsed.jenisDokBaru,
        catatanRegulasi: parsed.catatanRegulasi,
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
    const targetData = await prisma.kepatuhanhukum.findUnique({
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
      await prisma.kepatuhanhukum.delete({
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
      await prisma.kepatuhanhukum.delete({
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

    let getkepatuhanhukum;

    if (role === "admin") {
      getkepatuhanhukum = await prisma.kepatuhanhukum.findMany({
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
      getkepatuhanhukum = await prisma.kepatuhanhukum.findMany({
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
      data: getkepatuhanhukum,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
