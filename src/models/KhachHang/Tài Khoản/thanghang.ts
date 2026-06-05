import { useState, useEffect } from 'react';

import { getRankBySpent } from '@/services/KhachHang/Tài khoản/Thanghang';
import type { UserProfile } from '@/services/KhachHang/Tài khoản/typing';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { hasLoginToken } from '@/utils/auth';

const lamTronDiemThuong = (points: number) => Math.floor(Number(points) || 0);

const defaultUser: UserProfile = {
  id: '',
  avatar: '',
  name: '',
  phone: '',
  email: '',
  dept: '',
  building: '',
  floor: '',
  desk: '',
  points: 0,
  totalSpent: 0
};

const docTuCache = (): UserProfile => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('app_user_profile') : null;
  if (!saved) return defaultUser;
  try {
    return { ...defaultUser, ...JSON.parse(saved) };
  } catch (e) {
    return defaultUser;
  }
};

const chuyenApiSangHoSo = (data: any, fallback: UserProfile): UserProfile => ({
  ...fallback,
  id: data?.makh ?? data?.id ?? fallback.id,
  avatar: data?.avatar || '',
  name: data?.ten ?? data?.name ?? data?.taikhoan ?? '',
  phone: data?.phone ?? '',
  email: data?.email ?? '',
  dept: data?.dept ?? '',
  building: data?.building ?? '',
  floor: data?.floor ?? '',
  desk: data?.desk ?? '',
  points: lamTronDiemThuong(data?.points ?? fallback.points ?? 0),
  totalSpent: Number(data?.totalSpent ?? data?.total_spent ?? fallback.totalSpent ?? 0)
});

export default function useUserModel() {
  const [role, setRole] = useState<'employee'>('employee');
  const [currentUser, setCurrentUser] = useState<UserProfile>(docTuCache);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_user_profile', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const refreshProfile = async () => {
    if (!hasLoginToken()) return currentUser;
    const res = await axios.get(`${ip3}/khachhang/me`);
    const next = chuyenApiSangHoSo(res.data, currentUser);
    setCurrentUser(next);
    return next;
  };

  useEffect(() => {
    refreshProfile().catch(() => {});
  }, []);

  const addPurchase = async () => {
    await refreshProfile();
  };

  useEffect(() => {
    const handleOrderCompleted = () => {
      addPurchase().catch(() => {});
    };
    window.addEventListener('order_completed', handleOrderCompleted);
    return () => {
      window.removeEventListener('order_completed', handleOrderCompleted);
    };
  }, []);

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const payload = {
      ten: newProfile.name,
      avatar: newProfile.avatar,
      phone: newProfile.phone,
      email: newProfile.email,
      dept: newProfile.dept,
      building: newProfile.building,
      floor: newProfile.floor,
      desk: newProfile.desk
    };
    const res = await axios.patch(`${ip3}/khachhang/me`, payload);
    const next = chuyenApiSangHoSo(res.data, currentUser);
    setCurrentUser(next);
  };

  const rankInfo = getRankBySpent(currentUser.totalSpent || 0);
  const normalizedUser = {
    ...currentUser,
    points: lamTronDiemThuong(currentUser.points ?? 0)
  };

  return {
    role,
    setRole,
    currentUser: normalizedUser,
    updateProfile,
    addPurchase,
    refreshProfile,
    rankInfo
  };
}
