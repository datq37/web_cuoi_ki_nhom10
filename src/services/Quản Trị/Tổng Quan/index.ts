import { request } from 'umi';

export const getTongQuan = () => {
  return request('/api/admin/tong-quan', { method: 'GET' });
};
