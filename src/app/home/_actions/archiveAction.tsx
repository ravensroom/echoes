import { ArchiveData } from '@/lib/validators/archive';
import axios from 'axios';

const ARCHIVE_URL = '/api/archive';

const createArchive = async (archive: ArchiveData) => {
  const { data } = await axios.post(ARCHIVE_URL, archive);
  return data as ArchiveData;
};

const getArchives = async () => {
  const { data } = await axios.get(ARCHIVE_URL);
  return data as (ArchiveData & { id: string })[];
};

const rmArchive = async (id: string) => {
  const { data } = await axios.delete(`${ARCHIVE_URL}?id=${id}`);
  return data;
};

const saveArchive = async (updatedConfig: ArchiveData & { id: string }) => {
  const { data } = await axios.patch(ARCHIVE_URL, updatedConfig);
  return data as ArchiveData & { id: string };
};

const archiveAction = {
  createArchive,
  getArchives,
  rmArchive,
  saveArchive,
};

export default archiveAction;
