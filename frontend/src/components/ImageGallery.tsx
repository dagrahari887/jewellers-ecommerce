import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface ImageGalleryProps {
  images: { id: string; url: string }[];
  alt: string;
}

export const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const count = images?.length ?? 0;

  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
      else if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % count);
      else if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isExpanded, count]);

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
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-bj-gold shadow-sm focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-bj-gold shadow-sm focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  aria-label={`Show image ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-bj-gold w-4' : 'bg-white/60 hover:bg-white'}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
          aria-label="View full screen"
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity hover:bg-white hover:text-bj-gold shadow-sm"
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
              aria-label={`Show image ${i + 1}`}
              aria-current={i === currentIndex}
              className={`relative shrink-0 w-20 h-20 bg-bj-cream overflow-hidden border-2 transition-colors ${i === currentIndex ? 'border-bj-gold' : 'border-transparent hover:border-bj-gold/50'}`}
            >
              <img src={img.url} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={`${alt} images`} onClick={() => setIsExpanded(false)}>
          <button type="button" autoFocus className="absolute top-6 right-6 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            Close (Esc)
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
                aria-label="Previous image"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center rounded-full transition-colors backdrop-blur"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Next image"
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
