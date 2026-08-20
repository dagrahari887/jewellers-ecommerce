import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { EmptyState } from '../components/EmptyState';

export const Wishlist = () => {
  const wishlist = useStore((s) => s.wishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const addToast = useStore((s) => s.addToast);

  if (wishlist.length === 0) {
    return (
      <div className="bg-bj-ivory min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <EmptyState 
            icon={<Heart size={48} className="text-bj-gold fill-bj-gold/20" />}
            title="Your Wishlist is Empty"
            description="Save your favorite Baikunthh pieces here to curate your dream collection."
            actionText="Explore Jewellery"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bj-ivory min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="section-eyebrow">Saved Items</p>
          <h1 className="font-serif text-3xl md:text-4xl text-bj-charcoal mb-2">Your Wishlist</h1>
          <p className="text-sm text-gray-500">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
          {wishlist.map((item) => (
            <div key={item.productId} className="group block bg-white border border-gray-100 p-3 sm:p-4 card-luxury">
              <Link to={`/product/${item.slug}`} className="block relative aspect-product overflow-hidden bg-bj-cream mb-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-gray-200">BJ</div>
                )}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(item.productId);
                    addToast('info', 'Removed from wishlist');
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </Link>
              
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.2em] text-bj-stone mb-1.5 line-clamp-1">
                  {item.category || 'Jewellery'} {item.purity && ` · ${item.purity}`}
                </p>
                <Link to={`/product/${item.slug}`}>
                  <h3 className="font-serif text-lg group-hover:text-bj-gold transition-colors line-clamp-1">{item.name}</h3>
                </Link>
                <p className="mt-1.5 font-medium text-bj-charcoal">₹{Number(item.price).toLocaleString('en-IN')}</p>
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
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
                  className="btn-gold-sm w-full mt-4 py-2.5 text-[9px] flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={12} /> Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
