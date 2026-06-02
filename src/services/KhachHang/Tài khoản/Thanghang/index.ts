import type { UserRank } from './typing';

export * from './typing';

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
