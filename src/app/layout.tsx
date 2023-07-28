import Providers from '@/components/Providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

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
      <body className={inter.className}>
        <Providers>
          {authModal}
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
