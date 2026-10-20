import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Heart, Share2, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { API_URL, useStore, apiRequest } from '../store/useStore';
import { ImageGallery } from '../components/ImageGallery';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { StarRating } from '../components/StarRating';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Ring sizes (Indian standard)
const RING_SIZES = ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
const BRACELET_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const BANGLE_SIZES = ['2/2', '2/4', '2/6', '2/8', '2/10', '2/12', '2/14'];

// Categories that require size selection
const RING_CATEGORIES = ['rings', 'ring'];
const BRACELET_CATEGORIES = ['bracelets', 'bracelet'];
const BANGLE_CATEGORIES = ['bangles', 'bangle'];

const getSizeType = (product: any): 'ring' | 'bracelet' | 'bangle' | null => {
  const cat = (product?.category?.name || '').toLowerCase();
  const name = (product?.name || '').toLowerCase();
  if (RING_CATEGORIES.some(r => cat.includes(r) || name.includes(r))) return 'ring';
  if (BRACELET_CATEGORIES.some(b => cat.includes(b) || name.includes(b))) return 'bracelet';
  if (BANGLE_CATEGORIES.some(b => cat.includes(b) || name.includes(b))) return 'bangle';
  return null;
};

const getSizeOptions = (type: 'ring' | 'bracelet' | 'bangle' | null) => {
  if (type === 'ring') return RING_SIZES;
  if (type === 'bracelet') return BRACELET_SIZES;
  if (type === 'bangle') return BANGLE_SIZES;
  return [];
};

export const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const user = useStore((s) => s.user);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isInWishlist = useStore((s) => s.isInWishlist);
  const addToast = useStore((s) => s.addToast);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        // Fetch related products
        if (data.category?.name) {
          const rel = await fetch(`${API_URL}/products?category=${encodeURIComponent(data.category.name)}`);
          if (rel.ok) {
            const relData = await rel.json();
            setRelatedProducts(relData.filter((p: any) => p.id !== data.id).slice(0, 4));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage message="Retrieving Details" />;
  if (!product) return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-6">
      <h2 className="font-serif text-3xl">Product Not Found</h2>
      <Link to="/shop" className="btn-gold">Return to Shop</Link>
    </div>
  );

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const sizeType = getSizeType(product);
  const sizeOptions = getSizeOptions(sizeType);
  const requiresSize = sizeOptions.length > 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (requiresSize && !selectedSize) {
      addToast('warning', 'Please select a size before adding to bag');
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url || '',
      purity: product.purity,
      metalType: product.metalType,
      size: selectedSize || undefined,
    });
    addToast('success', `${product.name} added to your bag${selectedSize ? ` (Size: ${selectedSize})` : ''}`);
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0]?.url || '',
      category: product.category?.name || '',
      purity: product.purity,
    });
    addToast(inWishlist ? 'info' : 'success', inWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: `Check out ${product.name} on Baikunthh Jewellers`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('success', 'Link copied to clipboard');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { addToast('info', 'Please sign in to write a review'); return; }
    setSubmittingReview(true);
    try {
      await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, rating: reviewForm.rating, title: reviewForm.title, comment: reviewForm.comment })
      });
      addToast('success', 'Review submitted! It will appear after approval.');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err: any) {
      addToast('error', err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="pt-[calc(var(--header-h)+1rem)] pb-28 md:pb-20">

      {/* Breadcrumbs */}
      <div className="page-container py-4">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
          <Link to="/" className="hover:text-bj-gold transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-bj-gold transition-colors">Jewellery</Link>
          {product.category && (
            <>
              <ChevronRight size={10} />
              <Link to={`/shop?category=${encodeURIComponent(product.category.name)}`} className="hover:text-bj-gold transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={10} />
          <span className="text-bj-charcoal truncate max-w-[160px] sm:max-w-none">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Grid */}
      <div className="page-container py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20">

          {/* Images */}
          <div className="md:sticky md:top-[calc(var(--header-h)+1.5rem)] self-start">
            <ImageGallery images={product.images || []} alt={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col">

            {/* Category + Tag */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.25em] text-bj-stone">
                {product.category?.name || product.metalType || 'Fine Jewellery'}
                {product.collection && ` · ${product.collection.name}`}
              </p>
              {product.tags?.[0] && <span className="badge-gold">{product.tags[0]}</span>}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-bj-charcoal mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Reviews Summary */}
            {product.reviews && product.reviews.length > 0 && (
              <button
                type="button"
                className="flex items-center gap-2 mb-5 group self-start"
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <StarRating rating={product.avgRating || 5} />
                <span className="text-xs text-gray-500 group-hover:text-bj-gold transition-colors underline underline-offset-2">
                  {product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </button>
            )}

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl md:text-[2.75rem] leading-none font-serif text-bj-charcoal">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Inclusive of GST</p>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600 mb-8 font-light leading-relaxed border-b border-gray-100 pb-8">
              <p>{product.description}</p>
            </div>

            {/* ===== SIZE SELECTOR ===== */}
            {requiresSize && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] uppercase tracking-[0.25em] text-bj-charcoal font-semibold">
                    {sizeType === 'ring' ? 'Ring Size' : sizeType === 'bangle' ? 'Bangle Size' : 'Size'}
                    {selectedSize && <span className="ml-2 text-bj-gold-deep">{selectedSize}</span>}
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    aria-expanded={showSizeGuide}
                    className="text-[9px] uppercase tracking-widest text-gray-500 hover:text-bj-gold underline underline-offset-2 transition-colors"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                  {sizeOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s === selectedSize ? '' : s)}
                      aria-pressed={selectedSize === s}
                      className={`size-option shrink-0 ${selectedSize === s ? 'selected' : ''}`}
                      style={{ minWidth: sizeType === 'bangle' ? '48px' : '40px' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {showSizeGuide && (
                  <div className="mt-4 p-4 bg-bj-gold-pale border border-bj-gold/20 text-xs text-gray-600 leading-relaxed">
                    {sizeType === 'ring' && (
                      <><strong className="text-bj-charcoal">Ring Size Guide:</strong> Measure the inner circumference of an existing ring in mm. Size 14 ≈ 54mm circumference. For assistance, visit our showroom or contact our concierge.</>
                    )}
                    {sizeType === 'bracelet' && (
                      <><strong className="text-bj-charcoal">Bracelet Size Guide:</strong> XS = 15cm, S = 16cm, M = 17cm, L = 18cm, XL = 19cm wrist circumference. Add 1-2cm for a comfortable fit.</>
                    )}
                    {sizeType === 'bangle' && (
                      <><strong className="text-bj-charcoal">Bangle Size Guide:</strong> Measure the widest part of your hand (knuckles) in inches. 2/2 = 2.2", 2/4 = 2.4", etc.</>
                    )}
                  </div>
                )}

                {requiresSize && !selectedSize && (
                  <p className="text-[10px] text-amber-600 mt-2">* Please select a size to add to bag</p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 btn-gold px-4 py-4 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bj-gold-deep disabled:hover:shadow-none disabled:hover:translate-y-0"
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-14 h-14 border-2 flex items-center justify-center transition-all ${inWishlist ? 'border-bj-gold bg-bj-gold/[0.08] text-bj-gold' : 'border-gray-200 text-gray-500 hover:border-bj-gold hover:text-bj-gold'}`}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={inWishlist}
                >
                  <Heart size={19} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-14 h-14 border-2 border-gray-200 text-gray-500 hover:border-bj-gold hover:text-bj-gold flex items-center justify-center transition-all"
                  title="Share"
                  aria-label="Share this piece"
                >
                  <Share2 size={19} />
                </button>
              </div>

              <Link to="/appointments" className="btn-outline w-full py-3.5 text-center">
                Book an Appointment
              </Link>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5 mb-8 pb-8 border-b border-gray-100">
              {product.sku && (
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">SKU</span>
                  <span className="text-sm font-medium text-bj-charcoal">{product.sku}</span>
                </div>
              )}
              {product.metalType && (
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">Metal</span>
                  <span className="text-sm font-medium text-bj-charcoal">{product.metalType} {product.purity}</span>
                </div>
              )}
              {product.grossWeight && (
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">Gross Weight</span>
                  <span className="text-sm font-medium text-bj-charcoal">{Number(product.grossWeight).toFixed(2)}g</span>
                </div>
              )}
              {product.netWeight && (
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">Net Weight</span>
                  <span className="text-sm font-medium text-bj-charcoal">{Number(product.netWeight).toFixed(2)}g</span>
                </div>
              )}
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">Availability</span>
                <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-emerald-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} left)`}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mb-8">
              <PriceBreakdown
                priceType={product.priceType}
                totalPrice={product.price}
                fixedPrice={product.fixedPrice}
                metalType={product.metalType}
                purity={product.purity}
                netWeight={product.netWeight}
                makingCharge={product.makingCharge}
                stoneCharge={product.stoneCharge}
              />
            </div>

            {/* Trust Badges */}
            <div className="grid sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100">
              {[
                { icon: ShieldCheck, text: 'Authorized Hallmark Centre' },
                { icon: RotateCcw, text: 'Lifetime Buyback Guarantee' },
                { icon: Truck, text: 'Insured bridal shipping' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                  <Icon size={16} className="text-bj-gold shrink-0" />
                  {text}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="page-container pt-20 md:pt-24 pb-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-serif text-3xl text-bj-charcoal">More from {product.category?.name}</h2>
            <div className="gold-rule" />
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-10">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/product/${p.slug}`} className="group block w-[calc(50%-0.5rem)] md:w-[calc(25%-1.125rem)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-bj-cream mb-4">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-gray-200">BJ</div>
                  )}
                </div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-bj-stone mb-1 text-center">{p.category?.name}</p>
                <h3 className="font-serif text-lg text-center group-hover:text-bj-gold transition-colors">{p.name}</h3>
                <p className="text-sm font-medium text-center mt-1.5">₹{Number(p.price).toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div id="reviews" className="page-container pt-20 md:pt-24 pb-8">
        <div className="max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="font-serif text-3xl text-bj-charcoal">Reviews</h2>
          {user ? (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-gold text-xs px-6 py-2.5">
              {showReviewForm ? 'Cancel' : '+ Write a Review'}
            </button>
          ) : (
            <Link to="/login" className="text-xs underline text-gray-500 hover:text-bj-gold transition-colors">
              Sign in to write a review
            </Link>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm mb-10">
            <h3 className="font-serif text-2xl mb-6">Share your experience</h3>
            <div className="space-y-5">
              <div>
                <p id="review-rating-label" className="label-luxury">Your Rating</p>
                <div className="flex gap-1.5 mt-1" role="group" aria-labelledby="review-rating-label">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      aria-pressed={reviewForm.rating === star}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={reviewForm.rating >= star ? 'text-bj-gold fill-bj-gold' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="label-luxury">Review Title</span>
                <input
                  required
                  type="text"
                  className="input-luxury"
                  value={reviewForm.title}
                  onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="Give your review a short title"
                />
              </label>
              <label className="block">
                <span className="label-luxury">Your Comments</span>
                <textarea
                  required
                  className="input-luxury h-28 resize-none"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Tell us what you liked about this piece..."
                />
              </label>
              <button type="submit" disabled={submittingReview} className="btn-gold py-3 px-8">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div>
            {/* Summary */}
            <div className="flex items-center gap-6 p-6 bg-white border border-gray-100 shadow-sm mb-6">
              <div className="text-center">
                <p className="font-serif text-4xl text-bj-charcoal">{product.avgRating?.toFixed(1)}</p>
                <StarRating rating={product.avgRating || 5} size={16} className="justify-center mt-1" />
                <p className="text-xs text-gray-500 mt-1">{product.reviews.length} reviews</p>
              </div>
              <div className="flex-1 text-sm text-gray-500">
                What customers say about {product.name}.
              </div>
            </div>

            <div className="space-y-4">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="bg-white p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <StarRating rating={review.rating} size={13} />
                      <h4 className="font-medium text-bj-charcoal mt-1.5">{review.title}</h4>
                    </div>
                    <span className="text-[10px] text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{review.comment}</p>
                  <p className="text-[10px] text-bj-stone uppercase tracking-wider font-medium">{review.user.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-12 border border-gray-100 shadow-sm">
            <Star size={36} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 mb-2">No reviews yet for this piece.</p>
            <p className="text-sm text-bj-stone">Be the first to share your experience with {product.name}.</p>
            {!user && (
              <Link to="/login" className="btn-outline text-xs mt-6 inline-flex">Sign in to Review</Link>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Mobile buy bar: price and the primary action never scroll away */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-4">
        <p className="font-serif text-2xl text-bj-charcoal shrink-0">₹{Number(product.price).toLocaleString('en-IN')}</p>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn-gold flex-1 px-4 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Sold Out' : requiresSize && !selectedSize ? 'Select a Size' : 'Add to Bag'}
        </button>
      </div>

    </div>
  );
};
