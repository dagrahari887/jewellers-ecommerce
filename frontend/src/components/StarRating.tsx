import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const StarRating = ({
  rating,
  max = 5,
  size = 14,
  editable = false,
  onChange,
  className = '',
}: StarRatingProps) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={`${filled ? 'text-bj-gold fill-bj-gold' : 'text-gray-300 fill-gray-100'} ${editable ? 'cursor-pointer hover:text-bj-gold hover:fill-bj-gold transition-colors' : ''}`}
            onClick={() => editable && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
};
