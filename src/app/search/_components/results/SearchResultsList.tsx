'use client';
import JobItem from '@/app/(shared)/_components/jobs/JobItem';
import useSearchStore from '../../_stores/searchStore';

const JobList = () => {
  const searchStore = useSearchStore();

  if (!searchStore.searchResults.length) return null;
  return (
    <>
      <div className="flex flex-col justify-center align-items mb-2 rounded-sm border-2 border-gray-200 bg-gray-100">
        <div className="px-2 py-1 text-sm sm:text-base text-gray-600">
          <span>Total search results: </span>
          {searchStore.searchResults.length}
        </div>
        <div>
          {searchStore.searchResults
            .sort((a, b) => b.body.priorityPoints - a.body.priorityPoints)
            .map((job) => (
              <JobItem
                key={job.key}
                job={job}
                handleDelete={() => searchStore.rmResult(job.key)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default JobList;
