import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';

export const Wishlist = () => {
  const wishlist = useStore((s) => s.wishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const addToast = useStore((s) => s.addToast);

  if (wishlist.length === 0) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <EmptyState 
            icon={<Heart size={48} className="text-bj-gold fill-bj-gold/20" />}
            title="Your Wishlist is Empty"
            description="Tap the heart on any piece to keep it here for later."
            actionText="Explore Jewellery"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mb-8 md:mb-10">
          <h1 className="page-title mb-2">Your Wishlist</h1>
          <p className="text-sm text-gray-500">{wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'} saved</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {wishlist.map((item) => (
            <div key={item.productId} className="flex flex-col">
              <ProductCard
                product={{
                  id: item.productId,
                  name: item.name,
                  slug: item.slug,
                  price: item.price,
                  purity: item.purity,
                  category: item.category ? { name: item.category } : null,
                  images: item.image ? [{ id: item.productId, url: item.image }] : [],
                }}
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    addToCart({
                      productId: item.productId,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image,
                      purity: item.purity,
                    });
                    removeFromWishlist(item.productId);
                    addToast('success', 'Moved to shopping bag');
                  }}
                  className="btn-outline flex-1 min-w-0 px-3 py-2.5 text-[10px]"
                >
                  <ShoppingBag size={12} /> Move to Bag
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeFromWishlist(item.productId);
                    addToast('info', 'Removed from wishlist');
                  }}
                  className="shrink-0 w-11 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 flex items-center justify-center transition-colors"
                  title="Remove from wishlist"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
