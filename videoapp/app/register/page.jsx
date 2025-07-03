'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) formData.append('avatar', avatar);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Kayıt başarısız.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Kayıt Ol</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} required className="w-full border text-black border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border text-black border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border text-black border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} />
        <button type="submit" className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600 transition">Kayıt Ol</button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}