import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(req: Request) {
  try {
  const { email, password } = await req.json();
  if(!email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if(!email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if(!password.trim()) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }
  await connectDB();
  const user = await User.findOne({ email });
  if(!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if(!isPasswordCorrect) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
  const response = NextResponse.json(
    { message: "Login successful", user: { name: user.name, email: user.email } },
    { status: 200 }
  );
  response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30 });
  return response;
} catch (error) {
  console.error(error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

}