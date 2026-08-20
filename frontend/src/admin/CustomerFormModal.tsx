import React, { useEffect, useState } from 'react';
import { apiRequest } from '../store/useStore';

interface CustomerFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  addToast: (type: any, msg: string) => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ onClose, onSuccess, addToast }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use auth/register since it creates a customer account
      await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create customer');
      });
      addToast('success', 'Customer created successfully');
      onSuccess();
    } catch (err: any) {
      addToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-bj-charcoal">Add Customer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-bj-charcoal">&times; Close</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-luxury">Full Name *</label>
            <input required type="text" className="input-luxury w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="label-luxury">Email *</label>
            <input required type="email" className="input-luxury w-full" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="label-luxury">Password *</label>
            <input required type="password" minLength={6} className="input-luxury w-full" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="label-luxury">Phone (Optional)</label>
            <input type="text" className="input-luxury w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 text-sm tracking-wider uppercase">Cancel</button>
            <button type="submit" disabled={loading} className="btn-gold px-6 py-2">{loading ? 'Saving...' : 'Save Customer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
