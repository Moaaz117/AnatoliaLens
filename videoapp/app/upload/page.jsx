'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = e => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!videoFile) {
      setError('Lütfen bir video dosyası seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);

    const res = await fetch('/api/videos/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message || 'Yükleme başarısız.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Video Yükle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Video Başlığı"
          className="w-full text-black border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Açıklama (isteğe bağlı)"
          className="w-full text-black border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input type="file" accept="video/*" onChange={handleFileChange} required />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600 transition"
        >
          Yükle
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}