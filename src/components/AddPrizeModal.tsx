import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Prize } from '../types';

interface AddPrizeModalProps {
  onClose: () => void;
  onAdd: (prize: Omit<Prize, 'id'>) => void;
  currentTotalProbability: number;
}

const AddPrizeModal: React.FC<AddPrizeModalProps> = ({ onClose, onAdd, currentTotalProbability }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rarity: 'N',
    probability: 0
  });

  const remainingProbability = 100 - currentTotalProbability;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.probability > remainingProbability) {
      alert(`概率总和不能超过100%。您最多可以添加${remainingProbability.toFixed(1)}%`);
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">添加新奖品</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X />
          </button>
        </div>

        {remainingProbability > 0 ? (
          <div className="mb-4 p-2 bg-blue-500/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">剩余可用概率：{remainingProbability.toFixed(1)}%</span>
          </div>
        ) : (
          <div className="mb-4 p-2 bg-red-500/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">概率总和已达100%。请删除一些奖品后再添加。</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">奖品名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">图片链接</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">稀有度</label>
            <select
              value={formData.rarity}
              onChange={(e) => setFormData({ ...formData, rarity: e.target.value as Prize['rarity']})}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="SSR">SSR - 超稀有</option>
              <option value="SR">SR - 稀有</option>
              <option value="R">R - 普通</option>
              <option value="N">N - 常见</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">概率 (%)</label>
            <input
              type="number"
              min="0"
              max={remainingProbability}
              step="0.1"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: parseFloat(e.target.value) })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={remainingProbability <= 0}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加奖品
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPrizeModal;