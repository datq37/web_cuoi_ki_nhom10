import { useState, useEffect } from 'react';

export interface UserRank {
  name: string;
  min: number;
  mult: number;
  color: string;
}

export const RANKS: UserRank[] = [
  { name: 'Đồng', min: 0, mult: 1, color: '#cd7f32' },
  { name: 'Bạc', min: 1000000, mult: 1.2, color: '#c0c0c0' },
  { name: 'Vàng', min: 3000000, mult: 1.5, color: '#ffd700' },
  { name: 'Kim Cương', min: 10000000, mult: 2, color: '#b9f2ff' }
];

export const getRankBySpent = (spent: number): UserRank => {
  let currentRank = RANKS[0];
  for (const r of RANKS) {
    if (spent >= r.min) currentRank = r;
  }
  return currentRank;
};

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
      const earnedPoints = Math.floor(amount / 10000) * rank.mult;
      return {
        ...prev,
        totalSpent: newTotal,
        points: (prev.points || 0) + earnedPoints
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

  return {
    role,
    setRole,
    currentUser,
    updateProfile,
    addPurchase,
    rankInfo
  };
}
