import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { API_URL } from '../store/useStore';
import { RatesTicker } from '../components/RatesTicker';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { Reveal } from '../components/Reveal';

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  buttonText: string | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// The three guarantees the store has confirmed in writing (see PRODUCT.md).
const promises = [
  { title: 'Authorized Hallmark Centre', body: 'Hallmarking is done by an authorised centre.' },
  { title: 'Lifetime Buyback Guarantee', body: 'We buy back jewellery bought from us, for life.' },
  { title: 'Insured bridal shipping', body: 'Bridal collections ship fully insured, at no charge.' },
];

const FALLBACK_STORY =
  'Baikunthh Jewellers crafts timeless jewellery for extraordinary moments. Every piece is handcrafted with the finest metals and stones, carrying the legacy of Indian jewellery tradition.';

export const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [story, setStory] = useState(FALLBACK_STORY);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, bannersRes, catsRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/products?featured=true`),
          fetch(`${API_URL}/banners`),
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/settings`),
        ]);
        if (productsRes.ok) setProducts(await productsRes.json());
        if (bannersRes.ok) setBanners((await bannersRes.json()).banners || []);
        if (catsRes.ok) setCategories((await catsRes.json()).categories || []);
        if (settingsRes.ok) {
          const s = (await settingsRes.json()).settings;
          if (s?.aboutUs) setStory(s.aboutUs);
        }
      } catch (error) {
        console.error('Home data error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hero: Banner = banners[0] ?? {
    id: 'fallback',
    title: 'Timeless Jewellery.',
    subtitle: 'Extraordinary Moments',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=85',
    linkUrl: '/shop',
    buttonText: 'Shop the Collection',
  };
  const collections = banners.slice(1, 3);
  const cats = categories.slice(0, 5);
  const bento = cats.length === 5;
  const pricedPiece = products.find((p) => p.priceType === 'RATE_BASED' && p.netWeight);
  const storyImage = cats.find((c) => c.name === 'Necklaces')?.imageUrl || banners[2]?.imageUrl;

  // Hero text rises line by line while the image opens
  const rise = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.25 + i * 0.12, ease: EASE },
  });

  return (
    <div>
      {/* ===== HERO: asymmetric split; the image opens like a jewellery box ===== */}
      <section className="pt-[var(--header-h)]">
        <div className="page-container grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8 md:py-12 lg:min-h-[calc(100dvh-var(--header-h))]">
          <div className="lg:col-span-5">
            <motion.h1
              {...rise(0)}
              className="font-serif font-light text-5xl md:text-6xl xl:text-7xl leading-[1.05] tracking-[-0.02em] text-bj-charcoal text-balance"
            >
              {hero.title}
            </motion.h1>
            {hero.subtitle && (
              <motion.p {...rise(1)} className="mt-6 text-lg text-gray-600 leading-relaxed max-w-md">
                {hero.subtitle}.
              </motion.p>
            )}
            <motion.div {...rise(2)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link to={hero.linkUrl || '/shop'} className="btn-gold active:scale-[0.98]">
                {hero.buttonText || 'Shop the Collection'}
              </Link>
              <Link
                to="/appointments"
                className="group inline-flex items-center gap-2 text-sm text-bj-charcoal border-b border-bj-charcoal pb-1 hover:text-bj-gold-deep hover:border-bj-gold-deep transition-colors"
              >
                Book an Appointment
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-7 relative overflow-hidden bg-bj-cream aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[calc(100dvh-var(--header-h)-5rem)] lg:max-h-[860px]"
            initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <motion.img
              src={hero.imageUrl}
              alt={hero.title || 'Baikunthh Jewellers'}
              className="absolute inset-0 w-full h-full object-cover"
              initial={reduce ? false : { scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE }}
            />
          </motion.div>
        </div>
      </section>

      <RatesTicker />

      {/* ===== CATEGORIES: five-cell bento on desktop, swipe row on phones ===== */}
      {cats.length > 0 && (
        <section className="py-20 md:py-32 page-container">
          <Reveal>
            <h2 className="section-title mb-10 md:mb-14">Discover Our Craft</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className={`flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:overflow-visible md:grid md:gap-4 ${
                bento ? 'md:grid-cols-4 md:grid-rows-2 md:h-[620px] lg:h-[720px]' : ''
              }`}
              style={bento ? undefined : { gridTemplateColumns: `repeat(${cats.length}, minmax(0, 1fr))` }}
            >
              {cats.map((cat, i) => (
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  key={cat.id}
                  className={`group relative overflow-hidden bg-bj-cream shrink-0 w-[70%] sm:w-[42%] aspect-[3/4] md:w-auto snap-start ${
                    bento ? 'md:aspect-auto' : ''
                  } ${bento && i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bj-charcoal/70 via-bj-charcoal/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-white">
                    <h3 className={`font-serif leading-tight ${bento && i === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                      {cat.name}
                    </h3>
                    {cat.description && <p className="mt-1 text-sm text-white/85 max-w-xs">{cat.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ===== COLLECTIONS: editorial pair, offset, captions below the image ===== */}
      {collections.length > 0 && (
        <section className="page-container pb-20 md:pb-32">
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-14">
            {collections.map((banner, i) => (
              <Reveal key={banner.id} delay={i * 0.12} className={i === 1 ? 'md:mt-24' : ''}>
                <Link to={banner.linkUrl || '/shop'} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bj-cream">
                    <img
                      src={banner.imageUrl}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-6">
                    <div>
                      <h3 className="font-serif text-3xl md:text-4xl text-bj-charcoal leading-tight">{banner.title}</h3>
                      {banner.subtitle && <p className="mt-2 text-gray-600">{banner.subtitle}.</p>}
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-2 text-sm text-bj-charcoal border-b border-bj-charcoal pb-1 transition-colors group-hover:text-bj-gold-deep group-hover:border-bj-gold-deep">
                      {banner.buttonText || 'Shop Now'}
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===== SIGNATURE PIECES ===== */}
      <section className="bg-white py-20 md:py-32">
        <div className="page-container">
          <Reveal className="flex items-end justify-between gap-6 mb-10 md:mb-14">
            <h2 className="section-title">Signature Pieces</h2>
            <Link
              to="/shop"
              className="shrink-0 inline-flex items-center gap-2 text-sm text-bj-charcoal border-b border-bj-charcoal pb-1 hover:text-bj-gold-deep hover:border-bj-gold-deep transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
            {loading
              ? [1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)
              : products.slice(0, 4).map((product, i) => (
                  <Reveal key={product.id} delay={i * 0.08}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* ===== HONEST PRICING: a real breakdown from a real piece ===== */}
      {pricedPiece && (
        <section className="page-container py-20 md:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <Reveal className="lg:col-span-5">
              <h2 className="section-title text-balance">Priced by weight, shown in full.</h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-md">
                Gold and silver pieces are priced from today's rate for their purity and net weight, plus making charges. GST is included.
              </p>
              <Link
                to={`/product/${pricedPiece.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-sm text-bj-charcoal border-b border-bj-charcoal pb-1 hover:text-bj-gold-deep hover:border-bj-gold-deep transition-colors"
              >
                See this piece <ArrowRight size={14} />
              </Link>
            </Reveal>
            <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
              <div className="grid sm:grid-cols-[180px_1fr] gap-6 items-start bg-white border border-gray-100 p-5 md:p-6">
                <Link to={`/product/${pricedPiece.slug}`} className="block aspect-square sm:aspect-[3/4] overflow-hidden bg-bj-cream">
                  {pricedPiece.images?.[0]?.url && (
                    <img src={pricedPiece.images[0].url} alt={pricedPiece.name} loading="lazy" className="w-full h-full object-cover" />
                  )}
                </Link>
                <div>
                  <p className="text-xs text-gray-500">
                    {pricedPiece.metalType === 'GOLD' ? 'Gold' : pricedPiece.metalType === 'SILVER' ? 'Silver' : 'Platinum'} {pricedPiece.purity}
                  </p>
                  <h3 className="font-serif text-2xl text-bj-charcoal leading-tight mt-1 mb-4">{pricedPiece.name}</h3>
                  <PriceBreakdown
                    priceType={pricedPiece.priceType}
                    totalPrice={pricedPiece.price}
                    fixedPrice={pricedPiece.fixedPrice}
                    metalType={pricedPiece.metalType}
                    purity={pricedPiece.purity}
                    netWeight={pricedPiece.netWeight}
                    makingCharge={pricedPiece.makingCharge}
                    stoneCharge={pricedPiece.stoneCharge}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== THE HOUSE: story, confirmed guarantees, the appointment ===== */}
      <section className="bg-white py-20 md:py-32">
        <div className="page-container grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {storyImage && (
            <Reveal className="lg:col-span-5 order-last lg:order-first">
              <div className="aspect-[4/5] overflow-hidden bg-bj-cream">
                <img src={storyImage} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          )}
          <Reveal delay={0.1} className={storyImage ? 'lg:col-span-6 lg:col-start-7' : 'lg:col-span-8'}>
            <h2 className="section-title text-balance">Jewellery that becomes part of your legacy.</h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">{story}</p>

            <dl className="mt-12 grid sm:grid-cols-3 gap-8 border-t border-gray-200 pt-8">
              {promises.map((p) => (
                <div key={p.title}>
                  <dt className="font-serif text-xl text-bj-charcoal leading-snug">{p.title}</dt>
                  <dd className="mt-2 text-sm text-gray-600 leading-relaxed">{p.body}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/appointments" className="btn-gold">
                Book an Appointment
              </Link>
              <p className="text-sm text-gray-600">Bridal, custom design and shopping consultations.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
