import type { FormInstance } from 'antd';

export const resetFieldsForm = (form: FormInstance) => {
  form.resetFields();
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('vi-VN').format(value) + 'đ';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getNameFile = (url: string): string => {
  if (!url) return '';
  return url.split('/').pop()?.split('?')[0] ?? '';
};

export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
