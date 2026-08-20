import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, API_URL, apiRequest } from '../store/useStore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Checkout = () => {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const cartTotal = useStore((s) => s.cartTotal());
  const user = useStore((s) => s.user);
  const clearCart = useStore((s) => s.clearCart);
  const addToast = useStore((s) => s.addToast);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  const [couponCode, setCouponCode] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    if (!user) {
      addToast('info', 'Please sign in to complete checkout');
      navigate('/login?redirect=/checkout');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await apiRequest('/me/addresses');
        setAddresses(res.addresses || []);
        const defaultAddr = res.addresses.find((a: any) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (res.addresses.length > 0) setSelectedAddressId(res.addresses[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setInitLoading(false);
      }
    };
    fetchAddresses();
  }, [user, cart, navigate, addToast]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await apiRequest('/me/addresses', {
        method: 'POST',
        body: JSON.stringify(newAddress)
      });
      setAddresses([res.address, ...addresses]);
      setSelectedAddressId(res.address.id);
      setShowAddressForm(false);
      setNewAddress({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
      addToast('success', 'Address added successfully');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to add address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponValidating(true);
    try {
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderAmount: cartTotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setAppliedCoupon({ ...data.coupon, discountAmount: data.discountAmount });
      addToast('success', `Coupon ${data.coupon.code} applied successfully!`);
    } catch (err: any) {
      addToast('error', err.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      addToast('error', 'Please select a delivery address');
      return;
    }

    const address = addresses.find(a => a.id === selectedAddressId);
    if (!address) return;

    setLoading(true);
    try {
      const addressString = `${address.fullName}, ${address.phone}, ${address.line1}, ${address.line2 ? address.line2 + ', ' : ''}${address.city}, ${address.state} - ${address.pincode}`;

      const itemsWithSizes = cart.filter(item => item.size).map(item => `${item.name}: Size ${item.size}`);
      const notes = itemsWithSizes.length > 0 ? `Sizes requested: ${itemsWithSizes.join('; ')}` : undefined;

      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
          address: addressString,
          paymentMethod: 'COD',
          couponCode: appliedCoupon?.code || undefined,
          notes,
        }),
      });

      addToast('success', 'Order placed successfully!');
      clearCart();
      navigate('/account');
    } catch (error: any) {
      addToast('error', error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) return <LoadingSpinner fullPage message="Preparing Checkout" />;

  const finalTotal = cartTotal - (appliedCoupon?.discountAmount || 0);

  return (
    <div className="bg-bj-ivory min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl md:text-4xl text-bj-charcoal mb-10 text-center">Secure Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 space-y-8">
            {/* Address Selection */}
            <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-bj-gold/10 text-bj-gold flex items-center justify-center text-sm font-bold">1</span>
                  Delivery Address
                </h2>
                {addresses.length > 0 && !showAddressForm && (
                  <button onClick={() => setShowAddressForm(true)} className="btn-outline text-[10px] px-4 py-2">
                    + Add New
                  </button>
                )}
              </div>
              
              {showAddressForm || addresses.length === 0 ? (
                <form onSubmit={handleSaveAddress} className="bg-bj-ivory p-6 border border-gray-200">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-widest text-bj-charcoal">Add New Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-luxury">Full Name *</label>
                      <input required type="text" className="input-luxury" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-luxury">Phone Number *</label>
                      <input required type="text" className="input-luxury" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-luxury">Address Line 1 *</label>
                      <input required type="text" className="input-luxury" value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1: e.target.value})} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-luxury">Address Line 2</label>
                      <input type="text" className="input-luxury" value={newAddress.line2} onChange={e => setNewAddress({...newAddress, line2: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-luxury">City *</label>
                      <input required type="text" className="input-luxury" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-luxury">State *</label>
                      <input required type="text" className="input-luxury" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-luxury">Pincode *</label>
                      <input required type="text" className="input-luxury" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button type="submit" disabled={savingAddress} className="btn-gold py-3 px-6">
                      {savingAddress ? 'Saving...' : 'Save & Use This Address'}
                    </button>
                    {addresses.length > 0 && (
                      <button type="button" onClick={() => setShowAddressForm(false)} className="btn-outline py-3 px-6">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-bj-gold bg-bj-gold/5' : 'border-gray-200 hover:border-bj-gold/50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="badge-charcoal">{addr.label}</span>
                        {selectedAddressId === addr.id && <span className="w-4 h-4 rounded-full bg-bj-gold border-[3px] border-white shadow-[0_0_0_1px_#C5A059]"></span>}
                        {selectedAddressId !== addr.id && <span className="w-4 h-4 rounded-full border border-gray-300"></span>}
                      </div>
                      <p className="font-medium text-bj-charcoal mb-1">{addr.fullName}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 h-10">{addr.line1}, {addr.city}</p>
                      <p className="text-sm text-gray-600 mt-2">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method (COD only for demo) */}
            <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-bj-gold/10 text-bj-gold flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>
              <div className="p-4 border border-bj-gold bg-bj-gold/5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-bj-charcoal">Cash on Delivery / Pay on Delivery</p>
                  <p className="text-sm text-gray-500">Pay securely at your doorstep</p>
                </div>
                <span className="w-4 h-4 rounded-full bg-bj-gold border-[3px] border-white shadow-[0_0_0_1px_#C5A059]"></span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-serif text-xl mb-6">Order Details</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto no-scrollbar pr-2">
                {cart.map(item => (
                  <div key={item.productId} className="flex gap-4">
                    <img src={item.image || ''} className="w-16 h-16 object-cover bg-bj-cream" alt="" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-bj-charcoal line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 mt-0.5">Qty: {item.quantity}{item.size ? ` · Size: ${item.size}` : ''}</p>
                      <p className="font-medium mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="pt-4 border-t border-gray-200 mb-6">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="input-luxury uppercase"
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyCoupon}
                      disabled={couponValidating || !couponCode}
                      className="btn-gold px-4 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100">
                    <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                      <span className="text-lg">🏷️</span> {appliedCoupon.code} Applied
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-gray-500 hover:text-red-500 underline">Remove</button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- ₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Complimentary</span>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 text-xl font-serif text-bj-charcoal">
                  <span>Total Payable</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-right uppercase tracking-widest text-gray-400">Inclusive of GST</p>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading || !selectedAddressId}
                className="btn-gold w-full py-4 text-sm disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Place Order (₹${finalTotal.toLocaleString('en-IN')})`}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};