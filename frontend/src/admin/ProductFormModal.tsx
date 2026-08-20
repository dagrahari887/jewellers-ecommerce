import React, { useEffect, useState } from 'react';
import { apiRequest } from '../store/useStore';

interface ProductFormModalProps {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
  addToast: (type: any, msg: string) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSuccess, addToast }) => {
  const isEditing = !!product;
  const [categories, setCategories] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
    categoryId: product?.categoryId || '',
    priceType: product?.priceType || 'RATE_BASED',
    fixedPrice: product?.fixedPrice || '',
    stock: product?.stock || 0,
    imageUrl: product?.images?.[0]?.url || '',
    metalType: product?.metalType || 'GOLD',
    purity: product?.purity || '22K',
    grossWeight: product?.grossWeight || '',
    netWeight: product?.netWeight || '',
    makingCharge: product?.makingCharge || '',
    stoneCharge: product?.stoneCharge || '',
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest('/categories').then(res => setCategories(res.categories || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        images: form.imageUrl ? [form.imageUrl] : [],
      };
      
      if (isEditing) {
        await apiRequest(`/admin/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        addToast('success', 'Product updated successfully');
      } else {
        await apiRequest('/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        addToast('success', 'Product created successfully');
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
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-bj-charcoal">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-bj-charcoal">&times; Close</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Product Name *</label>
              <input required type="text" className="input-luxury w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="label-luxury">SKU *</label>
              <input required type="text" className="input-luxury w-full" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="label-luxury">Description *</label>
              <textarea required className="input-luxury w-full h-24" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
            </div>
            <div>
              <label className="label-luxury">Category *</label>
              <select required className="input-luxury w-full" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-luxury">Price Type</label>
              <select className="input-luxury w-full" value={form.priceType} onChange={e => setForm({...form, priceType: e.target.value})}>
                <option value="RATE_BASED">Rate Based (Gold/Silver)</option>
                <option value="FIXED">Fixed Price</option>
              </select>
            </div>
            {form.priceType === 'FIXED' ? (
              <div>
                <label className="label-luxury">Fixed Price (₹)</label>
                <input type="number" required className="input-luxury w-full" value={form.fixedPrice} onChange={e => setForm({...form, fixedPrice: e.target.value})} />
              </div>
            ) : (
              <>
                <div>
                  <label className="label-luxury">Metal Type</label>
                  <select className="input-luxury w-full" value={form.metalType} onChange={e => setForm({...form, metalType: e.target.value})}>
                    <option value="GOLD">Gold</option>
                    <option value="SILVER">Silver</option>
                    <option value="PLATINUM">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Purity</label>
                  <input type="text" className="input-luxury w-full" value={form.purity} placeholder="e.g. 22K, 18K" onChange={e => setForm({...form, purity: e.target.value})} />
                </div>
                <div>
                  <label className="label-luxury">Gross Wt (g)</label>
                  <input type="number" step="0.001" className="input-luxury w-full" value={form.grossWeight} onChange={e => setForm({...form, grossWeight: e.target.value})} />
                </div>
                <div>
                  <label className="label-luxury">Net Wt (g)</label>
                  <input type="number" step="0.001" className="input-luxury w-full" value={form.netWeight} onChange={e => setForm({...form, netWeight: e.target.value})} />
                </div>
                <div>
                  <label className="label-luxury">Making Charge (₹)</label>
                  <input type="number" step="0.01" className="input-luxury w-full" value={form.makingCharge} onChange={e => setForm({...form, makingCharge: e.target.value})} />
                </div>
                <div>
                  <label className="label-luxury">Stone Charge (₹)</label>
                  <input type="number" step="0.01" className="input-luxury w-full" value={form.stoneCharge} onChange={e => setForm({...form, stoneCharge: e.target.value})} />
                </div>
              </>
            )}
            <div>
              <label className="label-luxury">Initial Stock</label>
              <input type="number" min="0" className="input-luxury w-full" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
            </div>
            <div className="col-span-2">
              <label className="label-luxury">Image URL</label>
              <input type="url" className="input-luxury w-full" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://example.com/image.jpg" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 text-sm tracking-wider uppercase">Cancel</button>
            <button type="submit" disabled={loading} className="btn-gold px-6 py-2">{loading ? 'Saving...' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
