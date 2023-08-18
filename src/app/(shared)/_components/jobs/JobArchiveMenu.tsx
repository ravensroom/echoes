'use client';

import { JobData } from '@/lib/validators/job';
import useArchiveStore from '../../_stores/archiveStore';
import { toast } from 'react-hot-toast';
import jobAction from '../../_actions/jobAction';
import { useEffect } from 'react';
import archiveAction from '@/app/home/_actions/archiveAction';
import useSearchStore from '@/app/search/_stores/searchStore';

const JobArchiveMenu = ({ job }: { job: JobData }) => {
  const archiveStore = useArchiveStore();
  const searchStore = useSearchStore();
  useEffect(() => {
    if (!archiveStore.archives.length) {
      archiveAction
        .createArchive({ name: 'new archive' })
        .then((createdFirstArchive) => {
          archiveStore.setArchives([createdFirstArchive]);
        });
    }
  }, [archiveStore]);
  return (
    <ul className="absolute w-28 z-50 top-[-1] right-[16px] bg-black shadow-sm shadow-purple-400">
      {archiveStore.archives.map((arch, index) => (
        <li
          onClick={() => {
            // if job exists in target archive, alert and return
            if (arch.jobs?.find((j) => j.key === job.key)) {
              toast.error('Job exists in target archive!');
              return;
            }
            // if job exists in an archive, rm from current archive in archiveStore
            if (job.archiveId) {
              const newArchives = archiveStore.archives.map((arch) => {
                if (arch.id === job.archiveId) {
                  const updatedJobs = arch.jobs!.filter(
                    (j) => j.key !== job.key
                  );
                  const updatedArchive = { ...arch, jobs: updatedJobs };
                  return updatedArchive;
                }
                return arch;
              });
              archiveStore.setArchives(newArchives);
              job.archiveId = arch.id;
            }
            // if job exists in searchResults, rm from current search results
            if (searchStore.searchResults.find((j) => j.key === job.key)) {
              searchStore.rmResult(job.key);
            }
            // add to target archive store
            const existingJobs = arch.jobs || [];
            const updatedJobs = [...existingJobs, job];
            const newArch = { ...arch, jobs: updatedJobs };
            archiveStore.updateArchive(newArch);
            toast.success(`Added job to ${newArch.name}`);

            // update db
            jobAction.saveToArchive({ archiveId: arch.id!, job });
          }}
          key={arch.id}
          className={`${
            index % 2 === 0
              ? 'bg-purple-100 hover:bg-purple-200'
              : 'bg-indigo-100 hover:bg-indigo-200'
          } py-1 px-2 text-sm`}
        >
          {arch.name}
        </li>
      ))}
    </ul>
  );
};

export default JobArchiveMenu;
