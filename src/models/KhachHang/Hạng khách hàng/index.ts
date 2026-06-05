import { useModel } from 'umi';
import { RANKS } from '@/services/KhachHang/Component/Sidebar';

export default function useRankModel() {
  const { currentUser } = useModel('KhachHang.Tài Khoản.thanghang') as { 
    currentUser?: { totalSpent?: number; points?: number | string; [key: string]: any } 
  };

  const currentSpent: number = currentUser?.totalSpent || 0;
  const currentPoints: number = Math.floor(Number(currentUser?.points) || 0);

  let nextRank = RANKS[RANKS.length - 1]; // Giả định là max rank
  let currentRank = RANKS[0];
  let isMaxRank = true;

  for (let i = 0; i < RANKS.length; i++) {
    if (currentSpent < RANKS[i].min) {
      nextRank = RANKS[i];
      currentRank = RANKS[i - 1] || RANKS[0];
      isMaxRank = false;
      break;
    }
  }

  const spentNeeded = nextRank.min - currentSpent;
  const progressPercent = isMaxRank ? 100 : ((currentSpent - currentRank.min) / (nextRank.min - currentRank.min)) * 100;

  return {
    currentSpent,
    currentPoints,
    nextRank,
    currentRank,
    isMaxRank,
    spentNeeded,
    progressPercent,
  };
}
