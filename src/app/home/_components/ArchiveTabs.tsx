'use client';

import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import NavElement from '@/app/(shared)/_components/tabs/NavElement';
import { ArchiveData } from '@/lib/validators/archive';
import archiveAction from '../_actions/archiveAction';
import JobList from './JobList';
import useArchiveStore from '@/app/(shared)/_stores/archiveStore';

const archivePlaceholder: ArchiveData = {
  name: 'new archive',
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

const ArchiveTabs = () => {
  const archiveStore = useArchiveStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [editModeIndex, setEditModeIndex] = useState<number | null>(null);
  const [shouldSaveEdit, setshouldSaveEdit] = useState(false);

  useEffect(() => {
    archiveAction.getArchives().then((data) => {
      if (data.length) {
        archiveStore.setArchives(data);
      } else {
        archiveAction
          .createArchive(archivePlaceholder)
          .then((createdFirstArchive) => {
            archiveStore.setArchives([createdFirstArchive]);
          });
      }
    });
  }, []);

  if (!archiveStore.archives) return null;
  return (
    <div className="flex flex-col rounded-sm border-2 border-t-0 border-r-0 border-zinc-300">
      {/* Tab navigation links */}
      <div className="flex">
        {/* Config navs */}
        <ul className="flex overflow-x-auto">
          {archiveStore.archives.map((archive, index) => (
            <NavElement
              key={archive.id}
              label={archive.name}
              saveEdit={(inputValue: string) => {
                setEditModeIndex(null);
                setshouldSaveEdit(false);
                const updatedArchive = {
                  ...archive,
                  id: archive.id!,
                  name: inputValue,
                };
                archiveStore.updateArchive(updatedArchive);
                archiveAction.saveArchive(updatedArchive);
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
              const createdArchive = await archiveAction.createArchive({
                ...archivePlaceholder,
              });
              const newArchives = [...archiveStore.archives, createdArchive];
              archiveStore.setArchives(newArchives);
              setActiveIndex(newArchives.length - 1);
            }}
          >
            <PlusIcon width={18} height={18} />
          </ActionLink>
          <ActionLink
            classname={`${
              typeof editModeIndex === 'number' ? 'text-indigo-600' : ''
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
              if (archiveStore.archives.length <= 1) return;
              const idToRemove = archiveStore.archives[activeIndex].id!;
              archiveStore.rmArchive(idToRemove);
              setActiveIndex(Math.max(activeIndex - 1, 0));
              archiveAction.rmArchive(idToRemove);
            }}
          >
            <TrashIcon width={20} height={20} />
          </ActionLink>
        </ul>
        <div className="border-b-2 border-zinc-300 flex-grow"></div>
      </div>
      {/* Tab content */}
      <div className="border-r-2 border-zinc-300 bg-zinc-200">
        {activeIndex >= 0 && activeIndex < archiveStore.archives?.length ? (
          <JobList archive={archiveStore.archives[activeIndex]} />
        ) : null}
      </div>
    </div>
  );
};

export default ArchiveTabs;
