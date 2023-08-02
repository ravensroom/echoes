'use client';

import {
  ChatBubbleBottomCenterTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import UserAccountNav from './UserAccountNav';
import { usePathname } from 'next/navigation';
import useUserId from '@/hooks/useUserId';

const navLinkStyle =
  'px-3 py-3 sm:px-6 font-semibold rounded-sm hover:cursor-pointer hover:text-zinc-800 text-zinc-600 hover:bg-zinc-100 ';

const navLinks = [
  {
    name: 'Home',
    href: '/',
    icon: <HomeIcon className="h-6 w-6 " />,
  },
  {
    name: 'Search',
    href: '/search',
    icon: <MagnifyingGlassIcon className="h-6 w-6" />,
  },
  {
    name: 'Forum',
    href: '/forum',
    icon: <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />,
  },
];

const Header = () => {
  const pathname = usePathname();
  const { session } = useUserId();
  return (
    <div className="w-full h-15 flex justify-between items-center sm:pl-10 sm:pr-5 pr-3 border-b-2 border-zinc-200 bg-zinc-50">
      <div className="flex">
        <Link href={'/'} className="text-lg font-bold px-2 text-gray-400">
          {`o))`}
        </Link>
        <Link
          href={'/'}
          className="font-bold text-xl hidden sm:block text-gray-700"
        >
          Echoes
        </Link>
      </div>

      <div className="flex items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${navLinkStyle} ${
                isActive ? `border-b-2 border-zinc-800 text-zinc-800` : ''
              }`}
            >
              <span className="inline-flex gap-2">
                <span>{link.icon}</span>
                <span className="hidden sm:inline-block">{link.name}</span>
              </span>
            </Link>
          );
        })}
      </div>
      {session ? (
        <UserAccountNav />
      ) : (
        <Link
          href={'/sign-in'}
          className="py-1 px-2 rounded-sm bg-zinc-900 text-zinc-200 hover:bg-zinc-700 active:bg-zinc-500"
        >
          Sign in
        </Link>
      )}
    </div>
  );
};

export default Header;
