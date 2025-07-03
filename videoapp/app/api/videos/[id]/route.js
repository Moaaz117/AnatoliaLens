import connectDB from '@/lib/db';
import Video from '@/models/Video';
import Like from '@/models/Like';
import Comment from '@/models/Comment';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const videoId = parts[parts.length - 1];

  await connectDB();

  const video = await Video.findById(videoId).populate('uploader', 'username avatar');
  if (!video) return new Response(JSON.stringify({ message: 'Video bulunamadı' }), { status: 404 });

  // Likes
  const likesCount = await Like.countDocuments({ video: videoId });
  let likedByUser = false;
  try {
    const token = cookies().get('token')?.value;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const like = await Like.findOne({ video: videoId, user: decoded.id });
      likedByUser = !!like;
    }
  } catch (e) {
    likedByUser = false;
  }

  // Comments
  const commentDocs = await Comment.find({ video: videoId })
    .sort({ createdAt: -1 })
    .populate('user', 'username');

  let userId = null;
  try {
    const token = cookies().get('token')?.value;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    }
  } catch {}

  const comments = commentDocs.map(c => ({
    _id: c._id,
    text: c.text,
    user: c.user,
    isOwner: userId === c.user?._id?.toString(),
  }));

  const response = {
    _id: video._id,
    title: video.title,
    description: video.description,
    url: video.url,
    uploader: video.uploader,
    likesCount,
    likedByUser,
    comments,
  };

  return new Response(JSON.stringify(response), { status: 200 });
}