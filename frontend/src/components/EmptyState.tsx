import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  actionOnClick?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  actionLink,
  actionOnClick,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto">
      {icon && <div className="text-gray-300 mb-6">{icon}</div>}
      <h3 className="font-serif text-3xl text-bj-charcoal mb-3">{title}</h3>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">{description}</p>
      
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-gold">
          {actionText}
        </Link>
      )}
      
      {actionText && actionOnClick && (
        <button type="button" onClick={actionOnClick} className="btn-gold">
          {actionText}
        </button>
      )}
    </div>
  );
};
