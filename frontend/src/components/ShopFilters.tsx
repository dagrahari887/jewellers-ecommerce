interface Filters {
  minPrice: number;
  maxPrice: number;
}

interface ShopFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const ShopFilters = ({
  filters,
  setFilters,
}: ShopFiltersProps) => {
  return (
    <aside className="w-64 pr-8 hidden lg:block">
      <div className="sticky top-24 space-y-10">

        <div>
          <h4 className="font-serif text-lg mb-4 border-b border-gray-100 pb-2">
            Price Range
          </h4>

          <div className="space-y-2">
            {[
              {
                label: 'Under ₹20,000',
                min: 0,
                max: 20000,
              },
              {
                label: '₹20,000 - ₹50,000',
                min: 20000,
                max: 50000,
              },
              {
                label: '₹50,000 - ₹1,00,000',
                min: 50000,
                max: 100000,
              },
              {
                label: 'Above ₹1,00,000',
                min: 100000,
                max: 9999999,
              },
            ].map((range) => (
              <label
                key={range.label}
                className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer hover:text-bj-gold transition-colors"
              >
                <input
                  type="radio"
                  name="price"
                  onChange={() =>
                    setFilters({
                      ...filters,
                      minPrice: range.min,
                      maxPrice: range.max,
                    })
                  }
                  className="accent-bj-gold"
                />

                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 border-b border-gray-100 pb-2">
            Metal Purity
          </h4>

          {[
            '22K Gold',
            '18K Gold',
            '14K Gold',
            '925 Silver',
          ].map((purity) => (
            <label
              key={purity}
              className="flex items-center space-x-3 text-sm py-1"
            >
              <input
                type="checkbox"
                className="accent-bj-gold"
              />

              <span className="text-gray-600">
                {purity}
              </span>
            </label>
          ))}
        </div>

      </div>
    </aside>
  );
};