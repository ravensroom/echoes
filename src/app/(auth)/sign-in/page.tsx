import SignIn from '@/app/(shared)/_components/auth/SignIn';
import Link from 'next/link';

const page = ({}) => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link href="/" className={``}>
          Home
        </Link>

        <SignIn />
      </div>
    </div>
  );
};

export default page;
