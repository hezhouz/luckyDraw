export interface Prize {
  id: string;
  name: string;
  image: any;
  rarity: 'SSR' | 'SR' | 'R' | 'N';
  probability: number;
  repeatable: boolean;
}

export interface PrizeHistoryEntry {
  prize: Prize;
  timestamp: number;
}