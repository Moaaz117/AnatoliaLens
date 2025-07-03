import connectDB from '@/lib/db';
import Like from '@/models/Like';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return new Response('Video ID gerekli', { status: 400 });
  }

  try {
    await connectDB();
    const count = await Like.countDocuments({ video: videoId });
    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new Response('Hata: ' + error.message, { status: 500 });
  }
}