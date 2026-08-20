import { useEffect, useState } from 'react';
import axios from 'axios';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number | string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  items: OrderItem[];
}

export const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:5000/api/admin/orders',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      setError('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchOrders();
    } catch (err) {
      console.error(
        'Failed to update order status:',
        err
      );

      alert('Failed to update order status.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 border border-bj-gold/10">
        <p className="font-serif text-xl">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 border border-red-100">
        <p className="text-red-600 mb-4">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchOrders}
          className="bg-bj-charcoal text-white px-5 py-2 text-xs uppercase tracking-widest"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-10 border border-bj-gold/10 text-center">
        <p className="font-serif text-2xl text-bj-charcoal">
          No Orders Yet
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Customer orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-bj-gold/10 shadow-sm"
        >
          {/* Order Header */}
          <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-bj-gold font-bold">
                Order
              </p>

              <h3 className="font-serif text-xl text-bj-charcoal">
                {order.orderNumber}
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(
                  order.createdAt
                ).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-[9px] uppercase tracking-widest text-gray-400">
                Total
              </p>

              <p className="font-serif text-xl text-bj-charcoal">
                ₹
                {Number(
                  order.totalAmount
                ).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Customer */}
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2">
              Customer
            </p>

            <p className="font-medium text-bj-charcoal">
              {order.user.name}
            </p>

            <p className="text-sm text-gray-500">
              {order.user.email}
            </p>

            {order.user.phone && (
              <p className="text-sm text-gray-500">
                {order.user.phone}
              </p>
            )}
          </div>

          {/* Products */}
          <div className="p-6">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-4">
              Products
            </p>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-100 pb-3"
                >
                  <div>
                    <p className="text-sm font-medium text-bj-charcoal">
                      {item.product.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm">
                    ₹
                    {Number(
                      item.price
                    ).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2">
                Payment
              </p>

              <span className="text-xs uppercase tracking-wider text-gray-600">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[9px] uppercase tracking-widest text-gray-400">
                Order Status
              </label>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order.id,
                    e.target.value
                  )
                }
                className="border border-gray-200 px-4 py-2 text-xs outline-none focus:border-bj-gold bg-white"
              >
                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="PROCESSING">
                  Processing
                </option>

                <option value="SHIPPED">
                  Shipped
                </option>

                <option value="DELIVERED">
                  Delivered
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};