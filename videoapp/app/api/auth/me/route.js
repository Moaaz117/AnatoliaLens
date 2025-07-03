import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) return new Response(null, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return new Response(null, { status: 401 });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch {
    return new Response(null, { status: 401 });
  }
}