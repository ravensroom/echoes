import Providers from '@/components/root/Providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/root/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Echoes',
  description: 'A Swiss knife for sourcing, managing, and sharing jobs',
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />

          {authModal}
          <div className="min-h-screen p-4 bg-gradient-to-br from-gray-200  via-gray-100 to-gray-200">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
