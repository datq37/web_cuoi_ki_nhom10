import type { FormInstance } from 'antd';

export interface UserProfile {
  id?: string;
  avatar: string;
  name: string;
  phone?: string;
  email?: string;
  dept: string;
  building?: string;
  floor?: string;
  desk?: string;
  points?: number;
  totalSpent?: number;
}

/** Props của component Thanh Bên (sidebar) */
export interface ThanhBenProps {
  currentUser: UserProfile;
  avatarUrl: string;
  isAvatarImage: () => boolean;
  beforeUpload: (file: File) => boolean | string;
  rankInfo?: any;
}

/** Props của component Biểu Mẫu (form chính) */
export interface BieuMauProps {
  form: FormInstance;
  onFinish: (
    values: Partial<UserProfile>,
    updateProfile: (data: Partial<UserProfile>) => void,
  ) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}
