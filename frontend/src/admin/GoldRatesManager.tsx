import { useEffect, useState } from 'react';
import axios from 'axios';

export const GoldRatesManager = () => {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/rates'
      );
      setRates(response.data);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleUpdate = async (id: string, newRate: number) => {
    if (!newRate || newRate <= 0) {
      alert('Please enter a valid rate.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/rates/${id}`,
        { rate: newRate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Shop rates updated successfully.');
      fetchRates();
    } catch (error) {
      console.error(error);
      alert('Failed to update rate.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-bj-gold/20">
        Loading rates...
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-bj-gold/20 shadow-sm">
      <h3 className="font-serif text-xl mb-6">
        Update Daily Shop Rates
      </h3>

      <div className="space-y-6">
        {rates.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div>
              <p className="font-bold text-bj-charcoal">
                {r.purity} {r.metal}
              </p>

              <p className="text-xs text-gray-400">
                Current: ₹{Number(r.rate).toLocaleString('en-IN')}/g
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                id={`rate-${r.id}`}
                className="border p-2 w-32 outline-none focus:border-bj-gold"
                placeholder="New Rate"
              />

              <button
                onClick={() => {
                  const input = document.getElementById(
                    `rate-${r.id}`
                  ) as HTMLInputElement;

                  handleUpdate(r.id, Number(input.value));
                }}
                className="bg-bj-gold text-white px-4 py-2 text-sm uppercase"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};