import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, password } = await req.json();
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!email || !password) {
    return NextResponse.json({ message: 'Eksik alanlar var' }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Şifre yanlış' }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

  const res = NextResponse.json({ message: 'Giriş başarılı' });

  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}