import { JobData } from '@/lib/validators/job';
import { create } from 'zustand';

interface SearchStore {
  searchId: string;
  setSearchId: (id: string) => void;
  rmSearchId: () => void;
  searchResults: JobData[];
  setSearchResults: (jobsData: JobData[]) => void;
  rmSearchResults: () => void;
  rmResult: (jobKey: string) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  searchId: '',
  setSearchId: (id) => set((state) => ({ searchId: id })),
  rmSearchId: () => set(() => ({ searchId: '' })),
  searchResults: [],
  setSearchResults: (jobsData) => set(() => ({ searchResults: jobsData })),
  rmSearchResults: () => set({ searchResults: [] }),
  rmResult: (jobKey) =>
    set((state) => ({
      searchResults: state.searchResults.filter((job) => job.key !== jobKey),
    })),
}));

export default useSearchStore;
