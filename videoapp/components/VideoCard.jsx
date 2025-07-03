'use client';

export default function VideoCard({ video }) {
  const avatar = video?.uploader?.avatar?.startsWith('http')
    ? video.uploader.avatar
    : 'https://res.cloudinary.com/dj0qa9q59/image/upload/v1747826128/avatar_ploxje.jpg';

  return (
    <div
      className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700 shadow-md hover:scale-105 transition-transform duration-200"
      style={{ width: '100%', maxWidth: '360px', margin: 'auto' }}
    >
      {/* Video */}
      <a href={`/video/${video._id}`} className="block">
        <video
          src={video.url}
          muted
          preload="metadata"
          className="object-cover"
          style={{ width: '100%', height: '180px' }}
        />
      </a>

      {/* Video Info */}
      <div
        className="p-4"
        style={{ padding: '16px' }}
      >
        {/* Video Title */}
        <h3
          className="text-white text-sm font-semibold line-clamp-2 mb-2"
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            lineHeight: '1.5',
            marginBottom: '8px',
          }}
        >
          {video.title}
        </h3>

        {/* Uploader Info */}
        <div
          className="flex items-center gap-3"
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          {/* Avatar */}
          <img
            src={avatar}
            alt="avatar"
            className="rounded-full object-cover border border-zinc-500"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              border: '2px solid #4A4A4A',
              objectFit: 'cover',
            }}
          />

          {/* Username */}
          <span
            className="text-zinc-400 text-sm truncate"
            style={{
              fontSize: '0.875rem',
              color: '#A3A3A3',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {video.uploader?.username || 'Kullanıcı'}
          </span>
        </div>
      </div>
    </div>
  );
}