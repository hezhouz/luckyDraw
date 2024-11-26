import React from 'react';
import { History } from 'lucide-react';
import { PrizeHistoryEntry } from '../types';

interface PrizeHistoryProps {
  history: PrizeHistoryEntry[];
}

const PrizeHistory: React.FC<PrizeHistoryProps> = ({ history }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5" />
        <h2 className="text-2xl font-bold">抽奖记录</h2>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-center text-purple-200">还没有抽中任何奖品。来试试运气吧！</p>
        ) : (
          history.map((entry) => (
            <div
              key={entry.timestamp}
              className="flex items-center gap-3 bg-white/5 p-3 rounded-lg"
            >
              <img
                src={entry.prize.image}
                alt={entry.prize.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium">{entry.prize.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    entry.prize.rarity === 'SSR' ? 'bg-yellow-400' :
                    entry.prize.rarity === 'SR' ? 'bg-purple-400' :
                    entry.prize.rarity === 'R' ? 'bg-blue-400' :
                    'bg-gray-400'
                  } text-white`}>
                    {entry.prize.rarity}
                  </span>
                  <span className="text-xs text-purple-200">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PrizeHistory;