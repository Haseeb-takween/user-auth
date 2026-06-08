import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
	try {
		const { name, email, password } = await req.json();
		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 },
			);
		}
		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Password must be at least 6 characters long' },
				{ status: 400 },
			);
		}
		if (!email.includes('@')) {
			return NextResponse.json(
				{ error: 'Invalid email address' },
				{ status: 400 },
			);
		}
		if (!name.trim()) {
			return NextResponse.json({ error: 'Name is required' }, { status: 400 });
		}
		await connectDB();
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 },
			);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword });

		return NextResponse.json(
			{ message: 'User created successfully' },
			{ status: 201 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 },
		);
	}
}
