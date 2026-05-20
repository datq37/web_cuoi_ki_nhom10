import { request } from 'umi';

export const getDonHang = (params?: any) => {
  return request('/api/admin/don-hang', { method: 'GET', params });
};
