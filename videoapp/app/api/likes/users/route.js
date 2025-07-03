import connectDB from '@/lib/db';
import Like from '@/models/Like';
import User from '@/models/User';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return new Response('Video ID gerekli', { status: 400 });
  }

  try {
    await connectDB();
    const likes = await Like.find({ video: videoId }).populate('user', 'username');
    const users = likes.map(like => like.user?.username).filter(Boolean);
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    return new Response('Hata: ' + error.message, { status: 500 });
  }
}