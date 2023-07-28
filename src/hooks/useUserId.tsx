import { createId } from '@paralleldrive/cuid2';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface UseUserIdHook {
  userId: String | undefined;
}

const useUserId = (): UseUserIdHook => {
  const { data: session } = useSession();
  const [cookies, setCookie, removeCookie] = useCookies(['anon_userId']);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (session) {
      if (cookies.anon_userId) {
        removeCookie('anon_userId', { path: '/' });
      }
      setUserId(session.user.id);
    } else {
      if (!cookies.anon_userId) {
        const id = createId();
        // expires 30 days from now
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        setCookie('anon_userId', `anon-${id}`, {
          path: '/',
          expires: expirationDate,
        });
      }
      setUserId(cookies.anon_userId);
    }
  }, [session, cookies.anon_userId, setCookie, removeCookie]);

  return { userId };
};

export default useUserId;
