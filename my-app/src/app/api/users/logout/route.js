import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretToken = process.env.SECRET_TOKEN;

export async function POST(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Tidak ada session yang aktif" },
        { status: 401 }
      );
    }

    // Verify token (optional - to make sure it's valid before logout)
    try {
      jwt.verify(token, secretToken);
    } catch (error) {
      // Token invalid, but we still want to clear the cookie
      console.log("Invalid token during logout:", error.message);
    }

    // Create response
    const response = NextResponse.json(
      { message: "Logout berhasil" },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Alternative: GET method for logout (if you prefer)
export async function GET(req) {
  try {
    const response = NextResponse.json(
      { message: "Logout berhasil" },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
