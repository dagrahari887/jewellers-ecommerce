import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, X, LayoutGrid, List } from 'lucide-react';
import { API_URL } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  const currentCategory = searchParams.get('category');
  const currentCollection = searchParams.get('collection');
  const currentSearch = searchParams.get('search');
  const currentPurity = searchParams.get('purity');
  const currentMetal = searchParams.get('metal');

  useEffect(() => {
    fetch(`${API_URL}/categories`).then(r => r.json()).then(d => setCategories(d.categories || []));
    fetch(`${API_URL}/collections`).then(r => r.json()).then(d => setCollections(d.collections || []));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.append('category', currentCategory);
        if (currentCollection) params.append('collection', currentCollection);
        if (currentSearch) params.append('search', currentSearch);
        if (currentPurity) params.append('purity', currentPurity);
        if (currentMetal) params.append('metal', currentMetal);

        const res = await fetch(`${API_URL}/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        let data = await res.json();

        if (sortOption === 'price-low') data.sort((a: any, b: any) => a.price - b.price);
        else if (sortOption === 'price-high') data.sort((a: any, b: any) => b.price - a.price);
        else data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setProducts(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, sortOption]);

  const handleFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key === 'category') newParams.delete('collection');
    if (key === 'collection') newParams.delete('category');
    setSearchParams(newParams);
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());
  const hasActiveFilters = currentCategory || currentCollection || currentSearch || currentPurity || currentMetal;

  const sortLabels: Record<string, string> = {
    newest: 'Newest',
    'price-low': 'Price: Low → High',
    'price-high': 'Price: High → Low',
  };

  let pageTitle = 'All Jewellery';
  let pageDesc = 'Explore our complete collection of fine jewellery, crafted for extraordinary moments.';
  if (currentSearch) {
    pageTitle = `"${currentSearch}"`;
    pageDesc = `Showing results for "${currentSearch}"`;
  } else if (currentCategory) {
    pageTitle = currentCategory;
    const cat = categories.find(c => c.name === currentCategory);
    if (cat?.description) pageDesc = cat.description;
  } else if (currentCollection) {
    pageTitle = currentCollection;
    const col = collections.find(c => c.name === currentCollection);
    if (col?.description) pageDesc = col.description;
  }

  // Active filter chips
  const activeFilters = [
    currentCategory && { key: 'category', label: `Category: ${currentCategory}` },
    currentCollection && { key: 'collection', label: `Collection: ${currentCollection}` },
    currentMetal && { key: 'metal', label: `Metal: ${currentMetal}` },
    currentPurity && { key: 'purity', label: `Purity: ${currentPurity}` },
    currentSearch && { key: 'search', label: `Search: ${currentSearch}` },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="page-shell">
      <div className="page-container">

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="page-title mb-2">{pageTitle}</h1>
          <p className="text-gray-500 max-w-xl text-sm leading-relaxed">{pageDesc}</p>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(f => (
              <button
                key={f.key}
                onClick={() => handleFilter(f.key, null)}
                className="filter-chip"
              >
                {f.label} <X size={10} />
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors underline underline-offset-4 ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Tools bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200 mb-8 sticky top-[var(--header-h)] bg-bj-ivory z-40">
          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-bj-charcoal"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={15} />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-bj-gold" />}
          </button>

          <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
            <SlidersHorizontal size={13} />
            <span>{loading ? 'Loading' : `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}`}</span>
          </div>

          <div className="flex items-center gap-5">
            {/* View toggle */}
            <div className="hidden sm:flex items-center gap-2 border-r border-gray-200 pr-5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'text-bj-gold' : 'text-gray-500 hover:text-bj-charcoal'}`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'text-bj-gold' : 'text-gray-500 hover:text-bj-charcoal'}`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>

            {/* Sort — click-based */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium text-bj-charcoal hover:text-bj-gold transition-colors"
              >
                <span>Sort: {sortLabels[sortOption]}</span>
                <ChevronDown size={13} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 shadow-card z-50">
                    {Object.entries(sortLabels).map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => { setSortOption(val); setSortOpen(false); }}
                        className={`block w-full text-left px-5 py-3 text-xs uppercase tracking-widest transition-colors ${sortOption === val ? 'text-bj-gold bg-bj-gold/5' : 'text-gray-600 hover:bg-bj-ivory hover:text-bj-gold'}`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* ===== SIDEBAR FILTERS ===== */}
          <div className={`
            fixed md:static inset-0 bg-white md:bg-transparent z-50 md:z-auto w-full md:w-56 shrink-0
            transition-transform duration-300 overflow-y-auto md:overflow-visible
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <div className="p-6 md:p-0 h-full flex flex-col">
              {/* Mobile header */}
              <div className="flex justify-between items-center md:hidden mb-8">
                <h2 className="font-serif text-2xl text-bj-charcoal">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-500 hover:text-bj-charcoal">
                  <X size={22} />
                </button>
              </div>

              <div className="space-y-8 flex-1">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] uppercase tracking-widest text-bj-gold hover:text-bj-gold-dark font-medium underline underline-offset-4"
                  >
                    Clear All Filters
                  </button>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500 mb-4 pb-2 border-b border-gray-100">
                      Categories
                    </h3>
                    <ul className="space-y-2.5">
                      <li>
                        <button
                          onClick={() => handleFilter('category', null)}
                          className={`text-sm transition-colors ${!currentCategory && !currentCollection ? 'text-bj-gold font-medium' : 'text-gray-600 hover:text-bj-gold'}`}
                        >
                          All Jewellery
                        </button>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat.id}>
                          <button
                            onClick={() => handleFilter('category', cat.name)}
                            className={`text-sm transition-colors text-left flex items-center justify-between w-full ${currentCategory === cat.name ? 'text-bj-gold font-medium' : 'text-gray-600 hover:text-bj-gold'}`}
                          >
                            <span>{cat.name}</span>
                            <span className="text-gray-500 text-[10px]">{cat._count?.products || 0}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Collections */}
                {collections.length > 0 && (
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500 mb-4 pb-2 border-b border-gray-100">
                      Collections
                    </h3>
                    <ul className="space-y-2.5">
                      {collections.map((col) => (
                        <li key={col.id}>
                          <button
                            onClick={() => handleFilter('collection', col.name)}
                            className={`text-sm transition-colors text-left flex items-center justify-between w-full ${currentCollection === col.name ? 'text-bj-gold font-medium' : 'text-gray-600 hover:text-bj-gold'}`}
                          >
                            <span>{col.name}</span>
                            <span className="text-gray-500 text-[10px]">{col._count?.products || 0}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metal Type */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500 mb-4 pb-2 border-b border-gray-100">
                    Metal
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['GOLD', 'SILVER', 'PLATINUM'].map(m => (
                      <button
                        key={m}
                        onClick={() => handleFilter('metal', currentMetal === m ? null : m)}
                        className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all ${currentMetal === m ? 'border-bj-gold-deep bg-bj-gold-deep text-white' : 'border-gray-200 text-gray-600 hover:border-bj-gold hover:text-bj-gold'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purity */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500 mb-4 pb-2 border-b border-gray-100">
                    Purity
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['24K', '22K', '18K', '925'].map(p => (
                      <button
                        key={p}
                        onClick={() => handleFilter('purity', currentPurity === p ? null : p)}
                        className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all ${currentPurity === p ? 'border-bj-gold-deep bg-bj-gold-deep text-white' : 'border-gray-200 text-gray-600 hover:border-bj-gold hover:text-bj-gold'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile apply button */}
              <div className="md:hidden mt-8">
                <button onClick={() => setIsFilterOpen(false)} className="btn-gold w-full py-4">
                  View {products.length} Products
                </button>
              </div>
            </div>
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10' : 'flex flex-col gap-4'}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SkeletonCard key={n} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products Found"
                description="We couldn't find any products matching your current filters. Try adjusting or clearing them."
                actionText="Clear All Filters"
                actionOnClick={clearFilters}
              />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10' : 'flex flex-col gap-4'}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} view={viewMode} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile filter overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-[45] nav-overlay md:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
};