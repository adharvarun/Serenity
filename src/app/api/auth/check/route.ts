import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key");
      return NextResponse.json(decoded);
    } catch (error) {
      // Token is invalid or expired
      cookies().delete("token");
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
} 