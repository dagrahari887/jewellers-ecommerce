import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner = ({ size = 'md', message, fullPage = false }: LoadingSpinnerProps) => {
  const sizes = { sm: 16, md: 24, lg: 40 };
  const iconSize = sizes[size];

  if (fullPage) {
    return (
      <div className="min-h-screen bg-bj-ivory flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-bj-gold/30 border-t-bj-gold rounded-full animate-spin" />
        {message && <p className="text-sm text-bj-stone uppercase tracking-widest">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        style={{ width: iconSize, height: iconSize }}
        className="border-2 border-bj-gold/30 border-t-bj-gold rounded-full animate-spin"
      />
      {message && <p className="text-xs text-bj-stone uppercase tracking-[0.2em]">{message}</p>}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-product bg-gray-200 rounded-sm" />
    <div className="pt-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
      <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto" />
    </div>
  </div>
);
