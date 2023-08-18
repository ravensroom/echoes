import { JobData } from '@/lib/validators/job';
import axios from 'axios';

const SAVE_TO_ARCHIVE_URL = '/api/job/save';

const saveToArchive = async ({
  archiveId,
  job,
}: {
  archiveId: string;
  job: JobData;
}) => {
  const { data } = await axios.post(
    `${SAVE_TO_ARCHIVE_URL}?archiveId=${archiveId}`,
    job
  );
  return data;
};

const deleteFromArchive = async ({
  archiveId,
  jobKey,
}: {
  archiveId: string;
  jobKey: string;
}) => {
  const { data } = await axios.delete(
    `${SAVE_TO_ARCHIVE_URL}?archiveId=${archiveId}&jobKey=${jobKey}`
  );
  return data;
};

const jobAction = {
  saveToArchive,
  deleteFromArchive,
};

export default jobAction;
