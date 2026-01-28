import React, { useEffect, useState, useMemo } from 'react';
import { CameraModel, Booking } from './types';
import { fetchBookings } from './services/dataService';
import CameraSelector from './components/CameraSelector';
import CalendarView from './components/CalendarView';
import { Image, Camera, Sparkles, Instagram } from 'lucide-react';
import { isWithinInterval, startOfDay } from 'date-fns';

// Constants for Models
const MODELS: CameraModel[] = [
  {
    id: "Canon IXY 10s",
    shortName: "IXY 10s",
    fullName: "Canon IXY 10s",
    heroImage: "https://i.ebayimg.com/images/g/jtoAAOSwWH9m6YaC/s-l1600.webp",
    moodImages: [
      "10s_1.jpg",
      "10s_2.jpg",
      "10s_3.jpg"
    ]
  },
  {
    id: "Canon IXY 930 IS",
    shortName: "IXY 930 IS",
    fullName: "Canon IXY 930 IS",
    heroImage: "https://m.media-amazon.com/images/I/41F0pIRAlYL._AC_UF1000,1000_QL80_.jpg",
    moodImages: [
      "",
    ]
  }
];

const App: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>(MODELS[0].id);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookings on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchBookings();
      setBookings(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const currentModel = useMemo(() => 
    MODELS.find(m => m.id === selectedModelId) || MODELS[0], 
  [selectedModelId]);

  const isBusyToday = useMemo(() => {
    const today = startOfDay(new Date());
    return bookings.some(b => 
      b.model === currentModel.fullName && 
      isWithinInterval(today, { start: startOfDay(b.start), end: startOfDay(b.end) })
    );
  }, [bookings, currentModel]);

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen relative shadow-2xl bg-[#FFF0F5]">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-200 px-4 py-3 flex justify-center items-center shadow-sm">
        <Sparkles className="text-pink-500 w-5 h-5 mr-2 animate-pulse" />
        <h1 className="font-serif italic font-bold text-xl text-pink-600 tracking-wide">
          MIWVIE SHOP
        </h1>
        <Sparkles className="text-pink-500 w-5 h-5 ml-2 animate-pulse" />
      </div>

      <div className="p-4 flex flex-col gap-6">
        
        {/* Model Selector */}
        <div className="flex flex-col items-center">
            <span className="text-xs text-pink-400 font-medium mb-2 uppercase tracking-widest">เลือกรุ่นกล้องที่ต้องการเช่า</span>
            <CameraSelector 
            models={MODELS} 
            selectedId={selectedModelId} 
            onSelect={setSelectedModelId} 
            />
        </div>

        {/* Hero Section - Resized to 16:9 aspect ratio */}
        <div className="relative group max-w-[340px] mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-white rounded-3xl border-4 border-white shadow-lg overflow-hidden">
                <div className="aspect-video w-full bg-gray-50 relative overflow-hidden">
                    <img 
                        src={currentModel.heroImage} 
                        alt={currentModel.fullName} 
                        className="w-full h-full object-cover transform scale-110 transition duration-700 hover:scale-125"
                    />
                    {/* Status Badge */}
                    <div className={`
                        absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border border-white/50
                        ${isBusyToday ? 'bg-white/90 text-red-500' : 'bg-white/90 text-green-500'}
                    `}>
                        {isBusyToday ? '❌ วันนี้ไม่ว่าง' : '✨ ; ว่างพร้อมเช่า'}
                    </div>
                </div>
                <div className="text-center py-3 bg-white">
                    <h2 className="font-serif text-xl font-bold text-pink-600 drop-shadow-sm">
                        {currentModel.fullName}
                    </h2>
                </div>
            </div>
        </div>

        {/* Calendar Section */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-pink-100 p-1.5 rounded-full">
                    <Camera className="w-4 h-4 text-pink-500" />
                </div>
                <h3 className="font-bold text-gray-700">Availability</h3>
            </div>
            {loading ? (
                <div className="h-64 bg-white/50 rounded-2xl flex items-center justify-center text-pink-400 animate-pulse">
                    Loading schedule...
                </div>
            ) : (
                <CalendarView bookings={bookings} modelName={currentModel.fullName} />
            )}
        </div>

        {/* Mood Board Section */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-pink-100 p-1.5 rounded-full">
                    <Image className="w-4 h-4 text-pink-500" />
                </div>
                <h3 className="font-bold text-gray-700">Mood and Tone</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {currentModel.moodImages.map((img, idx) => (
                    <div 
                        key={idx} 
                        className={`
                            rounded-xl overflow-hidden shadow-md border-2 border-white bg-pink-50
                            ${idx % 3 === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}
                        `}
                    >
                        <img 
                            src={img} 
                            alt={`Mood ${idx}`} 
                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-pink-300 text-sm font-light">
            <p className="flex items-center justify-center gap-1">
                สนใจเช่า <span className="text-red-400">♥</span> DM
            </p>
            <div className="mt-4 flex justify-center">
                 <a 
                    href="https://www.instagram.com/miwvie_shop/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white border border-pink-200 text-pink-400 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-pink-50 transition"
                 >
                    <Instagram size={14} /> @MIWVIE.SHOP
                 </a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default App;