import { NextResponse } from "next/server";
import sequelize from "../../../../../lib/connect-db";
import User from "../../../../../lib/model/Auth";

export async function POST(req) {
  try {
    await sequelize.authenticate(); // pastikan DB terkoneksi

    const body = await req.json(); // ambil data dari request body

    const user = await User.create({
      username: body.username,
      email: body.email,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await sequelize.authenticate();

    const users = await User.findAll();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
