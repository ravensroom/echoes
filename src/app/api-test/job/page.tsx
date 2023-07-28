'use client';

import { ConfigData } from '@/lib/validators/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { JobData } from '@/lib/validators/job';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { signOut, useSession } from 'next-auth/react';

const SEARCH_URL = '/api/job/search';
const SEARCH_SIGNAL_URL = '/api/job/search/signal';

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

const Page = () => {
  const [searchId, setSearchId] = useState('');
  const { data: session } = useSession();

  const { mutate: search, isLoading: isSearching } = useMutation({
    mutationFn: async (config: ConfigData) => {
      const { data } = await axios.post(SEARCH_URL, config);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error('Please login');
        }

        if (err.response?.status === 422) {
          return toast.error('Invalid payload');
        }
      }
      toast.error('Internal server error');
    },
    onSuccess: (searchId) => {
      setSearchId(searchId);
      toast.success('Search started');
    },
  });

  const {
    data: jobs,
    isFetched,
    remove: cancelFetching,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${SEARCH_URL}?searchId=${searchId}`);
      return data as JobData[];
    },
    enabled: !!searchId,
    refetchInterval: 50,
    queryKey: ['search-results'],
  });

  const { mutate: cancel, isLoading: iscancelling } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `${SEARCH_SIGNAL_URL}?searchId=${searchId}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error('Please login');
        }

        if (err.response?.status === 422) {
          return toast.error(err.message);
        }
      }
      alert('Internal server error');
    },
    onSuccess: () => {
      setSearchId('');
      alert('Search stopped!');
    },
  });

  useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${SEARCH_SIGNAL_URL}?searchId=${searchId}`
      );
      return data;
    },
    enabled: !!searchId,
    refetchInterval: 2000,
    onSuccess: (data) => {
      if (data === '1') setSearchId('');
    },
    queryKey: ['scraper-finished-signal'],
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div className="flex flex-col gap-2">
          {session ? (
            <button
              onClick={(event) => {
                event.preventDefault();
                signOut({
                  callbackUrl: `${window.location.origin}`,
                });
              }}
              className={``}
            >
              Sign Out
            </button>
          ) : (
            <Link href="/sign-in" className={``}>
              Sign In
            </Link>
          )}
          <button
            onClick={() => {
              search(config);
            }}
            disabled={isSearching}
            className='p-2 bg-zinc-300 hover:bg-zinc-400 active:bg-zinc-500 rounded-sm"'
          >
            search
          </button>
          <button
            onClick={() => {
              if (!searchId) return;
              cancel();
              cancelFetching();
            }}
            disabled={iscancelling}
            className='p-2 bg-zinc-300 hover:bg-zinc-400 active:bg-zinc-500 rounded-sm"'
          >
            cancel
          </button>
        </div>
        <div>SearchId: {searchId}</div>
        <div>
          {isFetched &&
            jobs &&
            jobs.map((job) => <li key={job.id}>{job.body.title}</li>)}
        </div>
      </div>
    </div>
  );
};

export default Page;