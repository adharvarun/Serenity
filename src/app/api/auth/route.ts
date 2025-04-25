import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

// In a real app, you would use a database
// For now, we'll use a Map to store users in memory
// Note: This will reset when the server restarts
const users = new Map<string, { name: string; email: string; password: string }>();

// Add some test users for development
if (process.env.NODE_ENV === "development") {
  users.set("test@example.com", {
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  });
}

// Validate environment variables
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in environment variables");
}

export async function POST(req: Request) {
  try {
    const { name, email, password, action } = await req.json();
    console.log("Auth request:", { action, email });

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (action === "signup") {
      if (!name) {
        return NextResponse.json(
          { error: "Name is required for signup" },
          { status: 400 }
        );
      }

      if (users.has(email)) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }

      // Store the new user
      users.set(email, { name, email, password });
      console.log("New user registered:", email);

      // Create JWT token
      const token = sign(
        { name, email },
        process.env.JWT_SECRET || "your-secret-key",
        {
          expiresIn: "7d",
        }
      );

      // Set the cookie
      cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({ name, email });
    }

    if (action === "signin") {
      console.log("Attempting sign in for:", email);
      console.log("Stored users:", Array.from(users.keys()));
      
      const user = users.get(email);
      console.log("Found user:", user ? "Yes" : "No");

      if (!user) {
        console.log("User not found");
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (user.password !== password) {
        console.log("Password mismatch");
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Create JWT token
      const token = sign(
        { name: user.name, email },
        process.env.JWT_SECRET || "your-secret-key",
        {
          expiresIn: "7d",
        }
      );

      // Set the cookie
      cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      console.log("Sign in successful for:", email);
      return NextResponse.json({ name: user.name, email });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
} 