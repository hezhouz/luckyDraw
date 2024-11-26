import React, { useState } from 'react';
import { Gift, Plus, Sparkles } from 'lucide-react';
import PrizeWheel from './components/PrizeWheel';
import PrizeList from './components/PrizeList';
import PrizeHistory from './components/PrizeHistory';
import AddPrizeModal from './components/AddPrizeModal';
import { Prize, PrizeHistoryEntry } from './types';


import lvimg from './images/lv.png';
import zhou from './images/zhouda.png';
import sr from './images/sr.png';
import cihde from './images/chide.png';
import shuzi from './images/shuzi.png';
import yifen from './images/yifen.png';
import xin from './images/xin.png';

const DEFAULT_PRIZES: Prize[] = [
  {
    id: '1',
    name: '路易威登LOUIS VUITTON',
    image: lvimg,
    rarity: 'SSR',
    probability: 5,
    repeatable: false
  },
  {
    id: '2',
    name: '周大福珠宝',
    image: zhou,
    rarity: 'SR',
    probability: 11,
    repeatable: false
  },
  {
    id: '3',
    name: '520红包',
    image: sr,
    rarity: 'R',
    probability: 11,
    repeatable: false
  },
  {
    id: '4',
    name: '休闲零食套装！',
    image: cihde,
    rarity: 'N',
    probability: 11,
    repeatable: false
  },
  {
    id: '5',
    name: '梳子！',
    image: shuzi,
    rarity: 'N',
    probability: 11,
    repeatable: false
  },
  {
    id: '6',
    name: '一封信',
    image: yifen,
    rarity: 'N',
    probability: 11,
    repeatable: false
  }
  ,
  {
    id: '7',
    name: '一个亲亲',
    image: xin,
    rarity: 'N',
    probability: 40,
    repeatable: true
  }
];

function App() {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [history, setHistory] = useState<PrizeHistoryEntry[]>([]);
  const [drawnPrizes, setDrawnPrizes] = useState<Set<string>>(new Set());

  const currentTotalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);

  const getAvailablePrizes = () => {
    return prizes.filter(prize => prize.repeatable || !drawnPrizes.has(prize.id));
  };

  const recalculateProbabilities = (availablePrizes: Prize[]) => {
    const totalProb = availablePrizes.reduce((sum, prize) => sum + prize.probability, 0);
    return availablePrizes.map(prize => ({
      ...prize,
      normalizedProbability: (prize.probability / totalProb) * 100
    }));
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    const availablePrizes = getAvailablePrizes();
    if (availablePrizes.length === 0) {
      alert('所有不可重复的奖品都已被抽完！');
      return;
    }

    setIsSpinning(true);
    const normalizedPrizes = recalculateProbabilities(availablePrizes);
    const random = Math.random() * 100;
    let probabilitySum = 0;
    
    for (const prize of normalizedPrizes) {
      probabilitySum += prize.normalizedProbability!;
      if (random <= probabilitySum) {
        setTimeout(() => {
          setWonPrize(prize);
          if (!prize.repeatable) {
            setDrawnPrizes(prev => new Set([...prev, prize.id]));
          }
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
      id: Date.now().toString(),
      repeatable: prize.rarity === 'N'
    };
    setPrizes([...prizes, newPrize]);
    setShowModal(false);
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(prize => prize.id !== id));
    setDrawnPrizes(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const availablePrizesCount = getAvailablePrizes().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Gift className="w-8 h-8" />
            祝 宝贝老婆 25岁 生日快乐！！
            <Gift className="w-8 h-8" />
          </h1>
          <p className="text-purple-200">愿 你此生无事伴心弦，所念皆所愿。</p>
          {availablePrizesCount < prizes.length && (
            <p className="text-yellow-300 mt-2">
              还剩 {availablePrizesCount} 个奖品可以抽取
            </p>
          )}
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
                  disabled={isSpinning || currentTotalProbability !== 100 || availablePrizesCount === 0}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSpinning ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="animate-spin" />
                      抽奖中...
                    </span>
                  ) : availablePrizesCount === 0 ? (
                    '奖品已抽完'
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
              drawnPrizes={drawnPrizes}
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
