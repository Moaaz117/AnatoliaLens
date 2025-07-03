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

export async function POST(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return new Response(null, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('video');
    const title = formData.get('title');
    const description = formData.get('description');

    if (!file || !title) {
      return new Response(JSON.stringify({ message: 'Video ve başlık gereklidir' }), { status: 400 });
    }

    // Cloudinary'ye yükleme
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'videoapp' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const newVideo = await Video.create({
      title,
      description,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      uploader: decoded.id,
    });

    return new Response(JSON.stringify(newVideo), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Hata: ' + error.message }), { status: 500 });
  }
}