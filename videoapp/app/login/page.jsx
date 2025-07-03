'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message || 'Giriş başarısız.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Giriş Yap</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full text-black border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          className="w-full text-black border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600 transition"
        >
          Giriş Yap
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}