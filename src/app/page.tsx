import { getAuthSession } from '@/lib/auth';
import Greeting from '../components/root/Greeting';

export default async function Home() {
  const session = await getAuthSession();
  return (
    <main>
      <div className="flex justify-center">
        <Greeting />
      </div>
    </main>
  );
}
