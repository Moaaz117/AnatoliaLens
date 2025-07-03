import connectDB from '@/lib/db';
import Video from '@/models/Video';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return new Response(null, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();

    const videos = await Video.find({ uploader: decoded.id }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(videos), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Hata: ' + error.message }), { status: 500 });
  }
}