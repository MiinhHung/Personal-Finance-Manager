import axiosClient from './axiosClient';

const aiApi = {
  getInsights: () => {
    return axiosClient.get('/ai/insights');
  },
};

export default aiApi;
