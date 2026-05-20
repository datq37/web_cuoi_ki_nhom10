import { request } from 'umi';

export const getKhoNguyenLieu = (params?: any) => {
  return request('/api/admin/kho-nguyen-lieu', { method: 'GET', params });
};
