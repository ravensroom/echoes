'use client';
import jobAction from '@/app/(shared)/_actions/jobAction';
import JobItem from '@/app/(shared)/_components/jobs/JobItem';
import useArchiveStore from '@/app/(shared)/_stores/archiveStore';
import { ArchiveData } from '@/lib/validators/archive';

const JobList = ({ archive }: { archive: ArchiveData }) => {
  const archiveStore = useArchiveStore();
  if (!archive.jobs || !archive.jobs.length) {
    return (
      <div className="flex items-center justify-center h-40">
        <span>{`You don't have any saved jobs yet in this archive`}</span>
      </div>
    );
  }

  const rmJobFromArchive = (jobKey: string) => {
    const newArchives = archiveStore.archives.map((arch) => {
      if (arch.id === archive.id) {
        const updatedJobs = arch.jobs!.filter((j) => j.key !== jobKey);
        const updatedArchive = { ...arch, jobs: updatedJobs };
        return updatedArchive;
      }
      return arch;
    });
    archiveStore.setArchives(newArchives);
    jobAction.deleteFromArchive({
      archiveId: archive.id!,
      jobKey: jobKey,
    });
  };

  return (
    <>
      <div className="flex flex-col justify-center align-items mb-2 rounded-sm border-2 border-gray-200 bg-gray-100">
        <div className="px-2 py-1 text-sm sm:text-base text-gray-600">
          <span>Total saved jobs: </span>
          {archive.jobs.length}
        </div>
        <div>
          {archive.jobs
            // .sort((a, b) => b.body.priorityPoints - a.body.priorityPoints)
            .map((job) => (
              <JobItem
                key={job.key}
                job={job}
                handleDelete={() => rmJobFromArchive(job.key)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default JobList;
