import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  const { videoId } = params;

  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    let userId = null;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    }

    const comments = await Comment.find({ video: videoId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    const enriched = comments.map(comment => ({
      _id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      user: comment.user,
      isOwner: userId && comment.user?._id.toString() === userId.toString(),
    }));

    return new Response(JSON.stringify(enriched), { status: 200 });
  } catch (error) {
    return new Response('Hata: ' + error.message, { status: 500 });
  }
}