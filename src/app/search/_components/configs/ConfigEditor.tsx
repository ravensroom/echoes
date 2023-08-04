'use client';

import { ConfigData } from '@/lib/validators/config';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  MagnifyingGlassCircleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/react/24/outline';
import Input from './input/Input';
import configAction from '../../_actions/configAction';
import { toast } from 'react-hot-toast';
import useSearchStore from '../../_stores/searchStore';
import { useQuery } from '@tanstack/react-query';
import searchAction from '../../_actions/searchAction';

const Button = ({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <button
      className="px-2 py-1 text-sm sm:text-base rounded-sm font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-700 active:bg-zinc-600"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children || title}
    </button>
  );
};

const ConfigEditor = ({ config }: { config: ConfigData }) => {
  const [formData, setFormData] = useState<ConfigData['body']>(config.body);

  useEffect(() => {
    setFormData(config.body);
  }, [config]);

  // Search handlers
  const searchStore = useSearchStore();
  const { remove: cancelFetching } = useQuery({
    queryFn: () => searchAction.fetch(searchStore.searchId),
    enabled: !!searchStore.searchId,
    refetchInterval: 50,
    queryKey: ['search-results'],
    onSuccess: (data) => {
      searchStore.setSearchResults(data);
    },
  });
  useQuery({
    queryFn: () => searchAction.getSearchFinished(searchStore.searchId),
    enabled: !!searchStore.searchId,
    refetchInterval: 2000,
    onSuccess: (data) => {
      if (data === '1') searchStore.rmSearchId();
    },
    queryKey: ['scraper-finished-signal'],
  });

  // Form data handlers
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAdd = (name: string, value: string) => {
    setFormData((prevFormData) => {
      //@ts-ignore
      const data = formData[name];
      let newData = data;
      if (Array.isArray(data)) {
        if (!data.includes(value)) {
          newData = [...data, value];
        } else return prevFormData;
      } else {
        const [key, val] = value.split(':');
        newData = {
          ...data,
          [key]: Number(val),
        };
      }

      return {
        ...prevFormData,
        [name]: newData,
      };
    });
  };

  const handleDelete = (name: string, value: string) => {
    setFormData((prevFormData) => {
      //@ts-ignore
      const data = formData[name];
      let newData;

      if (Array.isArray(data)) {
        newData = data.filter((val) => val !== value);
      } else {
        const key = value.split(':')[0];
        newData = { ...data };
        delete newData[key];
      }

      return {
        ...prevFormData,
        [name]: newData,
      };
    });
  };

  return (
    <div>
      <form className="flex flex-col gap-2 py-3 px-2 bg-zinc-200">
        <Input
          icon={MagnifyingGlassCircleIcon}
          name="listOfSearchKeywords"
          tip="Add search queries"
          placeholder="data scientist"
          data={formData.listOfSearchKeywords}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
        <Input
          icon={CheckCircleIcon}
          name="titleIncludes"
          tip="Add keywords that job titles should include"
          placeholder="senior"
          data={formData.titleIncludes}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
        <Input
          icon={XCircleIcon}
          name="titleExcludes"
          tip="Add keywords that job titles should exclude"
          placeholder="junior"
          data={formData.titleExcludes}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
        <Input
          icon={AdjustmentsVerticalIcon}
          name="priorityList"
          tip="Add priorityList to words found in job descriptions"
          placeholder="startup:100"
          data={formData.priorityList}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
        <div className="flex gap-1 max-w-[510px]">
          <div className="flex-1">
            <Input
              icon={MapPinIcon}
              name="location"
              placeholder="united states"
              data={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <Input
              icon={CalendarDaysIcon}
              name="timeRange"
              data={formData.timeRange}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button
            title="Clear all"
            onClick={() => {
              setFormData({
                location: '',
                timeRange: 'DAY',
                listOfSearchKeywords: [],
                titleIncludes: [],
                titleExcludes: [],
                priorityList: {},
              });
            }}
          />
          <Button
            title="Save"
            onClick={async () => {
              await configAction.saveConfig({
                ...config,
                id: config.id!,
                body: formData,
              });
              toast.success('Search config saved!');
            }}
          />
          <Button
            title="Search"
            onClick={async () => {
              if (searchStore.searchId) {
                cancelFetching();
                searchAction.cancel(searchStore.searchId);
                searchStore.rmSearchId();
                return;
              }
              if (searchStore.searchResults) {
                searchStore.rmSearchResults();
              }
              const searchId = await searchAction.start({
                ...config,
                body: formData,
              });
              searchStore.setSearchId(searchId);
            }}
          >
            {searchStore.searchId ? (
              <span className="running-dot font-bold"></span>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConfigEditor;
