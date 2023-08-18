'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const cardItemStyle =
  'text-sm px-5 py-2 hover:bg-neutral-200 hover:bg-opacity-50 border-b-2 border-zinc-200 active:bg-neutral-300';

const UserAccountNav = () => {
  const { data: session } = useSession();
  const [isCardOpen, setIsCardOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsCardOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!session) return null;
  return (
    <div>
      <div
        className="hover:cursor-pointer"
        onClick={() => setIsCardOpen(!isCardOpen)}
      >
        {session.user.image ? (
          <Image
            className="rounded-full"
            src={session.user.image}
            alt={`user`}
            width={32}
            height={32}
          />
        ) : (
          <button className="rounded-full bg-green-800 text-zinc-200 w-8 h-8">
            {session.user.name ? session.user.name[0] : 'U'}
          </button>
        )}
      </div>

      {isCardOpen && (
        <div
          ref={cardRef}
          className="absolute top-12 right-3 bg-zinc-100 shadow-lg rounded"
        >
          <ul className="flex flex-col">
            <button
              className={`${cardItemStyle}`}
              onClick={() => {
                signOut();
              }}
            >
              Sign out
            </button>
            <Link className={`${cardItemStyle}`} href={'/setting'}>
              Setting
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserAccountNav;
