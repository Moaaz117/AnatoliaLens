'use client';

import { useEffect, useState } from 'react';

async function getVideo(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/videos/${id}`, {
    cache: 'no-store',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Video bulunamadı');
  return res.json();
}

export default function VideoDetailPage({ params }) {
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const [showLikesPopup, setShowLikesPopup] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

  const defaultAvatar = 'https://res.cloudinary.com/dj0qa9q59/image/upload/v1747826128/avatar_ploxje.jpg';

  const fetchDetails = async () => {
    try {
      const data = await getVideo(params.id);
      setVideo(data);
      setLikesCount(data.likesCount || 0);
      setLiked(data.likedByUser || false);
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const toggleLike = async () => {
    const res = await fetch(`/api/likes/${params.id}`, {
      method: 'POST',
      body: JSON.stringify({ videoId: params.id }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (res.status === 401) {
      alert('Beğeni gönderebilmek için giriş yapmanız gerekmektedir.');
      return;
    }

    if (res.ok) {
      setLiked(!liked);
      setLikesCount(prev => (liked ? prev - 1 : prev + 1));
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const res = await fetch(`/api/comments/`, {
      method: 'POST',
      body: JSON.stringify({ videoId: params.id, text: commentText }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (res.status === 401) {
      alert('Yorum yapabilmek için giriş yapmanız gerekmektedir.');
      return;
    }

    if (res.ok) {
      const newComment = await res.json();
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const res = await fetch(`/api/comments/delete/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      setComments(prev => prev.filter(c => c._id !== commentId));
    }
  };

  const fetchLikedUsers = async () => {
    const res = await fetch(`/api/likes/users?videoId=${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setLikedUsers(data.users || []);
      setShowLikesPopup(true);
    }
  };

  if (!video) return <p className="text-center mt-8 text-gray-600">Yükleniyor...</p>;

  const avatar = video.uploader?.avatar && video.uploader.avatar.startsWith('http')
    ? video.uploader.avatar
    : defaultAvatar;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{video.title}</h1>

      <video
        src={video.url}
        controls
        className="w-full max-h-[500px] rounded-md shadow-md mb-6"
      />

      <div className="flex items-center gap-3 mb-4">
        <img
          src={avatar}
          alt={`${video.uploader?.username || 'Kullanıcı'} avatar`}
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
        <p className="text-gray-700 font-semibold">Yükleyen: {video.uploader?.username || 'Bilinmiyor'}</p>
      </div>

      <p className="mb-6 text-gray-700 whitespace-pre-line">{video.description || 'Açıklama yok.'}</p>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition ${
            liked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          aria-pressed={liked}
        >
          {liked ? 'Beğendin' : 'Beğen'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? 'white' : 'none'}
            viewBox="0 0 24 24"
            stroke={liked ? 'white' : 'currentColor'}
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <span
          onClick={fetchLikedUsers}
          className="cursor-pointer text-blue-600 font-medium hover:underline"
          aria-label={`${likesCount} kişi beğendi, detayları göster`}
        >
          {likesCount} Beğeni
        </span>
      </div>

      {showLikesPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="likes-popup-title"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <h3 id="likes-popup-title" className="text-lg font-semibold mb-4 text-gray-900">
              Beğenenler
            </h3>
            <button
              onClick={() => setShowLikesPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
              aria-label="Popup kapat"
            >
              ×
            </button>
            {likedUsers.length === 0 ? (
              <p className="text-gray-700">Henüz kimse beğenmemiş.</p>
            ) : (
              <ul className="max-h-64 overflow-y-auto space-y-2">
                {likedUsers.map((username, idx) => (
                  <li
                    key={idx}
                    className="text-gray-800 border-b border-gray-200 pb-1 last:border-none"
                  >
                    {username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Yorumlar */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Yorumlar</h2>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Yorum yaz..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="flex-grow border text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Yorum yaz"
          />
          <button
            onClick={handleAddComment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold transition"
            aria-label="Yorum gönder"
          >
            Gönder
          </button>
        </div>

        {comments.length === 0 ? (
          <p className="text-gray-600 italic">Henüz yorum yapılmamış.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {comments.map(comment => (
              <li
                key={comment._id}
                className="border rounded-md p-3 bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold text-gray-800">{comment.user?.username || 'Anonim'}</p>
                  <p className="text-gray-700 whitespace-pre-line">{comment.text}</p>
                </div>
                {comment.isOwner && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 hover:underline text-sm self-start"
                    aria-label="Yorumu sil"
                  >
                    Sil
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}