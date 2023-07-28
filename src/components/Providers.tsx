'use client';

import useUserId from '@/hooks/useUserId';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { CookiesProvider } from 'react-cookie';

const UserStatus = ({ children }: { children: React.ReactNode }) => {
  useUserId();
  return <>{children}</>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <CookiesProvider>
          <UserStatus>{children}</UserStatus>
        </CookiesProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
