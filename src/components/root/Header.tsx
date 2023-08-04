'use client';

import {
  ChatBubbleBottomCenterTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import UserAccountNav from './UserAccountNav';
import { usePathname } from 'next/navigation';
import useUserId from '@/hooks/useUserId';
import { Chonburi } from 'next/font/google';

const logoFont = Chonburi({ weight: '400', subsets: ['latin'] });

const navLinkStyle =
  'flex items-center px-2 py-3 sm:px-6 font-semibold rounded-sm hover:cursor-pointer hover:text-zinc-800 text-zinc-600 hover:bg-zinc-100 ';

const navIconStyle = `h-5 w-5`;
const navLinks = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeIcon className={`${navIconStyle}`} />,
  },
  {
    name: 'Search',
    href: '/search',
    icon: <MagnifyingGlassIcon className={`${navIconStyle}`} />,
  },
  {
    name: 'Forum',
    href: '/forum',
    icon: <ChatBubbleBottomCenterTextIcon className={`${navIconStyle}`} />,
  },
];

const Header = () => {
  const pathname = usePathname();
  const { session } = useUserId();
  return (
    <div className="w-full h-15 flex justify-between items-center sm:pl-10 sm:pr-5 pr-3 border-b-2 border-zinc-200 bg-zinc-50">
      <div className={`flex`}>
        <Link href={'/'} className="text-lg font-bold px-2 text-gray-400">
          {`o))`}
        </Link>
        <Link
          href={'/'}
          className={`${logoFont.className} font-bold text-xl hidden sm:block text-gray-700`}
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
              <span className="inline-flex flex-grow gap-2 items-center">
                <span className={`px-2 sm:px-0`}>{link.icon}</span>
                <span
                  className={`${
                    isActive ? 'text-zinc-800' : ''
                  } hidden sm:inline-block`}
                >
                  {link.name}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      {session ? (
        <UserAccountNav />
      ) : (
        <Link href={'/sign-in'}>
          <span className="hidden sm:block py-1 px-2 rounded-sm font-semibold bg-zinc-900 text-zinc-200 hover:bg-zinc-700 active:bg-zinc-500">
            Sign in
          </span>
          <ArrowRightOnRectangleIcon className={`${navIconStyle} sm:hidden`} />
        </Link>
      )}
    </div>
  );
};

export default Header;
