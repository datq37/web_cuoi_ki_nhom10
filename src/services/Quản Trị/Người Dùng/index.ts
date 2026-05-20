import { request } from 'umi';

export const getNguoiDung = (params?: any) => {
  return request('/api/admin/nguoi-dung', { method: 'GET', params });
};
