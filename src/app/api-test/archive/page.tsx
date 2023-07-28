'use client';

import { ArchiveData } from '@/lib/validators/archive';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const ARCHIVE_URL = '/api/archive';

const Page = () => {
  const q = useQueryClient();
  const { data: session } = useSession();
  const { mutate: createArchive } = useMutation({
    mutationFn: async (archive: ArchiveData) => {
      const { data } = await axios.post(ARCHIVE_URL, archive);
      return data as ArchiveData;
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      toast.success(`archive ${data.name} created`);
      q.refetchQueries(['get-all-archives']);
    },
  });

  const { data: archives } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(ARCHIVE_URL);
      return data as (ArchiveData & { id: string })[];
    },
    queryKey: ['get-all-archives'],
  });

  const { mutate: deleteArchive } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`${ARCHIVE_URL}?id=${id}`);
      return data;
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      q.refetchQueries(['get-all-archives']);
      toast.success('archive deleted');
    },
  });

  const { mutate: updateArchive } = useMutation({
    mutationFn: async (updatedConfig: ArchiveData & { id: string }) => {
      const { data } = await axios.patch(ARCHIVE_URL, updatedConfig);
      return data as ArchiveData & { id: string };
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      toast.success(`archive updated`);
      q.refetchQueries(['get-all-archives']);
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-2">
        {session ? (
          <button onClick={() => signOut()} className={``}>
            Sign Out
          </button>
        ) : (
          <Link href="/sign-in" className={``}>
            Sign In
          </Link>
        )}

        <div>
          <button onClick={() => createArchive({ name: 'New Archive' })}>
            create an archive
          </button>
        </div>

        <div>
          {!archives && <p>loading configs...</p>}
          {archives?.map((a) => (
            <li key={a.id} className="flex gap-3">
              <span>{a.name}</span>
              <button
                onClick={() =>
                  updateArchive({ id: a.id!, name: 'Updated archive' })
                }
              >
                update
              </button>
              <button onClick={() => deleteArchive(a.id!)}>delete</button>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
