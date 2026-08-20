import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface ImageGalleryProps {
  images: { id: string; url: string }[];
  alt: string;
}

export const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] sm:aspect-square bg-bj-cream flex items-center justify-center">
        <span className="font-serif text-5xl text-gray-200">BJ</span>
      </div>
    );
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="relative group bg-bj-cream">
        <div className="aspect-[3/4] sm:aspect-square overflow-hidden cursor-zoom-in" onClick={() => setIsExpanded(true)}>
          <img
            src={images[currentIndex].url}
            alt={`${alt} - view ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-bj-gold shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-bj-gold shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-bj-gold w-4' : 'bg-white/60 hover:bg-white'}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-bj-gold shadow-sm"
        >
          <Expand size={18} />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(i)}
              className={`relative shrink-0 w-20 h-20 bg-bj-cream overflow-hidden border-2 transition-colors ${i === currentIndex ? 'border-bj-gold' : 'border-transparent hover:border-bj-gold/50'}`}
            >
              <img src={img.url} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setIsExpanded(false)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            Close (ESC)
          </button>
          
          <img
            src={images[currentIndex].url}
            alt={`${alt} fullscreen`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center rounded-full transition-colors backdrop-blur"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center rounded-full transition-colors backdrop-blur"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};
