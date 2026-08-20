import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category?: {
    name: string;
  } | null;
}

export const InventoryManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        'http://localhost:5000/api/products'
      );

      setProducts(response.data.value || response.data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setError('Unable to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = async (
    productId: string,
    stock: number
  ) => {
    if (!Number.isInteger(stock) || stock < 0) {
      alert('Stock must be a non-negative whole number.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:5000/api/admin/products/${productId}/stock`,
        { stock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProducts();
      alert('Stock updated successfully.');
    } catch (err) {
      console.error('Stock update failed:', err);
      alert('Failed to update stock.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 border border-bj-gold/10">
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 border border-red-100">
        <p className="text-red-600 mb-4">{error}</p>

        <button
          type="button"
          onClick={fetchProducts}
          className="bg-bj-charcoal text-white px-5 py-2 text-xs uppercase tracking-widest"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-bj-gold/10 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-serif text-2xl text-bj-charcoal">
          Product Inventory
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Manage current stock levels for your jewellery.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="p-10 text-center">
          <p className="font-serif text-xl">
            No products found.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {products.map((product) => (
            <InventoryRow
              key={product.id}
              product={product}
              onUpdate={updateStock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface InventoryRowProps {
  product: Product;
  onUpdate: (
    productId: string,
    stock: number
  ) => void;
}

const InventoryRow = ({
  product,
  onUpdate,
}: InventoryRowProps) => {
  const [stock, setStock] = useState(product.stock);

  useEffect(() => {
    setStock(product.stock);
  }, [product.stock]);

  const getStockLabel = () => {
    if (product.stock === 0) {
      return 'Out of Stock';
    }

    if (product.stock <= 2) {
      return 'Low Stock';
    }

    return 'In Stock';
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div className="min-w-0">
          <p className="font-serif text-lg text-bj-charcoal">
            {product.name}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            SKU: {product.sku}
          </p>

          <p className="text-xs text-gray-400">
            {product.category?.name || 'Uncategorized'}
          </p>

          <p className="text-sm text-bj-charcoal mt-2">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          <div>
            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">
              Current Stock
            </p>

            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                product.stock === 0
                  ? 'text-red-500'
                  : product.stock <= 2
                  ? 'text-orange-500'
                  : 'text-green-600'
              }`}
            >
              {getStockLabel()} ({product.stock})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) =>
                setStock(Number(e.target.value))
              }
              className="w-24 border border-gray-200 px-3 py-2 text-sm outline-none focus:border-bj-gold"
            />

            <button
              type="button"
              onClick={() =>
                onUpdate(product.id, stock)
              }
              className="bg-bj-gold text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-bj-charcoal transition"
            >
              Update
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};