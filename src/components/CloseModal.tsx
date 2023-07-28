'use client';

import { useRouter } from 'next/navigation';

const CloseModal = () => {
  const router = useRouter();

  return (
    <button className="h-6 w-6 rounded-md" onClick={() => router.back()}>
      <div className="h-4 w-4">x</div>
    </button>
  );
};

export default CloseModal;
