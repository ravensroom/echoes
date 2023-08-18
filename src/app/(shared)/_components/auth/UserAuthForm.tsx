'use client';

import { signIn } from 'next-auth/react';
import * as React from 'react';
import toast from 'react-hot-toast';
import { BsGithub, BsGoogle } from 'react-icons/bs';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action)
      .then((callback) => {
        if (callback?.error) toast.error('Failed to login');
        if (callback?.ok && !callback?.error) toast.success('Logged in!');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => socialAction('google')}
        disabled={isLoading}
        className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
      >
        <BsGoogle />
      </button>
      <button
        onClick={() => socialAction('github')}
        disabled={isLoading}
        className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
      >
        <BsGithub />
      </button>
    </div>
  );
};

export default UserAuthForm;
