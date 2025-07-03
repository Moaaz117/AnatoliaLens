import connectDB from '@/lib/db';
import Like from '@/models/Like';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req, { params }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return new Response('Unauthorized', { status: 401 });

  const videoId = params.videoId;
  if (!videoId) return new Response('Video ID gerekli', { status: 400 });

  try {
    await connectDB();
    const decoded = jwt.verify(token, JWT_SECRET);

    const existingLike = await Like.findOne({ user: decoded.id, video: videoId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return new Response(JSON.stringify({ liked: false }), { status: 200 });
    } else {
      await Like.create({ user: decoded.id, video: videoId });
      return new Response(JSON.stringify({ liked: true }), { status: 201 });
    }
  } catch (error) {
    return new Response('Hata: ' + error.message, { status: 500 });
  }
}