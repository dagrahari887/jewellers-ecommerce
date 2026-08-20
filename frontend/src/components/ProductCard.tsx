import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  metalType?: string | null;
  purity?: string | null;
  tags?: string[];
  isFeatured?: boolean;
  stock?: number;
  category?: { name: string } | null;
  images?: { id: string; url: string }[];
  avgRating?: number;
}

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export const ProductCard = ({ product, view = 'grid' }: ProductCardProps) => {
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isInWishlist = useStore((s) => s.isInWishlist);
  const addToast = useStore((s) => s.addToast);

  const inWishlist = isInWishlist(product.id);
  const image = product.images?.[0]?.url || '';
  const tag = Array.isArray(product.tags) ? product.tags[0] : undefined;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image,
      purity: product.purity || undefined,
      metalType: product.metalType || undefined,
    });
    addToast('success', `${product.name} added to bag`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      category: product.category?.name || '',
      purity: product.purity || undefined,
    });
    addToast(inWishlist ? 'info' : 'success', inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (view === 'list') {
    return (
      <Link to={`/product/${product.slug}`} className="group flex gap-5 bg-white border border-gray-100 hover:border-bj-gold/20 p-4 transition-all duration-300 card-luxury">
        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden bg-bj-ivory">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-gray-300 text-sm">BJ</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-[0.2em] text-bj-stone mb-1">{product.category?.name || product.metalType || 'Fine Jewellery'}</p>
          <h3 className="font-serif text-lg group-hover:text-bj-gold transition-colors line-clamp-1">{product.name}</h3>
          {product.purity && <p className="text-xs text-bj-stone mt-0.5">{product.metalType} · {product.purity}</p>}
          <p className="font-medium text-bj-charcoal mt-2">₹{Number(product.price).toLocaleString('en-IN')}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button type="button" onClick={handleWishlist} className={`p-1.5 rounded-full transition-colors ${inWishlist ? 'text-bj-gold' : 'text-gray-400 hover:text-bj-gold'}`}>
            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button type="button" onClick={handleAddToCart} disabled={isOutOfStock} className="btn-gold text-xs px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-product overflow-hidden bg-bj-cream">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bj-cream">
            <span className="font-serif text-4xl text-gray-200">BJ</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="badge-charcoal text-[9px]">Sold Out</span>
          </div>
        )}

        {/* Tag badge */}
        {tag && !isOutOfStock && (
          <span className="absolute top-3 left-3 badge-gold">{tag}</span>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleWishlist}
            className={`flex-none w-9 h-9 bg-white shadow-sm flex items-center justify-center transition-colors ${inWishlist ? 'text-bj-gold' : 'text-bj-charcoal hover:text-bj-gold'}`}
          >
            <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 bg-bj-charcoal text-white text-[9px] uppercase tracking-[0.2em] py-2.5 hover:bg-bj-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={12} />
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 text-center">
        <p className="text-[9px] uppercase tracking-[0.2em] text-bj-stone mb-1.5">
          {product.category?.name || product.metalType || 'Fine Jewellery'}
          {product.purity && ` · ${product.purity}`}
        </p>
        <h3 className="font-serif text-xl group-hover:text-bj-gold transition-colors duration-200 leading-snug">
          {product.name}
        </h3>
        {product.avgRating !== undefined && product.avgRating > 0 && (
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <Star size={11} className="text-bj-gold fill-bj-gold" />
            <span className="text-[10px] text-bj-stone">{product.avgRating.toFixed(1)}</span>
          </div>
        )}
        <p className="mt-2 font-medium text-bj-charcoal">
          ₹{Number(product.price).toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  );
};