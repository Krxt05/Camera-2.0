import React from 'react';
import { CameraModel } from '../types';

interface CameraSelectorProps {
  models: CameraModel[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CameraSelector: React.FC<CameraSelectorProps> = ({ models, selectedId, onSelect }) => {
  // ตัดแบ่ง Array เป็น 2 แถว
  // แถวบน: เอา 3 รุ่นแรก (Index 0, 1, 2) -> 10s, 30s, 930 IS
  const topRow = models.slice(0, 3);
  
  // แถวล่าง: เอาตั้งแต่ Index 3 เป็นต้นไป -> 910 IS, 200
  const bottomRow = models.slice(3);

  return (
    <div className="flex flex-col gap-2.5 items-center w-full px-2">
      
      {/* --- บรรทัดบน (3 รุ่น) --- */}
      <div className="flex justify-center gap-2 w-full">
        {topRow.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`
              px-3 py-2 rounded-full text-[11px] font-bold transition-all duration-300 shadow-sm
              ${selectedId === model.id 
                ? 'bg-pink-500 text-white border-2 border-pink-500 scale-105 shadow-pink-300/50' 
                : 'bg-white text-pink-400 border border-pink-200 hover:bg-pink-50 hover:scale-105 active:scale-95'
              }
            `}
          >
            {model.shortName}
          </button>
        ))}
      </div>

      {/* --- บรรทัดล่าง (2 รุ่น) --- */}
      <div className="flex justify-center gap-2 w-full">
        {bottomRow.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`
              px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-300 shadow-sm
              ${selectedId === model.id 
                ? 'bg-pink-500 text-white border-2 border-pink-500 scale-105 shadow-pink-300/50' 
                : 'bg-white text-pink-400 border border-pink-200 hover:bg-pink-50 hover:scale-105 active:scale-95'
              }
            `}
          >
            {model.shortName}
          </button>
        ))}
      </div>

    </div>
  );
};

export default CameraSelector;
