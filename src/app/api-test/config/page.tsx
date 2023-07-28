'use client';

import { ConfigData } from '@/lib/validators/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const CONFIG_URL = '/api/config';

const config: ConfigData = {
  name: 'New Search',
  body: {
    location: 'United States',
    timeRange: 'DAY',
    listOfSearchKeywords: ['software engineer'],
    titleIncludes: [],
    titleExcludes: ['senior'],
    priorityList: {
      citizen: -100,
    },
  },
};

const updatedConfig: ConfigData = {
  name: 'Updated Search',
  body: {
    location: 'United States',
    timeRange: 'DAY',
    listOfSearchKeywords: ['software engineer'],
    titleIncludes: [],
    titleExcludes: ['senior'],
    priorityList: {
      citizen: -100,
    },
  },
};

const Page = () => {
  const q = useQueryClient();
  const { data: session } = useSession();
  const { mutate: createConfig } = useMutation({
    mutationFn: async (config: ConfigData) => {
      const { data } = await axios.post(CONFIG_URL, config);
      return data as ConfigData;
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      toast.success(`config ${data.name} created`);
      q.refetchQueries(['get-all-configs']);
    },
  });

  const { data: configs } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(CONFIG_URL);
      return data as (ConfigData & { id: string })[];
    },
    queryKey: ['get-all-configs'],
  });

  const { mutate: deleteConfig } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`${CONFIG_URL}?id=${id}`);
      return data;
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      q.refetchQueries(['get-all-configs']);
      toast.success('Config deleted');
    },
  });

  const { mutate: updateConfig } = useMutation({
    mutationFn: async (updatedConfig: ConfigData & { id: string }) => {
      const { data } = await axios.patch(CONFIG_URL, updatedConfig);
      return data as ConfigData & { id: string };
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      toast.success(`config ${data.name} updated`);
      q.refetchQueries(['get-all-configs']);
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
          <button onClick={() => createConfig(config)}>create a config</button>
        </div>

        <div>
          {!configs && <p>loading configs...</p>}
          {configs?.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span>{c.name}</span>
              <button
                onClick={() => updateConfig({ id: c.id!, ...updatedConfig })}
              >
                update
              </button>
              <button onClick={() => deleteConfig(c.id!)}>delete</button>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
