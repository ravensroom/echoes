'use client';

import useUserId from '@/hooks/useUserId';

export default function Home() {
  useUserId();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      echoes
    </main>
  );
}
