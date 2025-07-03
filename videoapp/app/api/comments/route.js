import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return new Response(null, { status: 401 });

  const { videoId, text } = await req.json();
  if (!videoId || !text) return new Response('Eksik veri', { status: 400 });

  try {
    await connectDB();
    const decoded = jwt.verify(token, JWT_SECRET);

    const comment = await Comment.create({ user: decoded.id, video: videoId, text });
    const populated = await comment.populate('user', 'username avatar');

    return new Response(JSON.stringify({
      _id: populated._id,
      text: populated.text,
      user: populated.user,
      isOwner: true,
      createdAt: populated.createdAt,
    }), { status: 201 });
  } catch (error) {
    return new Response('Hata: ' + error.message, { status: 500 });
  }
}