import VideoCard from '@/components/VideoCard';

async function getVideos() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/videos/list`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('API videos/list başarısız:', res.status);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('getVideos hatası:', error);
    return [];
  }
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    <div>
      <h1 className="text-center text-4xl font-bold mb-8 text-white drop-shadow-lg">
        Tüm Videolar
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.length === 0 && (
          <p className="text-gray-300 text-center col-span-full">
            Henüz video yüklenmemiş.
          </p>
        )}
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}