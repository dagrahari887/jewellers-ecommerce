import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Settings as SettingsIcon, Tag, TrendingUp, LayoutDashboard, Database, Search, Edit, Save, Trash2, Plus, Calendar, Image as ImageIcon, Ticket, MessageSquare, TrendingUp as TrendingUpIcon, Layers } from 'lucide-react';
import { useStore, apiRequest } from '../store/useStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProductFormModal } from '../admin/ProductFormModal';
import { AppointmentsManager } from '../admin/AppointmentsManager';
import { GoldRatesManager } from '../admin/GoldRatesManager';
import { BannersManager } from '../admin/BannersManager';
import { CouponsManager } from '../admin/CouponsManager';
import { ReviewsManager } from '../admin/ReviewsManager';
import { CustomerFormModal } from '../admin/CustomerFormModal';
import { CategoriesManager } from '../admin/CategoriesManager';

export const Admin = () => {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const addToast = useStore((s) => s.addToast);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'customers' | 'settings' | 'appointments' | 'rates' | 'banners' | 'coupons' | 'reviews'>('dashboard');
  const [loading, setLoading] = useState(true);
  
  // States
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalCustomers: 0, totalProducts: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [savingSettings, setSavingSettings] = useState(false);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Customer modal state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Orders expansion state
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'dashboard') {
          const [ordersRes, usersRes, prodsRes] = await Promise.all([
            apiRequest('/admin/orders'),
            apiRequest('/admin/customers'),
            apiRequest('/admin/products')
          ]);
          const rev = (ordersRes.orders || []).reduce((acc: number, order: any) => acc + Number(order.finalAmount), 0);
          setStats({
            totalOrders: (ordersRes.orders || []).length,
            totalRevenue: rev,
            totalCustomers: (usersRes.customers || []).length,
            totalProducts: (prodsRes.products || []).length
          });
        } else if (activeTab === 'orders') {
          const res = await apiRequest('/admin/orders');
          setOrders(res.orders || []);
        } else if (activeTab === 'products') {
          const res = await apiRequest('/admin/products');
          setProducts(res.products || []);
        } else if (activeTab === 'customers') {
          const res = await apiRequest('/admin/customers');
          setCustomers(res.customers || []);
        } else if (activeTab === 'settings') {
          const res = await apiRequest('/settings');
          setSettings(res.settings);
          setSettingsForm(res.settings || {});
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, activeTab, navigate]);

  if (!user || user.role !== 'ADMIN') return null;

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      addToast('success', `Order status updated to ${status}`);
    } catch (e: any) {
      addToast('error', e.message);
    }
  };

  const handleUpdateStock = async (id: string, stock: number) => {
    try {
      await apiRequest(`/admin/products/${id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ stock: Number(stock) })
      });
      setProducts(products.map(p => p.id === id ? { ...p, stock: Number(stock) } : p));
      addToast('success', 'Stock updated');
    } catch (e: any) {
      addToast('error', e.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsForm)
      });
      setSettings(res.settings);
      addToast('success', 'Store settings updated successfully');
    } catch (e: any) {
      addToast('error', e.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiRequest(`/admin/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
      addToast('success', 'Product deleted');
    } catch (e: any) {
      addToast('error', e.message);
    }
  };

  return (
    <div className="bg-bj-charcoal min-h-screen pt-20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bj-charcoal-light border-r border-white/5 hidden md:flex flex-col h-[calc(100vh-80px)] sticky top-20">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-white font-serif text-xl tracking-wide">Admin Portal</h2>
          <p className="text-bj-gold text-[10px] uppercase tracking-widest mt-1">Management Console</p>
        </div>
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('orders')} className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}>
            <Package size={18} /> Orders
          </button>
          <button onClick={() => setActiveTab('products')} className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}>
            <Tag size={18} /> Products & Inventory
          </button>
          <button onClick={() => setActiveTab('categories')} className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}>
            <Layers size={18} /> Categories
          </button>
          <button onClick={() => setActiveTab('customers')} className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}>
            <Users size={18} /> Customers
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`admin-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}>
            <Calendar size={18} /> Appointments
          </button>
          <button onClick={() => setActiveTab('rates')} className={`admin-nav-item ${activeTab === 'rates' ? 'active' : ''}`}>
            <TrendingUpIcon size={18} /> Gold Rates
          </button>
          <button onClick={() => setActiveTab('banners')} className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`}>
            <ImageIcon size={18} /> Banners
          </button>
          <button onClick={() => setActiveTab('coupons')} className={`admin-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}>
            <Ticket size={18} /> Coupons
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}>
            <MessageSquare size={18} /> Reviews
          </button>
          <button onClick={() => setActiveTab('settings')} className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <SettingsIcon size={18} /> Store Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-bj-ivory min-h-[calc(100vh-80px)] overflow-x-hidden">
        {/* Mobile Nav */}
        <div className="md:hidden bg-bj-charcoal-light flex overflow-x-auto no-scrollbar border-b border-white/10 sticky top-16 z-40">
          {['dashboard', 'orders', 'products', 'categories', 'customers', 'appointments', 'rates', 'banners', 'coupons', 'reviews', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-4 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === tab ? 'text-bj-gold border-b-2 border-bj-gold' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-8">
          {loading ? (
            <LoadingSpinner message="Loading Data" />
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  <div>
                    <h1 className="font-serif text-3xl text-bj-charcoal mb-2">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm">Welcome to your store management console.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-bj-gold/30 transition-colors">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-bj-gold/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                      <p className="text-sm text-gray-500 font-medium mb-1 relative z-10 flex items-center gap-2"><TrendingUp size={16} className="text-bj-gold" /> Total Revenue</p>
                      <p className="text-3xl font-serif text-bj-charcoal relative z-10">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-bj-gold/30 transition-colors">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                      <p className="text-sm text-gray-500 font-medium mb-1 relative z-10 flex items-center gap-2"><Package size={16} className="text-blue-500" /> Total Orders</p>
                      <p className="text-3xl font-serif text-bj-charcoal relative z-10">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-bj-gold/30 transition-colors">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                      <p className="text-sm text-gray-500 font-medium mb-1 relative z-10 flex items-center gap-2"><Users size={16} className="text-purple-500" /> Customers</p>
                      <p className="text-3xl font-serif text-bj-charcoal relative z-10">{stats.totalCustomers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-bj-gold/30 transition-colors">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                      <p className="text-sm text-gray-500 font-medium mb-1 relative z-10 flex items-center gap-2"><Database size={16} className="text-emerald-500" /> Products</p>
                      <p className="text-3xl font-serif text-bj-charcoal relative z-10">{stats.totalProducts}</p>
                    </div>
                  </div>
                </>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-serif text-2xl text-bj-charcoal">Recent Orders</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4 font-medium w-10"></th>
                          <th className="px-6 py-4 font-medium">Order ID</th>
                          <th className="px-6 py-4 font-medium">Customer</th>
                          <th className="px-6 py-4 font-medium">Date</th>
                          <th className="px-6 py-4 font-medium">Amount</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map(order => (
                          <React.Fragment key={order.id}>
                            <tr className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                              <td className="px-6 py-4 text-gray-400">
                                {expandedOrderId === order.id ? <span className="text-bj-gold">▼</span> : '▶'}
                              </td>
                              <td className="px-6 py-4 font-medium text-bj-charcoal">{order.orderNumber}</td>
                              <td className="px-6 py-4">{order.user.name}<br/><span className="text-xs text-gray-400">{order.user.email}</span></td>
                              <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 font-medium">
                                ₹{Number(order.finalAmount).toLocaleString()}
                                <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{order.paymentStatus || 'COD'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <select 
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="text-xs border-gray-200 rounded px-2 py-1 bg-white cursor-pointer hover:border-bj-gold"
                                >
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                </select>
                              </td>
                            </tr>
                            {expandedOrderId === order.id && (
                              <tr className="bg-gray-50/30">
                                <td colSpan={7} className="px-6 py-4 border-b border-gray-100">
                                  <div className="pl-14 space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Order Items</h4>
                                    {order.items.map((item: any) => (
                                      <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-bj-cream rounded overflow-hidden">
                                          {item.product?.images?.[0]?.url && <img src={item.product.images[0].url} className="w-full h-full object-cover" alt="" />}
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-bj-charcoal">{item.product?.name}</p>
                                          <p className="text-xs text-gray-500">Qty: {item.quantity} | ₹{Number(item.price).toLocaleString('en-IN')}</p>
                                        </div>
                                      </div>
                                    ))}
                                    {order.notes && (
                                      <div className="mt-4 p-3 bg-bj-gold/5 border border-bj-gold/20 text-xs text-gray-600 rounded">
                                        <strong className="text-bj-gold">Order Notes:</strong> {order.notes}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No orders found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              {activeTab === 'products' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                    <h2 className="font-serif text-2xl text-bj-charcoal">Inventory Management</h2>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search SKU..." className="pl-9 pr-4 py-2 border border-gray-200 rounded text-sm w-48 focus:border-bj-gold outline-none" />
                      </div>
                      <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="btn-gold text-xs px-4 py-2 flex items-center gap-1">
                        <Plus size={14} /> Add Product
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4 font-medium">Product</th>
                          <th className="px-6 py-4 font-medium">SKU</th>
                          <th className="px-6 py-4 font-medium">Category</th>
                          <th className="px-6 py-4 font-medium">Price</th>
                          <th className="px-6 py-4 font-medium">Stock</th>
                          <th className="px-6 py-4 font-medium text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                          <tr key={product.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                {product.images?.[0] && <img src={product.images[0].url} className="w-full h-full object-cover" alt="" />}
                              </div>
                              <span className="font-medium text-bj-charcoal truncate max-w-[200px]">{product.name}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                            <td className="px-6 py-4">{product.category?.name}</td>
                            <td className="px-6 py-4 font-medium">₹{Number(product.price).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 5 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                                {product.stock} in stock
                              </span>
                            </td>
                            <td className="px-6 py-4 flex gap-3 justify-center items-center h-full pt-6">
                              <button onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }} className="text-gray-400 hover:text-bj-gold" title="Edit">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-serif text-2xl text-bj-charcoal">Customer Directory</h2>
                    <button onClick={() => setIsCustomerModalOpen(true)} className="btn-gold text-xs px-4 py-2 flex items-center gap-1">
                      <Plus size={14} /> Add Customer
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4 font-medium">Name</th>
                          <th className="px-6 py-4 font-medium">Email</th>
                          <th className="px-6 py-4 font-medium">Phone</th>
                          <th className="px-6 py-4 font-medium">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {customers.map(customer => (
                          <tr key={customer.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-medium text-bj-charcoal">{customer.name}</td>
                            <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                            <td className="px-6 py-4 text-gray-500">{customer.phone || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-500">{new Date(customer.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADDITIONAL MANAGERS */}
              {activeTab === 'categories' && <CategoriesManager />}
              {activeTab === 'appointments' && <AppointmentsManager />}
              {activeTab === 'rates' && <GoldRatesManager />}
              {activeTab === 'banners' && <BannersManager />}
              {activeTab === 'coupons' && <CouponsManager />}
              {activeTab === 'reviews' && <ReviewsManager />}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="font-serif text-2xl text-bj-charcoal mb-6 flex items-center gap-2">
                    <SettingsIcon size={24} className="text-bj-gold" /> Store Configuration
                  </h2>
                  <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="label-luxury">Store Name</label>
                        <input type="text" className="input-luxury" value={settingsForm.storeName || ''} onChange={e => setSettingsForm({...settingsForm, storeName: e.target.value})} />
                      </div>
                      <div>
                        <label className="label-luxury">GST Percentage (%)</label>
                        <input type="number" step="0.01" className="input-luxury" value={settingsForm.gstPercentage || ''} onChange={e => setSettingsForm({...settingsForm, gstPercentage: e.target.value})} />
                      </div>
                      <div>
                        <label className="label-luxury">Contact Email</label>
                        <input type="email" className="input-luxury" value={settingsForm.contactEmail || ''} onChange={e => setSettingsForm({...settingsForm, contactEmail: e.target.value})} />
                      </div>
                      <div>
                        <label className="label-luxury">Contact Phone</label>
                        <input type="text" className="input-luxury" value={settingsForm.contactPhone || ''} onChange={e => setSettingsForm({...settingsForm, contactPhone: e.target.value})} />
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-sm uppercase tracking-widest font-medium text-gray-400 mb-4">Homepage Content</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="label-luxury">Hero Title</label>
                          <input type="text" className="input-luxury" value={settingsForm.heroTitle || ''} onChange={e => setSettingsForm({...settingsForm, heroTitle: e.target.value})} />
                        </div>
                        <div>
                          <label className="label-luxury">Hero Subtitle</label>
                          <input type="text" className="input-luxury" value={settingsForm.heroSubtitle || ''} onChange={e => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})} />
                        </div>
                        <div>
                          <label className="label-luxury">Announcement Bar Text</label>
                          <input type="text" className="input-luxury" value={settingsForm.announcement || ''} onChange={e => setSettingsForm({...settingsForm, announcement: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <button type="submit" disabled={savingSettings} className="btn-gold py-3 px-8 flex items-center gap-2">
                        <Save size={16} /> {savingSettings ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
      
      {isProductModalOpen && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }} 
          onSuccess={async () => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
            // Reload products
            const res = await apiRequest('/admin/products');
            setProducts(res.products || []);
          }} 
          addToast={addToast} 
        />
      )}

      {isCustomerModalOpen && (
        <CustomerFormModal
          onClose={() => setIsCustomerModalOpen(false)}
          onSuccess={async () => {
            setIsCustomerModalOpen(false);
            const res = await apiRequest('/admin/customers');
            setCustomers(res.customers || []);
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
};
