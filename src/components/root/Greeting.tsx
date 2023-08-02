'use client';

import { useSession } from 'next-auth/react';

const Greeting = () => {
  const { data: session } = useSession();
  return (
    <div className="flex gap-2 text-gray-600">
      <span>
        {`> `} Hello, {` `}
      </span>
      <span>{session ? `${session.user.name}.` : 'anonymous user.'}</span>
    </div>
  );
};

export default Greeting;
