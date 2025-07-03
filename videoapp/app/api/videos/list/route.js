import connectDB from '@/lib/db';
import Video from '@/models/Video';

export async function GET() {
  try {
    await connectDB();

    const videos = await Video.find()
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Videolar alınamadı', error: error.message }),
      { status: 500 }
    );
  }
}