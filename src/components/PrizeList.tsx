import React from 'react';
import { Trash2 } from 'lucide-react';
import { Prize } from '../types';

interface PrizeListProps {
  prizes: Prize[];
  onRemove: (id: string) => void;
}

const PrizeList: React.FC<PrizeListProps> = ({ prizes, onRemove }) => {
  return (
    <div className="grid gap-4">
      {prizes.map((prize) => (
        <div
          key={prize.id}
          className="bg-white/5 rounded-lg p-4 flex items-center gap-4 hover:bg-white/10 transition-colors group"
        >
          <img
            src={prize.image}
            alt={prize.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{prize.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded ${
                prize.rarity === 'SSR' ? 'bg-yellow-400' :
                prize.rarity === 'SR' ? 'bg-purple-400' :
                prize.rarity === 'R' ? 'bg-blue-400' :
                'bg-gray-400'
              } text-white`}>
                {prize.rarity}
              </span>
              <span className="text-sm text-purple-200">
                概率：{prize.probability}%
              </span>
            </div>
          </div>
          <button
            onClick={() => onRemove(prize.id)}
            className="p-2 rounded-full hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="删除奖品"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default PrizeList;