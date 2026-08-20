import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { MessageCircle, Heart } from 'lucide-react';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const addToCart = useStore((state) => state.addToCart);
  const wishlist = useStore((state) => state.wishlist);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore(
    (state) => state.removeFromWishlist
  );

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(
          `http://localhost:5000/api/products/${slug}`
        );

        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('Product could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bj-ivory flex items-center justify-center">
        <p className="font-serif text-xl">
          Loading...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-bj-ivory flex items-center justify-center">
        <p className="text-red-600">
          {error || 'Product not found.'}
        </p>
      </div>
    );
  }

  const price = Number(product.price || 0);

  const image =
    product.images?.[0]?.url ||
    '/images/placeholder.jpg';

  const isWishlisted = wishlist.some(
    (item) => item.productId === product.id
  );

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      image,
    });

    alert(`${product.name} added to your collection.`);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price,
        image,
        category:
          product.category?.name || 'Jewellery',
        purity: product.purity || '',
      });
    }
  };

  const handleWhatsAppEnquiry = () => {
    const message =
      `Namaste Baikunthh Jewellers, I'm interested in the ${product.name} ` +
      `(SKU: ${product.sku}). Price: ₹${price.toLocaleString('en-IN')}. ` +
      `Could you please share more details?`;

    window.open(
      `https://wa.me/917068580500?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="pt-32 pb-20 bg-bj-ivory min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl mx-auto px-6">

        {/* Product Image */}
        <div className="space-y-4">

          <div className="relative">

            {product.images?.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                No image available
              </div>
            )}

            {/* Wishlist */}
            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
            >
              <Heart
                size={20}
                className={
                  isWishlisted
                    ? 'fill-bj-gold text-bj-gold'
                    : 'text-bj-charcoal hover:text-bj-gold'
                }
              />
            </button>

          </div>

          {/* Additional Images */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map(
                (img: any, index: number) => (
                  <img
                    key={img.id || index}
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-square object-cover cursor-pointer"
                  />
                )
              )}
            </div>
          )}

        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">

          <span className="text-bj-gold uppercase tracking-[0.2em] text-sm mb-2">
            {product.category?.name || 'Jewellery'}
          </span>

          <h1 className="font-serif text-4xl mb-4">
            {product.name}
          </h1>

          <p className="text-sm text-gray-500 mb-3">
            SKU: {product.sku}
          </p>

          <p className="text-2xl font-light mb-6">
            ₹{price.toLocaleString('en-IN')}
          </p>

          <p className="text-gray-600 mb-10 leading-relaxed">
            {product.description}
          </p>

          {/* Product Details */}
          <div className="border-y border-gray-200 py-6 mb-8">
            <h3 className="font-serif text-lg mb-4">
              Product Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">

              {product.metalType && (
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Metal
                  </span>
                  <p>{product.metalType}</p>
                </div>
              )}

              {product.purity && (
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Purity
                  </span>
                  <p>{product.purity}</p>
                </div>
              )}

              {product.netWeight && (
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Net Weight
                  </span>
                  <p>
                    {Number(product.netWeight).toFixed(3)} g
                  </p>
                </div>
              )}

              {product.stock !== undefined && (
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Availability
                  </span>
                  <p>
                    {product.stock > 0
                      ? 'In Stock'
                      : 'Available on Enquiry'}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-bj-charcoal text-white py-4 uppercase text-xs tracking-widest hover:bg-black transition-all"
            >
              Add to Cart
            </button>

            <button
              type="button"
              onClick={handleWhatsAppEnquiry}
              className="flex-1 border border-green-600 text-green-600 py-4 uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-green-50"
            >
              <MessageCircle size={16} />
              Enquire
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};