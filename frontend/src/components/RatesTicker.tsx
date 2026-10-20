import { useEffect, useState } from 'react';
import { API_URL } from '../store/useStore';

interface MetalRate {
  id: string;
  metal: string;
  purity: string;
  rate: number;
  updatedAt: string;
}

// The showroom's own per-gram rates, as set in the admin panel (not a market feed).
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

  const find = (metal: string, purity: string) =>
    rates.find((r) => r.metal.toUpperCase() === metal && r.purity.toUpperCase() === purity);

  const shown = [
    { label: '24K Gold', rate: find('GOLD', '24K') },
    { label: '22K Gold', rate: find('GOLD', '22K') },
    { label: '18K Gold', rate: find('GOLD', '18K') },
    { label: 'Silver', rate: find('SILVER', '999') || find('SILVER', '925') },
  ].filter((r) => r.rate);

  const updated = new Date(Math.max(...rates.map((r) => new Date(r.updatedAt).getTime())));

  return (
    <section aria-label="Today's metal rates" className="border-y border-gray-200">
      <div className="page-container py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
        <p className="text-sm text-bj-charcoal shrink-0">
          Rates per gram
          <span className="text-gray-500"> · updated {updated.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </p>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 md:ml-auto tabular-nums">
          {shown.map(({ label, rate }) => (
            <div key={label} className="flex items-baseline gap-2">
              <dt className="text-xs text-gray-500">{label}</dt>
              <dd className="font-serif text-xl text-bj-charcoal">₹{Number(rate!.rate).toLocaleString('en-IN')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
