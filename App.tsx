import React, { useEffect, useState, useMemo } from 'react';
import { CameraModel, Booking } from './types';
import { fetchBookings } from './services/dataService';
import CameraSelector from './components/CameraSelector';
import CalendarView from './components/CalendarView';
import { Image as ImageIcon, Camera, Sparkles, Instagram, X } from 'lucide-react';
import { isWithinInterval, startOfDay } from 'date-fns';

const GITHUB_BASE_URL = "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/main/images/";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${GITHUB_BASE_URL}${path}`;
};

const MODELS: CameraModel[] = [
  {
    id: "Canon IXY 10s",
    shortName: "IXY 10s",
    fullName: "Canon IXY 10s",
    heroImage: "https://i.ebayimg.com/images/g/jtoAAOSwWH9m6YaC/s-l1600.webp",
    moodImages: [
      "https://i.postimg.cc/XNZcxGMx/10s-1.jpg",
      "https://i.postimg.cc/PfLzKpGV/10s-2.jpg",
      "https://i.postimg.cc/xjkygJrs/10s-3.jpg"
    ]
  },
  {
    id: "Canon IXY 930 IS",
    shortName: "IXY 930 IS",
    fullName: "Canon IXY 930 IS",
    heroImage: "https://m.media-amazon.com/images/I/41F0pIRAlYL._AC_UF1000,1000_QL80_.jpg",
    moodImages: [
      ""
    ]
  },
  {
    id: "Canon IXUS 185",
    shortName: "IXUS 185",
    fullName: "Canon IXUS 185",
    heroImage: "https://www.photographyblog.com/uploads/entryImages/_1280xAUTO_crop_center-center_none/canon_ixus_185.jpg", // 
    moodImages: [
      ""
    ]
  }
];

const App: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>(MODELS[0].id);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

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
    <div className="pb-20 max-w-md mx-auto min-h-screen relative shadow-2xl bg-[#FFF0F5] font-sans">
      
      {/* Lightbox Modal */}
      {zoomedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setZoomedImage(null)}
        >
            <button 
                className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                onClick={() => setZoomedImage(null)}
            >
                <X size={24} />
            </button>
            <img 
                src={zoomedImage} 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                alt="Zoomed"
            />
        </div>
      )}

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
            <span className="text-[10px] text-pink-400 font-bold mb-2 uppercase tracking-[0.2em]">เลือกรุ่นกล้องที่ต้องการเช่า</span>
            <CameraSelector 
            models={MODELS} 
            selectedId={selectedModelId} 
            onSelect={setSelectedModelId} 
            />
        </div>

        {/* Hero Section */}
        <div className="relative group max-w-[340px] mx-auto w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-gradient-x"></div>
            <div className="relative bg-white rounded-3xl border-4 border-white shadow-xl overflow-hidden cursor-zoom-in" onClick={() => setZoomedImage(currentModel.heroImage)}>
                <div className="aspect-video w-full bg-pink-50 relative overflow-hidden">
                    <img 
                        src={currentModel.heroImage} 
                        alt={currentModel.fullName} 
                        className="w-full h-full object-cover transform transition duration-700 hover:scale-110"
                    />
                    <div className={`
                        absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg backdrop-blur-md border border-white/50
                        ${isBusyToday ? 'bg-red-50/90 text-red-500' : 'bg-green-50/90 text-green-500'}
                    `}>
                        {isBusyToday ? '❌ วันนี้ไม่ว่าง' : '✨ ว่างพร้อมเช่า'}
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
        <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
                <div className="bg-pink-100 p-1.5 rounded-lg">
                    <Camera className="w-4 h-4 text-pink-500" />
                </div>
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Availability</h3>
            </div>
            {loading ? (
                <div className="h-64 bg-white/50 border border-pink-100 rounded-2xl flex flex-col items-center justify-center text-pink-300 gap-2 animate-pulse">
                    <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                    <span className="text-xs">กำลังโหลดตารางเช่า...</span>
                </div>
            ) : (
                <CalendarView bookings={bookings} modelName={currentModel.fullName} />
            )}
        </div>

        {/* Mood Board Section */}
        <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
                <div className="bg-pink-100 p-1.5 rounded-lg">
                    <ImageIcon className="w-4 h-4 text-pink-500" />
                </div>
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Mood and Tone</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {currentModel.moodImages.map((img, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setZoomedImage(img)}
                        className={`
                            rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-pink-50 cursor-zoom-in transition-transform duration-300 hover:scale-[1.02] active:scale-95
                            ${idx % 3 === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}
                        `}
                    >
                        <img 
                            src={img} 
                            alt={`Mood ${idx}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=800&auto=format&fit=crop';
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
            <p className="flex items-center justify-center gap-1.5 text-pink-400 font-medium">
                สนใจเช่า <span className="text-red-400 animate-bounce">♥</span> ทัก DM ได้เลยค่ะ
            </p>
            <div className="flex justify-center">
                 <a 
                    href="https://www.instagram.com/miwvie_shop/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white border-2 border-pink-200 text-pink-500 px-6 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300 shadow-md active:scale-95"
                 >
                    <Instagram size={16} /> @MIWVIE.SHOP
                 </a>
            </div>
            <p className="text-[10px] text-pink-200 pt-4 uppercase tracking-[0.3em]">© 2024 Miwvie Shop Digital Rental</p>
        </div>

      </div>
    </div>
  );
};

export default App;
