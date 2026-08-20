import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ShieldCheck, RotateCcw, Truck, Gem } from 'lucide-react';
import { API_URL } from '../store/useStore';
import { RatesTicker } from '../components/RatesTicker';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  buttonText: string | null;
}

const trustPillars = [
  { icon: ShieldCheck, title: 'BIS Hallmarked', desc: 'Certified purity on every piece' },
  { icon: RotateCcw, title: 'Lifetime Buyback', desc: 'Full value guaranteed' },
  { icon: Truck, title: 'Insured Shipping', desc: 'Complimentary on all orders' },
  { icon: Gem, title: 'Custom Design', desc: 'Bespoke jewellery for you' },
];

export const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productsRes, bannersRes, catsRes] = await Promise.all([
          fetch(`${API_URL}/products?featured=true`),
          fetch(`${API_URL}/banners`),
          fetch(`${API_URL}/categories`),
        ]);

        if (productsRes.ok) setProducts(await productsRes.json());
        if (bannersRes.ok) {
          const b = await bannersRes.json();
          setBanners(b.banners || []);
        }
        if (catsRes.ok) {
          const c = await catsRes.json();
          setCategories(c.categories || []);
        }
      } catch (error) {
        console.error('Home data error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const heroBanner = banners.length > 0 ? banners[0] : {
    title: 'Baikunthh',
    subtitle: 'Timeless Jewellery. Extraordinary Moments.',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=85',
    linkUrl: '/shop',
    buttonText: 'Explore Collections'
  };

  const secondaryBanners = banners.slice(1, 3);

  return (
    <div className="bg-bj-ivory min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[92vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroBanner.imageUrl}
            className="w-full h-full object-cover scale-[1.04]"
            alt={heroBanner.title || 'Baikunthh Jewellers'}
            style={{ transform: 'scale(1.04)' }}
          />
        </div>
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Hero Content */}
        <div className="relative text-center text-white px-6 z-10 max-w-5xl mx-auto flex flex-col items-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-16 h-px bg-bj-gold/60" />
            <p className="uppercase tracking-[0.5em] text-[9px] text-bj-champagne font-medium">
              Fine Jewellery · Est. Heritage
            </p>
            <div className="w-16 h-px bg-bj-gold/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl mb-6 leading-[0.9] tracking-tight drop-shadow-sm"
          >
            {heroBanner.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="tracking-[0.3em] md:tracking-[0.45em] uppercase text-[10px] md:text-xs font-light text-bj-champagne/85 max-w-lg mx-auto"
          >
            {heroBanner.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-12"
          >
            <Link
              to={heroBanner.linkUrl || '/shop'}
              className="px-12 py-4 bg-bj-gold hover:bg-bj-gold-dark text-white transition-all duration-300 uppercase tracking-[0.3em] text-[10px] font-bold shadow-luxury hover:shadow-xl hover:-translate-y-0.5"
            >
              {heroBanner.buttonText || 'Explore Collections'}
            </Link>
            <Link
              to="/appointments"
              className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/25 transition-all duration-300 uppercase tracking-[0.25em] text-[10px] font-medium"
            >
              Book Appointment
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-[8px] uppercase tracking-[0.4em]">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* ===== LIVE RATES TICKER ===== */}
      <RatesTicker />

      {/* ===== TRUST PILLARS ===== */}
      <section className="bg-bj-charcoal py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustPillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full border border-bj-gold/30 flex items-center justify-center">
                  <Icon size={17} className="text-bj-gold" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">{title}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-eyebrow">Shop by Category</p>
            <h2 className="section-title">Discover Our Craft</h2>
            <div className="gold-rule" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {categories.slice(0, 5).map((cat, index) => (
              <Link
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                key={cat.id}
                className="group relative aspect-[3/4] overflow-hidden bg-bj-cream"
              >
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    alt={cat.name}
                    style={{ transitionDuration: '800ms' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-bj-cream to-bj-gold-pale flex items-center justify-center">
                    <span className="font-serif text-3xl text-bj-gold/30">BJ</span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-center transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-serif text-xl leading-tight">{cat.name}</h3>
                  <p className="text-bj-gold text-[9px] uppercase tracking-[0.3em] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== SECONDARY BANNERS ===== */}
      {secondaryBanners.length > 0 && (
        <section className="py-8 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {secondaryBanners.map((banner) => (
                <Link
                  to={banner.linkUrl || '/shop'}
                  key={banner.id}
                  className="group relative overflow-hidden"
                  style={{ minHeight: '480px' }}
                >
                  <img
                    src={banner.imageUrl}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    alt={banner.title || ''}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent group-hover:from-black/75 transition-all duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
                    {banner.subtitle && (
                      <p className="text-[9px] uppercase tracking-[0.35em] mb-3 text-bj-champagne/80">{banner.subtitle}</p>
                    )}
                    <h3 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">{banner.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.3em] border-b border-white/40 pb-1 self-start group-hover:border-bj-gold group-hover:text-bj-gold transition-all duration-300">
                      {banner.buttonText || 'Discover'} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED JEWELLERY ===== */}
      <section className="py-24 bg-bj-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="section-eyebrow">The Masterpieces</p>
              <h2 className="section-title">Signature Pieces</h2>
              <div className="gold-rule-left" />
            </div>
            <Link
              to="/shop"
              className="text-[10px] uppercase tracking-[0.3em] text-bj-charcoal hover:text-bj-gold border-b border-bj-charcoal hover:border-bj-gold transition-all pb-1 self-start md:self-end font-medium"
            >
              View All Pieces →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {[1, 2, 3, 4].map(n => (
                <div key={n}>
                  <div className="aspect-[4/5] skeleton rounded-none mb-5" />
                  <div className="skeleton h-3 w-24 mx-auto mb-2 rounded" />
                  <div className="skeleton h-5 w-40 mx-auto mb-2 rounded" />
                  <div className="skeleton h-4 w-20 mx-auto rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-10 gap-y-12">
              {products.slice(0, 4).map((product, i) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group block"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-bj-cream mb-5">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                        style={{ transitionDuration: '800ms' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bj-cream to-bj-gold-pale">
                        <span className="font-serif text-4xl text-bj-gold/25">BJ</span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-all duration-500" />
                    {product.tags && product.tags.length > 0 && (
                      <span className="absolute top-4 left-4 badge-gold shadow-sm">{product.tags[0]}</span>
                    )}
                    {/* Quick add button */}
                    <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-bj-charcoal/90 backdrop-blur-sm text-white text-[9px] uppercase tracking-[0.25em] py-3 text-center font-medium hover:bg-bj-gold transition-colors">
                        View Details
                      </div>
                    </div>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-bj-stone mb-1.5">
                      {product.category?.name || product.metalType || 'Fine Jewellery'}
                      {product.purity && ` · ${product.purity}`}
                    </p>
                    <h3 className="font-serif text-xl leading-snug group-hover:text-bj-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="mt-2.5 text-sm font-medium text-bj-charcoal">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="py-28 bg-luxury-gradient text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-bj-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-bj-gold/20 to-transparent" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full border border-bj-gold/8 blur-xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full border border-bj-gold/8 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-bj-gold/5 blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-5 mb-8">
            <div className="w-20 h-px bg-bj-gold/40" />
            <p className="uppercase tracking-[0.4em] text-[9px] text-bj-gold font-medium">The House of Baikunthh</p>
            <div className="w-20 h-px bg-bj-gold/40" />
          </div>

          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8 text-balance">
            Jewellery that becomes<br className="hidden md:block" /> part of your legacy.
          </h2>

          <p className="text-sm leading-8 text-gray-400 max-w-2xl mx-auto mb-12">
            From timeless classics to distinctive statement pieces, every Baikunthh creation is crafted by master artisans to celebrate life's most extraordinary moments. Our commitment to purity, transparency, and exquisite design has made us a trusted name for generations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="btn-gold shadow-luxury">
              Explore Collections
            </Link>
            <Link to="/appointments" className="btn-outline-white">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};