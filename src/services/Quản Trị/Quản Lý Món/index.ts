import { request } from 'umi';

export const getQuanLyMon = (params?: any) => {
  return request('/api/admin/quan-ly-mon', { method: 'GET', params });
};
