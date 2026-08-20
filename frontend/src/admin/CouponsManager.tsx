import { useEffect, useState } from 'react';
import { apiRequest, useStore } from '../store/useStore';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const CouponsManager = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const addToast = useStore((s) => s.addToast);

  const fetchCoupons = async () => {
    try {
      const res = await apiRequest('/admin/coupons');
      setCoupons(res.coupons || []);
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await apiRequest(`/admin/coupons/${id}`, { method: 'DELETE' });
      addToast('success', 'Coupon deleted');
      fetchCoupons();
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-serif text-2xl text-bj-charcoal">Coupons Management</h2>
        <button onClick={() => { setEditingCoupon(null); setIsModalOpen(true); }} className="btn-gold text-xs px-4 py-2 flex items-center gap-1">
          <Plus size={14} /> Add Coupon
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Min. Order</th>
              <th className="px-6 py-4 font-medium">Expiry</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-bj-charcoal">{coupon.code}</td>
                <td className="px-6 py-4 text-gray-500">
                  {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}%` : `₹${coupon.value}`}
                </td>
                <td className="px-6 py-4 text-gray-500">₹{coupon.minOrderAmount}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired/Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3 justify-center items-center h-full pt-4">
                  <button onClick={() => { setEditingCoupon(coupon); setIsModalOpen(true); }} className="text-gray-400 hover:text-bj-gold" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(coupon.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No coupons found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CouponFormModal 
          coupon={editingCoupon}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCoupons();
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
};

const CouponFormModal = ({ coupon, onClose, onSuccess, addToast }: any) => {
  const [form, setForm] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    discountType: coupon?.discountType || 'PERCENTAGE',
    value: coupon?.value || '',
    minOrderAmount: coupon?.minOrderAmount || 0,
    maxDiscount: coupon?.maxDiscount || '',
    expiryDate: coupon ? new Date(coupon.expiryDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: coupon?.usageLimit || '',
    isActive: coupon ? coupon.isActive : true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        expiryDate: new Date(form.expiryDate).toISOString(),
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      };

      if (coupon) {
        await apiRequest(`/admin/coupons/${coupon.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        addToast('success', 'Coupon updated');
      } else {
        await apiRequest('/admin/coupons', { method: 'POST', body: JSON.stringify(payload) });
        addToast('success', 'Coupon created');
      }
      onSuccess();
    } catch (err: any) {
      addToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif text-bj-charcoal mb-6">{coupon ? 'Edit Coupon' : 'Add Coupon'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-luxury">Code *</label>
            <input required type="text" className="input-luxury w-full uppercase" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
          </div>
          <div>
            <label className="label-luxury">Description</label>
            <input type="text" className="input-luxury w-full" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Discount Type</label>
              <select className="input-luxury w-full" value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="label-luxury">Value *</label>
              <input required type="number" step="0.01" className="input-luxury w-full" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Min Order Amount (₹)</label>
              <input type="number" className="input-luxury w-full" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: Number(e.target.value)})} />
            </div>
            <div>
              <label className="label-luxury">Max Discount (₹)</label>
              <input type="number" className="input-luxury w-full" value={form.maxDiscount} onChange={e => setForm({...form, maxDiscount: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Expiry Date *</label>
              <input required type="date" className="input-luxury w-full" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} />
            </div>
            <div>
              <label className="label-luxury">Usage Limit</label>
              <input type="number" className="input-luxury w-full" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
            <label className="text-sm font-medium">Active</label>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 text-sm tracking-wider uppercase">Cancel</button>
            <button type="submit" disabled={loading} className="btn-gold px-6 py-2">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
