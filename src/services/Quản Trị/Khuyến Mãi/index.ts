import { request } from 'umi';

export const getKhuyenMai = (params?: any) => {
  return request('/api/admin/khuyen-mai', { method: 'GET', params });
};
