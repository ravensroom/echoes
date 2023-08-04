'use client';

import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import configAction from '../../_actions/configAction';
import { useEffect, useState } from 'react';
import ConfigEditor from './ConfigEditor';
import { ConfigData } from '@/lib/validators/config';
import NavElement from '@/components/tabs/NavElement';

const configPlaceholder: ConfigData = {
  name: 'new search',
  body: {
    location: 'united states',
    timeRange: 'DAY',
    listOfSearchKeywords: ['data scientist', 'machine learning engineer'],
    titleIncludes: [],
    titleExcludes: [],
    priorityList: {
      python: 100,
      startup: 100,
      onsite: -50,
    },
  },
};

const navLinkBaseStyle =
  'px-3 py-[5px] text-sm sm:text-base border-r-2 border-t-2 border-b-2 border-zinc-300 text-zinc-800 hover:cursor-pointer hover:bg-zinc-200 active:bg-zinc-100';

const ActionLink = ({
  onClick,
  children,
  classname,
}: {
  onClick: () => void;
  children: React.ReactNode;
  classname?: string;
}) => {
  return (
    <li
      onClick={onClick}
      className={`${navLinkBaseStyle} flex items-center px-[5px] bg-gray-400 active:bg-zinc-200 ${classname}`}
    >
      {children}
    </li>
  );
};

const ConfigTabs = () => {
  const [configs, setConfigs] = useState<ConfigData[] | null>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [editModeIndex, setEditModeIndex] = useState<number | null>(null);
  const [shouldSaveEdit, setshouldSaveEdit] = useState(false);

  useEffect(() => {
    configAction.getConfigs().then((data) => {
      if (data.length) {
        setConfigs(data);
      } else {
        configAction
          .createConfig(configPlaceholder)
          .then((createdFirstConfig) => {
            setConfigs([createdFirstConfig]);
          });
      }
    });
  }, []);

  if (!configs) return null;
  return (
    <div className="flex flex-col rounded-sm border-2 border-t-0 border-r-0 border-zinc-300">
      {/* Tab navigation links */}
      <div className="flex">
        {/* Config navs */}
        <ul className="flex overflow-x-auto">
          {configs.map((config, index) => (
            <NavElement
              key={config.id}
              label={config.name}
              saveEdit={(inputValue: string) => {
                setEditModeIndex(null);
                setshouldSaveEdit(false);
                setConfigs((prevConfigs) =>
                  prevConfigs!.map((config, i) => {
                    if (i === index) {
                      const updatedConfig = {
                        ...config,
                        name: inputValue,
                      } as ConfigData & {
                        id: string;
                      };
                      configAction.saveConfig(updatedConfig);
                      return updatedConfig;
                    }
                    return config;
                  })
                );
              }}
              isActive={index === activeIndex}
              editMode={editModeIndex === index}
              shouldSaveEdit={editModeIndex === index && shouldSaveEdit}
              onClick={() => setActiveIndex(index)}
              className={`${navLinkBaseStyle} whitespace-nowrap`}
            />
          ))}
        </ul>
        {/* Action navs */}
        <ul className="flex">
          <ActionLink
            onClick={async () => {
              const createdConfig = await configAction.createConfig({
                ...configPlaceholder,
              });
              setConfigs((prevConfigs) => {
                const newConfigs = [...prevConfigs!, createdConfig];
                setActiveIndex(newConfigs.length - 1);
                return newConfigs;
              });
            }}
          >
            <PlusIcon width={18} height={18} />
          </ActionLink>
          <ActionLink
            classname={`${
              typeof editModeIndex === 'number'
                ? 'text-indigo-600 bg-transparent'
                : ''
            }`}
            onClick={() => {
              if (typeof editModeIndex === 'number') {
                setshouldSaveEdit(true);
              } else {
                if (activeIndex >= 0) setEditModeIndex(activeIndex);
              }
            }}
          >
            <PencilSquareIcon width={20} height={20} />
          </ActionLink>
          <ActionLink
            onClick={() => {
              if (configs.length <= 1) return;
              const idToRemove = configs[activeIndex].id!;
              setConfigs((prevConfigs) => {
                const newConfigs = prevConfigs?.filter(
                  (config) => config.id !== idToRemove
                );
                setActiveIndex(Math.max(activeIndex - 1, 0));
                return newConfigs;
              });
              configAction.rmConfig(idToRemove);
            }}
          >
            <TrashIcon width={20} height={20} />
          </ActionLink>
        </ul>
        <div className="border-b-2 border-zinc-300 flex-grow"></div>
      </div>
      {/* Tab content */}
      <div className="border-r-2 border-zinc-300">
        {activeIndex >= 0 && activeIndex < configs?.length ? (
          <ConfigEditor config={configs[activeIndex]} />
        ) : null}
      </div>
    </div>
  );
};

export default ConfigTabs;
