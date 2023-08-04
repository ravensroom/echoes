import axios from 'axios';
import { ConfigData } from '@/lib/validators/config';

const CONFIG_URL = '/api/config';

const createConfig = async (config: ConfigData) => {
  const { data } = await axios.post(CONFIG_URL, config);
  return data as ConfigData;
};

const getConfigs = async () => {
  const { data } = await axios.get(CONFIG_URL);
  return data as (ConfigData & { id: string })[];
};

const rmConfig = async (id: string) => {
  const { data } = await axios.delete(`${CONFIG_URL}?id=${id}`);
  return data;
};

const saveConfig = async (updatedConfig: ConfigData & { id: string }) => {
  const { data } = await axios.patch(CONFIG_URL, updatedConfig);
  return data as ConfigData & { id: string };
};

const configAction = {
  createConfig,
  getConfigs,
  rmConfig,
  saveConfig,
};

export default configAction;
