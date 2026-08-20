import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiRequest, useStore } from '../store/useStore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CategoriesManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' });
  const [saving, setSaving] = useState(false);
  
  const addToast = useStore((s) => s.addToast);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/admin/categories');
      setCategories(res.categories || []);
    } catch (e: any) {
      addToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (category: any = null) => {
    setEditingCategory(category);
    if (category) {
      setForm({ name: category.name, description: category.description || '', imageUrl: category.imageUrl || '' });
    } else {
      setForm({ name: '', description: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm({ name: '', description: '', imageUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await apiRequest(`/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
        addToast('success', 'Category updated successfully');
      } else {
        await apiRequest('/admin/categories', {
          method: 'POST',
          body: JSON.stringify(form)
        });
        addToast('success', 'Category created successfully');
      }
      handleCloseModal();
      loadCategories();
    } catch (err: any) {
      addToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiRequest(`/admin/categories/${id}`, { method: 'DELETE' });
      addToast('success', 'Category deleted');
      setCategories(categories.filter(c => c.id !== id));
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Categories" />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-serif text-2xl text-bj-charcoal">Categories Management</h2>
        <button onClick={() => handleOpenModal()} className="btn-gold text-xs px-4 py-2 flex items-center gap-1">
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Products Count</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(category => (
              <tr key={category.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {category.imageUrl ? <img src={category.imageUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-gray-400 text-xs">No img</span>}
                  </div>
                  <div>
                    <span className="font-medium text-bj-charcoal block">{category.name}</span>
                    {category.description && <span className="text-xs text-gray-400 truncate max-w-[200px] block">{category.description}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                <td className="px-6 py-4 text-gray-500">{category._count?.products || 0}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => handleOpenModal(category)} className="text-gray-400 hover:text-bj-gold" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-serif text-bj-charcoal mb-6">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-luxury">Category Name *</label>
                <input required type="text" className="input-luxury w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label-luxury">Description</label>
                <textarea className="input-luxury w-full h-24" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="label-luxury">Image URL</label>
                <input type="url" className="input-luxury w-full" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm uppercase tracking-wider text-gray-500 hover:text-bj-charcoal">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold px-6 py-2">{saving ? 'Saving...' : 'Save Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
