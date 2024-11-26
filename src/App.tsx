import React, { useState } from 'react';
import { Gift, Plus, Sparkles } from 'lucide-react';
import PrizeWheel from './components/PrizeWheel';
import PrizeList from './components/PrizeList';
import PrizeHistory from './components/PrizeHistory';
import AddPrizeModal from './components/AddPrizeModal';
import { Prize, PrizeHistoryEntry } from './types';

const DEFAULT_PRIZES: Prize[] = [
  {
    id: '1',
    name: '任天堂 Switch',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80',
    rarity: 'SSR',
    probability: 1
  },
  {
    id: '2',
    name: 'AirPods Pro',
    image: 'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?w=400&q=80',
    rarity: 'SR',
    probability: 5
  },
  {
    id: '3',
    name: '礼品卡',
    image: 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?w=400&q=80',
    rarity: 'R',
    probability: 15
  },
  {
    id: '4',
    name: '贴纸套装',
    image: 'https://images.unsplash.com/photo-1626760820011-3b3e335d4505?w=400&q=80',
    rarity: 'N',
    probability: 79
  }
];

function App() {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [history, setHistory] = useState<PrizeHistoryEntry[]>([]);

  const currentTotalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const random = Math.random() * 100;
    let probabilitySum = 0;
    
    for (const prize of prizes) {
      probabilitySum += prize.probability;
      if (random <= probabilitySum) {
        setTimeout(() => {
          setWonPrize(prize);
          setHistory(prev => [{
            prize,
            timestamp: Date.now()
          }, ...prev]);
          setIsSpinning(false);
        }, 3000);
        break;
      }
    }
  };

  const addPrize = (prize: Omit<Prize, 'id'>) => {
    const newPrize = {
      ...prize,
      id: Date.now().toString()
    };
    setPrizes([...prizes, newPrize]);
    setShowModal(false);
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(prize => prize.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Gift className="w-8 h-8" />
            扭蛋抽奖系统
          </h1>
          <p className="text-purple-200">试试你的运气，体验日式扭蛋机的乐趣！</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
              <PrizeWheel 
                isSpinning={isSpinning}
                prizes={prizes}
                wonPrize={wonPrize}
              />
              <div className="mt-6 text-center">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || currentTotalProbability !== 100}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSpinning ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="animate-spin" />
                      抽奖中...
                    </span>
                  ) : currentTotalProbability !== 100 ? (
                    '请调整概率总和为100%'
                  ) : (
                    '开始抽奖！'
                  )}
                </button>
              </div>
            </div>
            
            <PrizeHistory history={history} />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">奖品列表</h2>
              <div className="flex items-center gap-2">
                <div className={`text-sm px-3 py-1 rounded-full ${
                  currentTotalProbability === 100 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`}>
                  {currentTotalProbability}%
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-purple-500 p-2 rounded-full hover:bg-purple-600 transition-colors"
                >
                  <Plus />
                </button>
              </div>
            </div>
            <PrizeList 
              prizes={prizes}
              onRemove={removePrize}
            />
          </div>
        </div>

        {showModal && (
          <AddPrizeModal
            onClose={() => setShowModal(false)}
            onAdd={addPrize}
            currentTotalProbability={currentTotalProbability}
          />
        )}
      </div>
    </div>
  );
}

export default App;