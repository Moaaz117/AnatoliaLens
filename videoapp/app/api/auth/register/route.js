import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const formData = await req.formData();
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const avatarFile = formData.get('avatar');

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ message: 'Eksik alanlar var' }), { status: 400 });
  }

  await connectDB();

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'Kullanıcı zaten kayıtlı' }), { status: 400 });
  }

  let avatarUrl = null;

if (avatarFile && avatarFile.name) {
  const buffer = Buffer.from(await avatarFile.arrayBuffer());
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'avatars' },
      (err, res) => {
        if (err) reject(err);
        else resolve(res);
      }
    );
    stream.end(buffer);
  });
  avatarUrl = result.secure_url;
}

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = await User.create({
  username,
  email,
  password: hashedPassword,
  ...(avatarUrl && { avatar: avatarUrl }),
});

  return new Response(JSON.stringify({ message: 'Kayıt başarılı' }), { status: 201 });
}