import { JobData } from './../../../lib/validators/job';
import { ConfigData } from '@/lib/validators/config';
import axios from 'axios';

const SEARCH_URL = '/api/job/search';
const SEARCH_SIGNAL_URL = '/api/job/search/signal';

const start = async (config: ConfigData) => {
  const { data } = await axios.post(SEARCH_URL, config);
  return data;
};

const fetch = async (searchId: string) => {
  const { data } = await axios.get(`${SEARCH_URL}?searchId=${searchId}`);
  return data as JobData[];
};

const cancel = async (searchId: string) => {
  const { data } = await axios.delete(
    `${SEARCH_SIGNAL_URL}?searchId=${searchId}`
  );
  return data;
};

const getSearchFinished = async (searchId: string) => {
  const { data } = await axios.get(`${SEARCH_SIGNAL_URL}?searchId=${searchId}`);
  return data;
};

const searchAction = {
  start,
  fetch,
  cancel,
  getSearchFinished,
};

export default searchAction;
