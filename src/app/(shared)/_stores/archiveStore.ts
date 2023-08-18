import { ArchiveData } from '@/lib/validators/archive';
import { create } from 'zustand';

interface ArchiveStore {
  archives: ArchiveData[];
  setArchives: (archives: ArchiveData[]) => void;
  updateArchive: (archive: ArchiveData) => void;
  rmArchive: (id: string) => void;
}

const useArchiveStore = create<ArchiveStore>((set) => ({
  archives: [],
  setArchives: (archives) =>
    set((state) => ({
      archives,
    })),
  updateArchive: (archive) =>
    set((state) => ({
      archives: state.archives.map((arch) => {
        return arch.id === archive.id ? archive : arch;
      }),
    })),
  rmArchive: (id) =>
    set((state) => ({
      archives: state.archives.filter((archive) => archive.id !== id),
    })),
}));

export default useArchiveStore;
