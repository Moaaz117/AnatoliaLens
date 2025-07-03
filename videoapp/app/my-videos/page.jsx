'use client';
import { useEffect, useState } from 'react';
import VideoCard from '@/components/VideoCard';

export default function MyVideosPage() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  const fetchMyVideos = async () => {
    setError('');
    const res = await fetch('/api/videos/my');
    if (res.ok) {
      const data = await res.json();
      setVideos(data);
    } else {
      setError('Videolar yüklenemedi.');
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const handleDelete = async id => {
    if (!confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;

    const res = await fetch(`/api/videos/delete?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setVideos(videos.filter(v => v._id !== id));
    } else {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Videolarım</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {videos.length === 0 && (
        <p className="text-gray-600">Henüz video yüklememişsiniz.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video._id} className="relative">
            <VideoCard video={video} />
            <button
              onClick={() => handleDelete(video._id)}
              className="absolute top-2 right-2 bg-red-600 text-white py-1 px-4 rounded-full hover:bg-red-700"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}