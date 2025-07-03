import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(_, { params }) {
  const token = cookies().get('token')?.value;
  if (!token) return new Response(null, { status: 401 });

  const { commentId } = params;

  try {
    await connectDB();
    const decoded = jwt.verify(token, JWT_SECRET);

    const comment = await Comment.findById(commentId);
    if (!comment || comment.user.toString() !== decoded.id) {
      return new Response('Yetkisiz', { status: 403 });
    }

    await Comment.findByIdAndDelete(commentId);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Silme hatası:', error);
    return new Response('Hata: ' + error.message, { status: 500 });
  }
}