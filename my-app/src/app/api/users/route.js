import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { cookies } from "next/headers";
export async function GET() {
  try {
    const cookieStore = await cookies();
    const getToken = cookieStore.get("token");

    if (!getToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const getUsers = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Data berhasil diambil",
      data: getUsers,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
