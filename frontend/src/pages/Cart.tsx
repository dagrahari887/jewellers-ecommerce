import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { EmptyState } from '../components/EmptyState';

export const Cart = () => {
  const cart = useStore((s) => s.cart);
  const cartTotal = useStore((s) => s.cartTotal());
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateQuantity = useStore((s) => s.updateQuantity);

  if (cart.length === 0) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <EmptyState 
            icon={<ShoppingBag size={48} className="text-bj-gold" />}
            title="Your Shopping Bag is Empty"
            description="Discover our exquisite collections and find the perfect piece."
            actionText="Continue Shopping"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <h1 className="page-title mb-8 md:mb-10">Your Shopping Bag</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {cart.map((item) => (
              <div key={`${item.productId}-${item.size ?? ''}`} className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center bg-white p-4 sm:p-0 sm:bg-transparent border border-gray-100 sm:border-0 shadow-sm sm:shadow-none py-4 border-b border-gray-200">
                <div className="col-span-6 flex items-center gap-4 w-full">
                  <Link to={`/product/${item.productId}`} className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-bj-cream">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-gray-300">BJ</div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${item.productId}`} className="font-serif text-lg hover:text-bj-gold transition-colors line-clamp-2 leading-tight">
                      {item.name}
                    </Link>
                    {(item.metalType || item.purity || item.size) && (
                      <p className="text-[10px] uppercase tracking-[0.2em] text-bj-stone mt-1">
                        {[item.metalType, item.purity, item.size ? `Size: ${item.size}` : null].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="sm:hidden text-sm font-medium mt-2">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 flex justify-between sm:justify-center items-center w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-200 w-24 sm:w-28">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                      className="px-3 py-2.5 text-gray-500 hover:text-bj-gold transition-colors disabled:opacity-30 disabled:hover:text-gray-500 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center text-sm font-medium tabular-nums" aria-live="polite">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                      className="px-3 py-2.5 text-gray-500 hover:text-bj-gold transition-colors"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="sm:hidden text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>

                <div className="col-span-3 text-right hidden sm:flex flex-col items-end gap-2">
                  <span className="text-lg font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  <button 
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove item"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white p-6 shadow-sm border border-gray-100 sticky top-[calc(var(--header-h)+1.5rem)]">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6 tabular-nums">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200 text-lg font-medium text-bj-charcoal">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-right uppercase tracking-widest text-gray-500">Inclusive of GST</p>
              </div>

              <Link to="/checkout" className="btn-gold w-full py-4 text-sm flex items-center justify-center gap-2">
                Proceed to Checkout
              </Link>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-gray-500 justify-center">
                  <ShieldCheck size={16} className="text-bj-gold" />
                  Pay on delivery
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};