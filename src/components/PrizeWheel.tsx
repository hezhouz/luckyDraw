import React, { useEffect, useRef } from 'react';
import { Prize } from '../types';
import confetti from 'canvas-confetti';

interface PrizeWheelProps {
  isSpinning: boolean;
  prizes: Prize[];
  wonPrize: Prize | null;
}

const PrizeWheel: React.FC<PrizeWheelProps> = ({ isSpinning, prizes, wonPrize }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wonPrize && containerRef.current) {
      // 创建多彩的庆祝效果
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [wonPrize]);

  return (
    <div ref={containerRef} className="relative">
      <div className="w-72 h-72 mx-auto relative">
        {/* 扭蛋机背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl backdrop-blur-sm" />
        
        {/* 扭蛋展示区域 */}
        <div className="absolute inset-8">
          {isSpinning ? (
            // 旋转的扭蛋
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-32 h-32 relative animate-capsule">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full capsule-shadow" />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full transform translate-y-1" />
                <div className="absolute inset-0 flex items-center justify-center text-yellow-800 font-bold text-4xl">
                  ?
                </div>
              </div>
            </div>
          ) : wonPrize ? (
            // 中奖展示
            <div className="relative w-full h-full flex items-center justify-center opacity-0 animate-prize-reveal">
              <div className="text-center">
                <div className="relative">
                  <img
                    src={wonPrize.image}
                    alt={wonPrize.name}
                    className="w-36 h-36 object-cover rounded-lg shadow-lg mx-auto mb-3"
                  />
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    wonPrize.rarity === 'SSR' ? 'bg-yellow-400' :
                    wonPrize.rarity === 'SR' ? 'bg-purple-400' :
                    wonPrize.rarity === 'R' ? 'bg-blue-400' :
                    'bg-gray-400'
                  }`}>
                    {wonPrize.rarity}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mt-2">{wonPrize.name}</h3>
              </div>
            </div>
          ) : (
            // 初始状态
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white/60">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-4xl">?</span>
                </div>
                <p className="text-sm">准备好了吗？</p>
              </div>
            </div>
          )}
        </div>

        {/* 装饰元素 */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75" />
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-150" />
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
}

export default PrizeWheel;