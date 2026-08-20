import { useEffect, useState } from 'react';
import { apiRequest, useStore } from '../store/useStore';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const BannersManager = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const addToast = useStore((s) => s.addToast);

  const fetchBanners = async () => {
    try {
      const res = await apiRequest('/admin/banners');
      setBanners(res.banners || []);
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await apiRequest(`/admin/banners/${id}`, { method: 'DELETE' });
      addToast('success', 'Banner deleted');
      fetchBanners();
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-serif text-2xl text-bj-charcoal">Banners Management</h2>
        <button onClick={() => { setEditingBanner(null); setIsModalOpen(true); }} className="btn-gold text-xs px-4 py-2 flex items-center gap-1">
          <Plus size={14} /> Add Banner
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Subtitle</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map(banner => (
              <tr key={banner.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="w-24 h-12 bg-gray-100 rounded overflow-hidden">
                    <img src={banner.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-bj-charcoal">{banner.title || '-'}</td>
                <td className="px-6 py-4 text-gray-500">{banner.subtitle || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${banner.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3 justify-center items-center h-full pt-4">
                  <button onClick={() => { setEditingBanner(banner); setIsModalOpen(true); }} className="text-gray-400 hover:text-bj-gold" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No banners found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <BannerFormModal 
          banner={editingBanner}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchBanners();
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
};

const BannerFormModal = ({ banner, onClose, onSuccess, addToast }: any) => {
  const [form, setForm] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    imageUrl: banner?.imageUrl || '',
    linkUrl: banner?.linkUrl || '',
    buttonText: banner?.buttonText || '',
    isActive: banner ? banner.isActive : true,
    displayOrder: banner?.displayOrder || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (banner) {
        await apiRequest(`/admin/banners/${banner.id}`, { method: 'PUT', body: JSON.stringify(form) });
        addToast('success', 'Banner updated');
      } else {
        await apiRequest('/admin/banners', { method: 'POST', body: JSON.stringify(form) });
        addToast('success', 'Banner created');
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
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
        <h2 className="text-2xl font-serif text-bj-charcoal mb-6">{banner ? 'Edit Banner' : 'Add Banner'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-luxury">Title</label>
            <input type="text" className="input-luxury w-full" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="label-luxury">Subtitle</label>
            <input type="text" className="input-luxury w-full" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
          </div>
          <div>
            <label className="label-luxury">Image URL *</label>
            <input required type="url" className="input-luxury w-full" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
          </div>
          <div>
            <label className="label-luxury">Link URL</label>
            <input type="text" className="input-luxury w-full" value={form.linkUrl} onChange={e => setForm({...form, linkUrl: e.target.value})} />
          </div>
          <div>
            <label className="label-luxury">Button Text</label>
            <input type="text" className="input-luxury w-full" value={form.buttonText} onChange={e => setForm({...form, buttonText: e.target.value})} />
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
