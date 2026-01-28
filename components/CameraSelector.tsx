import React from 'react';
import { CameraModel } from '../types';

interface CameraSelectorProps {
  models: CameraModel[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CameraSelector: React.FC<CameraSelectorProps> = ({ models, selectedId, onSelect }) => {
  return (
    <div className="flex justify-center gap-3 overflow-x-auto py-2 px-4 no-scrollbar">
      {models.map((model) => {
        const isSelected = selectedId === model.id;
        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`
              whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm border
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
  );
};

export default CameraSelector;