import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, MapPin, LogOut, X } from 'lucide-react';
import { useStore, apiRequest } from '../store/useStore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Account = () => {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const updateUser = useStore((s) => s.updateUser);
  const addToast = useStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', label: 'Home'
  });

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ name: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'orders') {
          const res = await apiRequest('/orders');
          setOrders(res.orders || []);
        } else if (activeTab === 'profile') {
          const res = await apiRequest('/me');
          setProfile(res.user);
          setEditProfileForm({ name: res.user.name || '', phone: res.user.phone || '' });
        } else if (activeTab === 'addresses') {
          const res = await apiRequest('/me/addresses');
          setAddresses(res.addresses || []);
        }
      } catch (error: any) {
        if (error.message === 'Token expired' || error.message === 'Invalid token') {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, activeTab, navigate, logout]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await apiRequest('/me/addresses', {
        method: 'POST',
        body: JSON.stringify(newAddress)
      });
      setAddresses([res.address, ...addresses]);
      setShowAddressForm(false);
      setNewAddress({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', label: 'Home' });
      addToast('success', 'Address added successfully');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to add address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await apiRequest(`/me/addresses/${id}`, { method: 'DELETE' });
      setAddresses(addresses.filter(a => a.id !== id));
      addToast('success', 'Address deleted');
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await apiRequest('/me', {
        method: 'PUT',
        body: JSON.stringify(editProfileForm)
      });
      setProfile(res.user);
      updateUser({ name: res.user.name, phone: res.user.phone });
      setShowProfileEdit(false);
      addToast('success', 'Profile updated successfully');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await apiRequest('/me/password', {
        method: 'PUT',
        body: JSON.stringify(passwordForm)
      });
      setShowPasswordEdit(false);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      addToast('success', 'Password updated successfully');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-error';
      case 'SHIPPED': return 'badge-gold';
      default: return 'badge-charcoal';
    }
  };

  return (
    <div className="bg-bj-ivory min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-bj-charcoal mb-2">My Account</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user.name}</p>
          </div>
          {user.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin')} className="btn-gold-sm">
              Admin Portal →
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white border border-gray-100 shadow-sm sticky top-24">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium border-l-2 transition-colors ${activeTab === 'orders' ? 'border-bj-gold text-bj-gold bg-bj-gold/5' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <Package size={18} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium border-l-2 transition-colors ${activeTab === 'orders' ? '' : 'border-t border-gray-100'} ${activeTab === 'profile' ? 'border-l-bj-gold text-bj-gold bg-bj-gold/5' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={18} /> Profile Details
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium border-l-2 transition-colors border-t border-gray-100 ${activeTab === 'addresses' ? 'border-l-bj-gold text-bj-gold bg-bj-gold/5' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin size={18} /> Saved Addresses
              </button>
              
              <div className="border-t border-gray-100 mt-4 pt-4 mb-4 px-5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {/* ===================== ORDERS TAB ===================== */}
                {activeTab === 'orders' && (
                  <div className="space-y-6 fade-in">
                    <h2 className="font-serif text-2xl text-bj-charcoal mb-6">Order History</h2>
                    {orders.length === 0 ? (
                      <div className="bg-white p-10 text-center border border-gray-100 shadow-sm">
                        <Package size={40} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/shop')} className="btn-outline">Start Shopping</button>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-100 shadow-sm mb-6 overflow-hidden">
                          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order Placed</p>
                              <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order #</p>
                              <p className="text-sm font-medium">{order.orderNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                              <p className="text-sm font-medium">₹{Number(order.finalAmount).toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <span className={getStatusColor(order.status)}>{order.status}</span>
                            </div>
                          </div>
                          
                          <div className="p-5 space-y-4">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-bj-cream shrink-0">
                                  {item.product?.images?.[0]?.url && <img src={item.product.images[0].url} className="w-full h-full object-cover" alt="" />}
                                </div>
                                <div className="flex-1">
                                  <p className="font-serif text-lg leading-tight mb-1">{item.product?.name || 'Product'}</p>
                                  <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity} | ₹{Number(item.price).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="hidden sm:block text-right">
                                  <button onClick={() => navigate(`/product/${item.product?.slug}`)} className="text-xs text-bj-gold hover:underline uppercase tracking-widest font-medium">View Item</button>
                                </div>
                              </div>
                            ))}
                            {/* Display requested sizes if notes exist */}
                            {order.notes && order.notes.startsWith('Sizes requested:') && (
                              <div className="mt-4 p-3 bg-bj-gold/5 border border-bj-gold/20 text-xs text-gray-600">
                                <strong className="text-bj-gold">Order Notes:</strong> {order.notes}
                              </div>
                            )}
                          </div>
                          
                          {order.trackingNumber && (
                            <div className="p-4 bg-blue-50/50 border-t border-blue-100 text-sm flex gap-2 items-center">
                              <span className="font-medium text-blue-900">Tracking Number:</span> 
                              <span className="text-blue-800">{order.trackingNumber}</span>
                              {order.trackingUrl && (
                                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-bj-gold hover:underline">Track Package →</a>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ===================== PROFILE TAB ===================== */}
                {activeTab === 'profile' && profile && (
                  <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm max-w-2xl fade-in relative">
                    <h2 className="font-serif text-2xl text-bj-charcoal mb-6">Profile Details</h2>
                    
                    {!showProfileEdit && !showPasswordEdit ? (
                      <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="label-luxury">Full Name</label>
                            <p className="font-medium">{profile.name}</p>
                          </div>
                          <div>
                            <label className="label-luxury">Email Address</label>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                          <div>
                            <label className="label-luxury">Phone Number</label>
                            <p className="font-medium">{profile.phone || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="label-luxury">Member Since</label>
                            <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100 flex items-center">
                          <button onClick={() => setShowProfileEdit(true)} className="btn-outline text-xs">Edit Profile</button>
                          <button onClick={() => setShowPasswordEdit(true)} className="ml-5 text-xs uppercase tracking-widest font-medium text-gray-500 hover:text-bj-charcoal underline underline-offset-2">Change Password</button>
                        </div>
                      </div>
                    ) : showProfileEdit ? (
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-sm uppercase tracking-widest text-bj-charcoal">Edit Profile</h3>
                          <button type="button" onClick={() => setShowProfileEdit(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                        </div>
                        <div>
                          <label className="label-luxury">Full Name</label>
                          <input required type="text" className="input-luxury" value={editProfileForm.name} onChange={e => setEditProfileForm({...editProfileForm, name: e.target.value})} />
                        </div>
                        <div>
                          <label className="label-luxury">Phone Number</label>
                          <input type="text" className="input-luxury" value={editProfileForm.phone} onChange={e => setEditProfileForm({...editProfileForm, phone: e.target.value})} />
                        </div>
                        <div className="pt-4 flex gap-3">
                          <button type="submit" disabled={savingProfile} className="btn-gold px-6">
                            {savingProfile ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button type="button" onClick={() => setShowProfileEdit(false)} className="btn-outline px-6">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleSavePassword} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-sm uppercase tracking-widest text-bj-charcoal">Change Password</h3>
                          <button type="button" onClick={() => setShowPasswordEdit(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                        </div>
                        <div>
                          <label className="label-luxury">Current Password</label>
                          <input required type="password" minLength={6} className="input-luxury" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} />
                        </div>
                        <div>
                          <label className="label-luxury">New Password</label>
                          <input required type="password" minLength={6} className="input-luxury" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
                        </div>
                        <div className="pt-4 flex gap-3">
                          <button type="submit" disabled={savingPassword} className="btn-gold px-6">
                            {savingPassword ? 'Updating...' : 'Update Password'}
                          </button>
                          <button type="button" onClick={() => setShowPasswordEdit(false)} className="btn-outline px-6">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* ===================== ADDRESSES TAB ===================== */}
                {activeTab === 'addresses' && (
                  <div className="fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-serif text-2xl text-bj-charcoal">Saved Addresses</h2>
                      {!showAddressForm && (
                        <button onClick={() => setShowAddressForm(true)} className="btn-gold text-xs px-4 py-2">+ Add New</button>
                      )}
                    </div>
                    
                    {showAddressForm ? (
                      <form onSubmit={handleSaveAddress} className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm max-w-2xl mb-6">
                        <h3 className="text-sm font-medium mb-6 uppercase tracking-widest text-bj-charcoal">Add New Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="label-luxury">Label (e.g. Home, Office)</label>
                            <input required type="text" className="input-luxury" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} />
                          </div>
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
                        <div className="mt-8 flex gap-3">
                          <button type="submit" disabled={savingAddress} className="btn-gold py-3 px-6">
                            {savingAddress ? 'Saving...' : 'Save Address'}
                          </button>
                          <button type="button" onClick={() => setShowAddressForm(false)} className="btn-outline py-3 px-6">
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : addresses.length === 0 ? (
                      <div className="bg-white p-10 text-center border border-gray-100 shadow-sm">
                        <MapPin size={40} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">You haven't saved any addresses yet.</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr.id} className="bg-white p-6 border border-gray-100 shadow-sm relative hover:border-bj-gold/30 transition-colors">
                            {addr.isDefault && <span className="absolute top-0 right-0 bg-bj-gold text-white text-[9px] uppercase tracking-widest px-2 py-1">Default</span>}
                            <span className="badge-charcoal mb-3">{addr.label}</span>
                            <p className="font-medium text-bj-charcoal mb-1">{addr.fullName}</p>
                            <p className="text-sm text-gray-600 mb-1">{addr.phone}</p>
                            <p className="text-sm text-gray-600 mb-5 leading-relaxed h-10">{addr.line1}, {addr.line2 ? addr.line2 + ', ' : ''}{addr.city}, {addr.state} - {addr.pincode}</p>
                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                              <button onClick={() => handleDeleteAddress(addr.id)} className="text-[10px] uppercase tracking-widest font-medium text-red-500 hover:text-red-700 transition-colors">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};