import React from 'react';
import { CameraModel } from '../types';

interface CameraSelectorProps {
  models: CameraModel[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CameraSelector: React.FC<CameraSelectorProps> = ({ models, selectedId, onSelect }) => {
  // ตัดแบ่ง Array เป็น 2 แถว
  const topRow = models.slice(0, 3); // 3 รุ่นแรก (10s, 30s, 930 IS)
  const bottomRow = models.slice(3); // รุ่นที่เหลือ (510 IS, 910 IS, 200)

  return (
    <div className="flex flex-col gap-3 py-2 px-2 w-full">
      
      {/* --- แถวบน (3 รุ่น) --- */}
      <div className="flex justify-center gap-2 w-full">
        {topRow.map((model) => {
          const isSelected = selectedId === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 shadow-sm border
                ${isSelected 
                  ? 'bg-pink-400 text-white border-pink-400 shadow-pink-200 shadow-md scale-105' 
                  : 'bg-white text-gray-600 border-pink-200 hover:border-pink-300 hover:bg-pink-50'}
              `}
            >
              {model.shortName}
            </button>
          );
        })}
      </div>

      {/* --- แถวล่าง (2 รุ่น) --- */}
      <div className="flex justify-center gap-3 w-full">
        {bottomRow.map((model) => {
          const isSelected = selectedId === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model.id)}
              className={`
                whitespace-nowrap px-6 py-2 rounded-full text-xs font-medium transition-all duration-300 shadow-sm border
                ${isSelected 
                  ? 'bg-pink-400 text-white border-pink-400 shadow-pink-200 shadow-md scale-105' 
                  : 'bg-white text-gray-600 border-pink-200 hover:border-pink-300 hover:bg-pink-50'}
              `}
            >
              {model.shortName}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default CameraSelector;
