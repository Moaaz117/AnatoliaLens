'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return;

    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md relative z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={handleLinkClick}>
          <img
            src="/anatoliaLens.png"
            alt="Anatolia Lens"
            style={{ height: '50px', width: 'auto' }}
          />
        </Link>

        {/* Hamburger menu button (mobil) */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Masaüstü menü */}
        <div className="hidden lg:flex items-center gap-6 text-lg">
          {user === undefined ? (
            <span className="text-gray-400 italic">Yükleniyor...</span>
          ) : user ? (
            <>
              <Link href="/upload" className="hover:text-indigo-400 font-medium">
                Video Yükle
              </Link>
              <Link href="/my-videos" className="hover:text-indigo-400 font-medium">
                Videolarım
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-400 font-medium">
                Giriş
              </Link>
              <Link href="/register" className="hover:text-indigo-400 font-medium">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobil menü */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 bg-gray-900 p-4 rounded-md text-lg flex flex-col gap-4">
          {user === undefined ? (
            <span className="text-gray-400 italic">Yükleniyor...</span>
          ) : user ? (
            <>
              <Link
                href="/upload"
                onClick={handleLinkClick}
                className="block hover:text-indigo-400 font-medium"
              >
                Video Yükle
              </Link>
              <Link
                href="/my-videos"
                onClick={handleLinkClick}
                className="block hover:text-indigo-400 font-medium"
              >
                Videolarım
              </Link>
              <button
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold text-left"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="block hover:text-indigo-400 font-medium"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                onClick={handleLinkClick}
                className="block hover:text-indigo-400 font-medium"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}