'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-10 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <Image
            src="/anatoliaLens.png"
            alt="Logo"
            width={200}
            height={80}
            className="mb-2"
          />
        </div>
        <div>
          <h4 className="font-semibold mb-2">Bağlantılar</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:underline">Ana Sayfa</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">İletişim</h4>
          <p className="text-sm">info@anatolialens.com</p>
          <p className="text-sm">+90 58 58 58 58</p>
          <div className="flex space-x-4 mt-2 text-xl">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-75">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-75">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs mt-8 opacity-50">
        © {new Date().getFullYear()} Tüm hakları saklıdır. &nbsp;|&nbsp; 
          Moaaz Antar
        tarafından tasarlandı.
      </div>
    </footer>
  );
}