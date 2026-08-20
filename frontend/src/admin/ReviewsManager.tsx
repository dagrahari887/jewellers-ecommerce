import { useEffect, useState } from 'react';
import { apiRequest, useStore } from '../store/useStore';
import { Plus, Edit, Trash2 } from 'lucide-react';

import { StarRating } from '../components/StarRating';

export const ReviewsManager = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const addToast = useStore((s) => s.addToast);

  const fetchReviews = async () => {
    try {
      const res = await apiRequest('/admin/reviews');
      setReviews(res.reviews || []);
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (id: string) => {
    try {
      await apiRequest(`/admin/reviews/${id}/approve`, { method: 'PUT' });
      addToast('success', 'Review approval status updated');
      fetchReviews();
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await apiRequest(`/admin/reviews/${id}`, { method: 'DELETE' });
      addToast('success', 'Review deleted');
      fetchReviews();
    } catch (err: any) {
      addToast('error', err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-serif text-2xl text-bj-charcoal">Reviews Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Review</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map(review => (
              <tr key={review.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-bj-charcoal font-medium truncate max-w-[150px]">{review.product?.name}</td>
                <td className="px-6 py-4 text-gray-500 truncate max-w-[150px]">{review.user?.name}</td>
                <td className="px-6 py-4 font-medium"><StarRating rating={review.rating} size={14} /></td>
                <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{review.comment || review.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${review.isApproved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3 justify-center">
                  <button onClick={() => handleToggleApprove(review.id)} className="text-xs uppercase font-medium tracking-widest text-bj-gold hover:text-bj-gold-dark">
                    {review.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
