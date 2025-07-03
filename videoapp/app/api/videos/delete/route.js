import connectDB from '@/lib/db';
import Video from '@/models/Video';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

const JWT_SECRET = process.env.JWT_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return new Response(null, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('id');

    if (!videoId) return new Response(JSON.stringify({ message: 'Video ID gerekli' }), { status: 400 });

    const video = await Video.findById(videoId);
    if (!video) return new Response(JSON.stringify({ message: 'Video bulunamadı' }), { status: 404 });

    if (video.uploader.toString() !== decoded.id) {
      return new Response(JSON.stringify({ message: 'Yetkiniz yok' }), { status: 403 });
    }

    // Cloudinary'den sil
    await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
    // DB'den sil
    await Video.deleteOne({ _id: videoId });

    return new Response(JSON.stringify({ message: 'Video silindi' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Hata: ' + error.message }), { status: 500 });
  }
}