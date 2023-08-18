import ConfigTabs from './_components/configs/ConfigTabs';
import JobList from './_components/results/SearchResultsList';

const Page = () => {
  return (
    <div className="sm:px-5 md:px-16 lg:px-25">
      <ConfigTabs />
      <JobList />
    </div>
  );
};

export default Page;
