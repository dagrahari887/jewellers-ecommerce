import { Info } from 'lucide-react';

interface PriceBreakdownProps {
  metalType?: string | null;
  purity?: string | null;
  netWeight?: number | null;
  makingCharge?: number | null;
  stoneCharge?: number | null;
  totalPrice: number;
  fixedPrice?: number | null;
  priceType: 'FIXED' | 'RATE_BASED';
}

export const PriceBreakdown = ({
  metalType, purity, netWeight, makingCharge, stoneCharge, totalPrice, fixedPrice, priceType
}: PriceBreakdownProps) => {
  
  if (priceType === 'FIXED' || fixedPrice) {
    return (
      <div className="bg-bj-ivory p-5 border border-gray-100">
        <h4 className="text-[10px] uppercase tracking-widest text-bj-stone mb-4 font-medium flex items-center gap-1.5">
          <Info size={12} /> Pricing Details
        </h4>
        <div className="flex justify-between items-center">
          <span className="text-sm text-bj-charcoal font-medium">Standard Price</span>
          <span className="text-sm font-medium">₹{Number(fixedPrice || totalPrice).toLocaleString('en-IN')}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>Taxes (GST)</span>
          <span>Included</span>
        </div>
      </div>
    );
  }

  const metalValue = totalPrice - Number(makingCharge || 0) - Number(stoneCharge || 0);

  return (
    <div className="bg-bj-ivory p-5 border border-gray-100">
      <h4 className="text-[10px] uppercase tracking-widest text-bj-stone mb-4 font-medium flex items-center gap-1.5">
        <Info size={12} /> Transparent Pricing
      </h4>
      
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Gold Value ({netWeight}g)</span>
          <span className="font-medium">₹{metalValue.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Making Charges</span>
          <span className="font-medium">₹{Number(makingCharge || 0).toLocaleString('en-IN')}</span>
        </div>

        {Number(stoneCharge) > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Stone / Diamond Charges</span>
            <span className="font-medium">₹{Number(stoneCharge).toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-bj-charcoal">Subtotal</span>
          <span className="text-lg font-serif">₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-[9px] text-right text-gray-400 mt-1 uppercase tracking-widest">Inclusive of 3% GST</p>
      </div>
    </div>
  );
};
