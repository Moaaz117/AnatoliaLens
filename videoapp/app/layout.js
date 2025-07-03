import Footer from '@/components/Footer';
import './global.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'VideoApp',
  description: 'Next.js video yükleme sitesi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-800 min-h-screen flex flex-col text-white">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto p-6">{children}</main>
        <Footer className=""/>
      </body>
    </html>
  );
}