export interface Prize {
  id: string;
  name: string;
  image: string;
  rarity: 'SSR' | 'SR' | 'R' | 'N';
  probability: number;
}

export interface PrizeHistoryEntry {
  prize: Prize;
  timestamp: number;
}