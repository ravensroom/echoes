import SignUp from '@/components/auth/SignUp';
import Link from 'next/link';

const page = ({}) => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link href="/" className={``}>
          Home
        </Link>

        <SignUp />
      </div>
    </div>
  );
};

export default page;
