import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, User, Heart, Search, Menu, X, ChevronDown,
  Instagram, Phone, LogOut, Package, Settings, ArrowLeft
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { API_URL } from '../store/useStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((s) => s.user);
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const logout = useStore((s) => s.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopOpen, setShopOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const wishCount = wishlist.length;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[60]">
      {/* Announcement Bar */}
      <div className="bg-bj-charcoal text-bj-champagne h-8 px-4 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium whitespace-nowrap overflow-hidden">
        <span className="hidden sm:inline">Complimentary Insured Shipping on all Bridal Collections ✦ Lifetime Buyback Guarantee</span>
        <span className="sm:hidden truncate">Free Bridal Shipping ✦ Lifetime Buyback</span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-500 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Left — Social + Shop megamenu trigger */}
          <div className="flex items-center gap-5">
            {!isHome && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`flex items-center justify-center p-1.5 -ml-2 rounded-full transition-colors text-bj-charcoal hover:bg-bj-ivory hover:text-bj-gold`}
                title="Go Back" aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            
            <a
              href="https://instagram.com/devanshabhushan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Baikunthh on Instagram"
              className={`hidden md:flex items-center gap-1.5 transition-colors text-bj-stone hover:text-bj-gold`}
            >
              <Instagram size={16} />
            </a>

            {/* Shop dropdown */}
            <div className="hidden md:block relative">
              <button
                type="button"
                onClick={() => setShopOpen(!shopOpen)}
                aria-expanded={shopOpen}
                className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors text-bj-charcoal hover:text-bj-gold`}
              >
                Collections <ChevronDown size={12} className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white shadow-card border border-gray-100 py-2 z-50">
                  <Link to="/shop" className="block px-5 py-2.5 text-xs uppercase tracking-widest hover:text-bj-gold hover:bg-bj-ivory transition-colors">
                    All Jewellery
                  </Link>
                  <div className="border-t border-gray-100 my-1.5" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="block px-5 py-2.5 text-xs uppercase tracking-widest hover:text-bj-gold hover:bg-bj-ivory transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1.5" />
                  <Link to="/collections" className="block px-5 py-2.5 text-xs uppercase tracking-widest text-bj-gold hover:bg-bj-ivory transition-colors">
                    View All Collections →
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/appointments"
              className={`hidden md:block text-[10px] uppercase tracking-[0.2em] font-medium transition-colors text-bj-charcoal hover:text-bj-gold`}
            >
              Appointments
            </Link>
          </div>

          {/* Center — Logo */}
          <Link
            to="/"
            className={`font-display text-xl sm:text-2xl tracking-[0.1em] font-bold transition-colors text-bj-charcoal`}
          >
            BAIKUNTHH
          </Link>

          {/* Right — Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-1.5 transition-colors text-bj-charcoal hover:text-bj-gold`}
              title="Search" aria-label="Search" aria-expanded={searchOpen}
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-1.5 transition-colors text-bj-charcoal hover:text-bj-gold`}
              title="Wishlist" aria-label={`Wishlist (${wishCount})`}
            >
              <Heart size={18} />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bj-gold-deep text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {wishCount > 9 ? '9+' : wishCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              to={user ? '/account' : '/login'}
              className={`hidden sm:flex p-1.5 transition-colors text-bj-charcoal hover:text-bj-gold`}
              title={user ? user.name : 'Sign In'} aria-label={user ? 'My account' : 'Sign in'}
            >
              <User size={18} />
            </Link>

            {/* Admin shortcut */}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`hidden sm:flex p-1.5 transition-colors text-bj-charcoal hover:text-bj-gold`}
                title="Admin Panel" aria-label="Admin panel"
              >
                <Settings size={16} />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative p-1.5 transition-colors text-bj-charcoal hover:text-bj-gold`}
              title="Shopping Bag" aria-label={`Shopping bag (${cartCount})`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bj-gold-deep text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className={`md:hidden p-1.5 transition-colors text-bj-charcoal hover:text-bj-gold`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="bg-white border-t border-gray-100 px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rings, necklaces, gold, silver..."
                aria-label="Search jewellery"
                className="flex-1 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-bj-gold"
              />
              <button type="submit" className="btn-gold px-6 py-2.5 text-xs">Search</button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-6 py-6 space-y-4">
              <Link to="/shop" className="block text-sm uppercase tracking-widest text-bj-charcoal hover:text-bj-gold py-2 border-b border-gray-100">
                All Jewellery
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="block text-sm uppercase tracking-widest text-bj-stone hover:text-bj-gold py-2 border-b border-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
              <Link to="/collections" className="block text-sm uppercase tracking-widest text-bj-charcoal hover:text-bj-gold py-2 border-b border-gray-100">
                Collections
              </Link>
              <Link to="/articles" className="block text-sm uppercase tracking-widest text-bj-charcoal hover:text-bj-gold py-2 border-b border-gray-100">
                Journal
              </Link>
              <Link to="/appointments" className="block text-sm uppercase tracking-widest text-bj-charcoal hover:text-bj-gold py-2 border-b border-gray-100">
                Book Appointment
              </Link>

              <div className="pt-2 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/account" className="flex items-center gap-2 text-sm text-bj-charcoal hover:text-bj-gold">
                      <User size={16} /> {user.name}
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="flex items-center gap-2 text-sm text-bj-gold">
                        <Settings size={16} /> Admin Panel
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm text-red-600"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="btn-gold text-center py-3 text-xs">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      </header>

      {/* Mobile overlay */}
      {(mobileOpen || shopOpen) && (
        <div
          className="fixed inset-0 z-[55] nav-overlay md:hidden"
          onClick={() => { setMobileOpen(false); setShopOpen(false); }}
        />
      )}
    </>
  );
};