import Providers from '@/app/(shared)/_components/root/Providers';
import './globals.css';
import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Header from '@/app/(shared)/_components/root/Header';

const inter = Source_Serif_4({ subsets: ['latin'] });

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
          <div className="min-h-screen sm:p-4 bg-gradient-to-br from-zinc-800  via-zinc-700 to-zinc-800">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
