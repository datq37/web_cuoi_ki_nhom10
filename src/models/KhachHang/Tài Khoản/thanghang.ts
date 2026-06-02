import { useState, useEffect } from 'react';

import { getRankBySpent } from '@/services/KhachHang/Tài khoản/Thanghang';

const lamTronDiemThuong = (points: number) => Math.floor(Number(points) || 0);

export default function useUserModel() {
  const [role, setRole] = useState<'employee'>('employee');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('app_user_profile') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'U1',
      avatar: 'MA',
      name: 'Nguyễn Minh Anh',
      phone: '0987654321',
      email: 'minhanh.nguyen@company.com',
      dept: 'IT / Engineering',
      building: 'Tòa nhà A',
      floor: 'Tầng 5',
      desk: 'Bàn 502',
      points: 0,
      totalSpent: 0
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_user_profile', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const addPurchase = (amount: number) => {
    setCurrentUser((prev: any) => {
      const newTotal = (prev.totalSpent || 0) + amount;
      const rank = getRankBySpent(newTotal);
      const earnedPoints = lamTronDiemThuong(Math.floor(amount / 10000) * rank.mult);
      return {
        ...prev,
        totalSpent: newTotal,
        points: lamTronDiemThuong(prev.points) + earnedPoints
      };
    });
  };

  useEffect(() => {
    const handleOrderCompleted = (e: any) => {
      if (e.detail?.amount) {
        addPurchase(e.detail.amount);
      }
    };
    window.addEventListener('order_completed', handleOrderCompleted);
    return () => {
      window.removeEventListener('order_completed', handleOrderCompleted);
    };
  }, []);

  const updateProfile = (newProfile: any) => {
    setCurrentUser((prev: any) => ({
      ...prev,
      ...newProfile
    }));
  };

  const rankInfo = getRankBySpent(currentUser.totalSpent || 0);
  const normalizedUser = {
    ...currentUser,
    points: lamTronDiemThuong(currentUser.points)
  };

  return {
    role,
    setRole,
    currentUser: normalizedUser,
    updateProfile,
    addPurchase,
    rankInfo
  };
}
