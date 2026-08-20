import { useEffect, useState } from 'react';
import { API_URL } from '../store/useStore';

interface MetalRate {
  id: string;
  metal: string;
  purity: string;
  rate: number;
}

export const RatesTicker = () => {
  const [rates, setRates] = useState<MetalRate[]>([]);
  
  useEffect(() => {
    fetch(`${API_URL}/rates`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRates(data);
      })
      .catch(() => {});
  }, []);

  if (rates.length === 0) return null;

  const formatRate = (metal: string, purity: string) => {
    const rate = rates.find((r) => r.metal.toUpperCase() === metal && r.purity.toUpperCase() === purity);
    if (!rate) return null;
    return `₹${Number(rate.rate).toLocaleString('en-IN')}/g`;
  };

  const gold24 = formatRate('GOLD', '24K');
  const gold22 = formatRate('GOLD', '22K');
  const silver = formatRate('SILVER', '999') || formatRate('SILVER', '925');

  return (
    <div className="bg-bj-charcoal border-b border-white/10 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] uppercase tracking-widest text-bj-champagne">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-bj-gold animate-pulse"></span>
            Live Market Rates:
          </span>
          {gold24 && <span>24K Gold: <span className="text-white font-medium">{gold24}</span></span>}
          {gold22 && <span>22K Gold: <span className="text-white font-medium">{gold22}</span></span>}
          {silver && <span>Silver: <span className="text-white font-medium">{silver}</span></span>}
          <span className="hidden md:inline text-bj-gold opacity-60">•</span>
          <span className="hidden md:inline opacity-60">Baikunthh Exclusive</span>
        </div>
      </div>
    </div>
  );
};
