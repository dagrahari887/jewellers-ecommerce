import { PrismaClient, MetalType, PriceType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Baikunthh seed...');

  // ===========================
  // SETTINGS
  // ===========================
  await prisma.settings.upsert({
    where: { id: 'store_settings' },
    update: {},
    create: {
      id: 'store_settings',
      storeName: 'Baikunthh Jewellers',
      contactEmail: 'care@baikunthh.com',
      contactPhone: '+91 7068580500',
      whatsappNumber: '+917068580500',
      instagramLink: 'https://instagram.com/devanshabhushan',
      gstPercentage: 3,
      address: 'Premium Jewellery Showroom, Authorized Hallmark Centre, India',
      aboutUs: 'Baikunthh Jewellers crafts timeless jewellery for extraordinary moments. Every piece is handcrafted with the finest metals and stones, carrying the legacy of Indian jewellery tradition.',
      announcement: 'Complimentary Insured Shipping on all Bridal Collections ✦ Lifetime Buyback Guarantee',
      heroTitle: 'Timeless Jewellery.',
      heroSubtitle: 'Extraordinary Moments.',
    },
  });

  // ===========================
  // ADMIN USER
  // ===========================
  const adminPassword = await bcrypt.hash('admin1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@baikunthh.com' },
    update: {},
    create: {
      id: 'user_admin_bj',
      email: 'admin@baikunthh.com',
      password: adminPassword,
      name: 'Baikunthh Admin',
      role: Role.ADMIN,
      phone: '+91 7068580500',
    },
  });
  console.log('✅ Admin user: admin@baikunthh.com / admin1234');

  // Demo customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  await prisma.user.upsert({
    where: { email: 'priya@example.com' },
    update: {},
    create: {
      id: 'user_demo_customer',
      email: 'priya@example.com',
      password: customerPassword,
      name: 'Priya Sharma',
      role: Role.CUSTOMER,
      phone: '+91 9876543210',
    },
  });

  // ===========================
  // CATEGORIES
  // ===========================
  const rings = await prisma.category.upsert({
    where: { name: 'Rings' },
    update: {},
    create: { id: 'cat_rings', name: 'Rings', slug: 'rings', description: 'Elegant rings for every occasion', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
  });
  const necklaces = await prisma.category.upsert({
    where: { name: 'Necklaces' },
    update: {},
    create: { id: 'cat_necklaces', name: 'Necklaces', slug: 'necklaces', description: 'Statement necklaces and chokers', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80' },
  });
  const bangles = await prisma.category.upsert({
    where: { name: 'Bangles' },
    update: {},
    create: { id: 'cat_bangles', name: 'Bangles', slug: 'bangles', description: 'Bangles and kadas', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80' },
  });
  const earrings = await prisma.category.upsert({
    where: { name: 'Earrings' },
    update: {},
    create: { id: 'cat_earrings', name: 'Earrings', slug: 'earrings', description: 'Jhumkas, hoops, drops and studs', imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&q=80' },
  });
  const pendants = await prisma.category.upsert({
    where: { name: 'Pendants' },
    update: {},
    create: { id: 'cat_pendants', name: 'Pendants', slug: 'pendants', description: 'Divine and contemporary pendants', imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80' },
  });

  // ===========================
  // COLLECTIONS
  // ===========================
  const bridal = await prisma.collection.upsert({
    where: { name: 'Bridal Edit' },
    update: {},
    create: { id: 'col_bridal', name: 'Bridal Edit', slug: 'bridal-edit', description: 'The complete bridal jewellery trousseau', imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80' },
  });
  const daily = await prisma.collection.upsert({
    where: { name: 'Daily Luxury' },
    update: {},
    create: { id: 'col_daily', name: 'Daily Luxury', slug: 'daily-luxury', description: 'Refined pieces for everyday wear', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80' },
  });
  const heirloom = await prisma.collection.upsert({
    where: { name: 'Heirloom Classics' },
    update: {},
    create: { id: 'col_heirloom', name: 'Heirloom Classics', slug: 'heirloom-classics', description: 'Timeless pieces crafted to be passed down', imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80' },
  });

  // ===========================
  // METAL RATES
  // ===========================
  await prisma.metalRate.upsert({
    where: { id: 'rate_gold_24k' },
    update: { rate: 7650 },
    create: { id: 'rate_gold_24k', metal: MetalType.GOLD, purity: '24K', rate: 7650 },
  });
  await prisma.metalRate.upsert({
    where: { id: 'rate_gold_22k' },
    update: { rate: 7010 },
    create: { id: 'rate_gold_22k', metal: MetalType.GOLD, purity: '22K', rate: 7010 },
  });
  await prisma.metalRate.upsert({
    where: { id: 'rate_gold_18k' },
    update: { rate: 5738 },
    create: { id: 'rate_gold_18k', metal: MetalType.GOLD, purity: '18K', rate: 5738 },
  });
  await prisma.metalRate.upsert({
    where: { id: 'rate_silver_999' },
    update: { rate: 97 },
    create: { id: 'rate_silver_999', metal: MetalType.SILVER, purity: '999', rate: 97 },
  });
  await prisma.metalRate.upsert({
    where: { id: 'rate_silver_925' },
    update: { rate: 92 },
    create: { id: 'rate_silver_925', metal: MetalType.SILVER, purity: '925', rate: 92 },
  });

  // ===========================
  // PRODUCTS
  // ===========================
  const products = [
    {
      id: 'prod_bj_nc_001', sku: 'BJ-NC-001', name: 'Vedic Temple Choker', slug: 'vedic-temple-choker',
      description: 'A majestic temple choker crafted in 22K gold, featuring intricate deity motifs. Perfect for bridal occasions and festive celebrations.',
      categoryId: necklaces.id, collectionId: bridal.id,
      priceType: PriceType.RATE_BASED, metalType: MetalType.GOLD, purity: '22K',
      netWeight: 45.25, grossWeight: 48.0, makingCharge: 12500, stoneCharge: 5000, stock: 3, isFeatured: true,
      tags: ['BESTSELLER', 'BRIDAL PICK'],
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
      ],
    },
    {
      id: 'prod_bj_rg_042', sku: 'BJ-RG-042', name: 'The Nizam Solitaire Ring', slug: 'the-nizam-solitaire-ring',
      description: 'A breathtaking solitaire ring inspired by royal Nizam jewellery. Set with a premium certified diamond in 18K gold.',
      categoryId: rings.id, collectionId: heirloom.id,
      priceType: PriceType.FIXED, fixedPrice: 145000, stock: 2, isFeatured: true,
      tags: ['EXCLUSIVE', 'DIAMOND'],
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
        'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80',
      ],
    },
    {
      id: 'prod_bj_br_012', sku: 'BJ-BR-012', name: 'Classic 925 Silver Kada', slug: 'classic-925-silver-kada',
      description: 'A bold and beautiful silver kada in 925 sterling silver with intricate geometric patterns. A statement piece for everyday luxury.',
      categoryId: bangles.id, collectionId: daily.id,
      priceType: PriceType.RATE_BASED, metalType: MetalType.SILVER, purity: '925',
      netWeight: 22.5, grossWeight: 24.0, makingCharge: 1800, stoneCharge: 0, stock: 8, isFeatured: true,
      tags: ['NEW', 'SILVER'],
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      ],
    },
    {
      id: 'prod_bj_er_031', sku: 'BJ-ER-031', name: 'Rajputi Jhumka Set', slug: 'rajputi-jhumka-set',
      description: 'Traditional Rajputi jhumkas in 22K gold with meenakari work and ruby accents. A celebration of India\'s finest jewellery heritage.',
      categoryId: earrings.id, collectionId: bridal.id,
      priceType: PriceType.RATE_BASED, metalType: MetalType.GOLD, purity: '22K',
      netWeight: 18.5, grossWeight: 20.0, makingCharge: 8500, stoneCharge: 3500, stock: 5, isFeatured: true,
      tags: ['BRIDAL PICK', 'BESTSELLER'],
      images: [
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80',
        'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=800&q=80',
      ],
    },
    {
      id: 'prod_bj_pd_007', sku: 'BJ-PD-007', name: 'Ganesha Gold Pendant', slug: 'ganesha-gold-pendant',
      description: 'A divine Ganesha pendant in 22K gold, handcrafted with exceptional detail. Brings auspiciousness and elegance to any outfit.',
      categoryId: pendants.id, collectionId: heirloom.id,
      priceType: PriceType.RATE_BASED, metalType: MetalType.GOLD, purity: '22K',
      netWeight: 8.2, grossWeight: 8.8, makingCharge: 2800, stoneCharge: 0, stock: 10, isFeatured: false,
      tags: ['DEVOTIONAL', 'GIFTING'],
      images: [
        'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
      ],
    },
    {
      id: 'prod_bj_rg_015', sku: 'BJ-RG-015', name: 'Floral Diamond Ring', slug: 'floral-diamond-ring',
      description: 'A delicate floral cluster ring in 18K white gold, set with VS1 clarity diamonds arranged in a blooming pattern.',
      categoryId: rings.id, collectionId: daily.id,
      priceType: PriceType.FIXED, fixedPrice: 89500, stock: 4, isFeatured: false,
      tags: ['DIAMOND', 'WHITE GOLD'],
      images: [
        'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80',
      ],
    },
    {
      id: 'prod_bj_nc_023', sku: 'BJ-NC-023', name: 'Polki Kundan Haar', slug: 'polki-kundan-haar',
      description: 'A statement Polki Kundan bridal necklace set in 22K gold with uncut diamonds and emerald drops. The ultimate bridal piece.',
      categoryId: necklaces.id, collectionId: bridal.id,
      priceType: PriceType.FIXED, fixedPrice: 385000, stock: 1, isFeatured: true,
      tags: ['BRIDAL PICK', 'POLKI', 'EXCLUSIVE'],
      images: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
      ],
    },
    {
      id: 'prod_bj_br_034', sku: 'BJ-BR-034', name: 'Gold Bangle Set (4pc)', slug: 'gold-bangle-set-4pc',
      description: 'A set of 4 plain 22K gold bangles with a polished finish. A timeless addition to any jewellery collection.',
      categoryId: bangles.id, collectionId: daily.id,
      priceType: PriceType.RATE_BASED, metalType: MetalType.GOLD, purity: '22K',
      netWeight: 28.0, grossWeight: 30.0, makingCharge: 4500, stoneCharge: 0, stock: 6, isFeatured: false,
      tags: ['PLAIN GOLD', 'SET'],
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      ],
    },
  ];

  for (const p of products) {
    const { images, ...productData } = p;
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productData,
        isActive: true,
        images: {
          create: images.map((url: string, i: number) => ({ id: `img_${productData.id}_${i}`, url, sortOrder: i })),
        },
      },
    });
  }

  // ===========================
  // BANNERS
  // ===========================
  await prisma.banner.upsert({
    where: { id: 'banner_01' },
    update: {},
    create: {
      id: 'banner_01',
      title: 'The Bridal Edit 2026',
      subtitle: 'Crafted for your most extraordinary day',
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=85',
      linkUrl: '/shop?collection=Bridal Edit',
      buttonText: 'Explore Collection',
      isActive: true,
      displayOrder: 1,
    },
  });
  await prisma.banner.upsert({
    where: { id: 'banner_02' },
    update: {},
    create: {
      id: 'banner_02',
      title: 'Daily Luxury',
      subtitle: 'Fine jewellery for every moment',
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=85',
      linkUrl: '/shop?collection=Daily Luxury',
      buttonText: 'Shop Now',
      isActive: true,
      displayOrder: 2,
    },
  });
  await prisma.banner.upsert({
    where: { id: 'banner_03' },
    update: {},
    create: {
      id: 'banner_03',
      title: 'Heirloom Classics',
      subtitle: 'Jewellery that becomes part of your legacy',
      imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=85',
      linkUrl: '/shop?collection=Heirloom Classics',
      buttonText: 'Discover More',
      isActive: true,
      displayOrder: 3,
    },
  });

  // ===========================
  // COUPONS
  // ===========================
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      id: 'coupon_welcome10',
      code: 'WELCOME10',
      description: '10% off your first order',
      discountType: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 5000,
      maxDiscount: 10000,
      expiryDate: new Date('2027-12-31'),
      usageLimit: 1000,
      isActive: true,
    },
  });
  await prisma.coupon.upsert({
    where: { code: 'BRIDAL2026' },
    update: {},
    create: {
      id: 'coupon_bridal2026',
      code: 'BRIDAL2026',
      description: 'Flat ₹5000 off on bridal orders above ₹1,00,000',
      discountType: 'FIXED',
      value: 5000,
      minOrderAmount: 100000,
      expiryDate: new Date('2027-12-31'),
      isActive: true,
    },
  });

  // ===========================
  // ARTICLES (CMS)
  // ===========================
  await prisma.article.upsert({
    where: { slug: 'how-to-care-for-your-gold-jewellery-seed' },
    update: {},
    create: {
      id: 'article_care_gold',
      title: 'How to Care for Your Gold Jewellery',
      slug: 'how-to-care-for-your-gold-jewellery-seed',
      description: 'Expert tips to keep your precious gold jewellery sparkling for generations.',
      content: `<h2>Keep Your Gold Gleaming</h2><p>Gold jewellery is an investment that, with proper care, lasts for generations. Here are our expert tips from the house of Baikunthh.</p><h3>Daily Care</h3><ul><li>Remove before swimming, bathing, or exercising</li><li>Apply perfumes and cosmetics before wearing jewellery</li><li>Store pieces separately to avoid scratching</li></ul><h3>Cleaning at Home</h3><p>Mix warm water with a few drops of mild dish soap. Gently scrub with a soft toothbrush, rinse thoroughly, and pat dry with a lint-free cloth.</p><h3>Professional Cleaning</h3><p>Visit us at Baikunthh for a complimentary professional ultrasonic cleaning every 6 months.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      status: 'PUBLISHED',
      authorId: 'user_admin_bj',
    },
  });
  await prisma.article.upsert({
    where: { slug: 'understanding-gold-purity-a-guide-seed' },
    update: {},
    create: {
      id: 'article_gold_purity',
      title: 'Understanding Gold Purity: 24K, 22K & 18K Explained',
      slug: 'understanding-gold-purity-a-guide-seed',
      description: 'Everything you need to know about gold purity and how it affects jewellery pricing and quality.',
      content: `<h2>The Gold Standard</h2><p>When buying gold jewellery, you'll encounter terms like 24K, 22K, and 18K. Understanding these helps you make the perfect choice.</p><h3>24K Gold — Pure Gold</h3><p>24 karat gold is 99.9% pure gold. It's the most valuable form but too soft for most jewellery. Ideal for coins and bars.</p><h3>22K Gold — The Indian Standard</h3><p>22K contains 91.7% gold with the remainder being silver and copper for strength. This is the traditional choice for Indian jewellery, offering the perfect balance of purity and durability.</p><h3>18K Gold — The Contemporary Choice</h3><p>18K gold (75% pure) is harder and more durable, making it ideal for diamond-set jewellery and contemporary designs.</p><h3>How We Price at Baikunthh</h3><p>Our pricing is fully transparent and based on live market rates. Use our live rate tracker to calculate the metal value of any piece.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      status: 'PUBLISHED',
      authorId: 'user_admin_bj',
    },
  });
  await prisma.article.upsert({
    where: { slug: 'bridal-jewellery-guide-2026-seed' },
    update: {},
    create: {
      id: 'article_bridal_guide',
      title: 'The Complete Bridal Jewellery Guide 2026',
      slug: 'bridal-jewellery-guide-2026-seed',
      description: 'From the maang tikka to the haathphool — your complete guide to planning your bridal jewellery trousseau.',
      content: `<h2>Your Dream Bridal Look</h2><p>Bridal jewellery is one of the most important decisions of your wedding. At Baikunthh, we help every bride curate their perfect trousseau.</p><h3>The Essential Pieces</h3><ul><li><strong>Maang Tikka</strong> — The crown of your bridal look</li><li><strong>Necklace/Haar</strong> — Your statement piece</li><li><strong>Earrings</strong> — Jhumkas or chandelier drops</li><li><strong>Bangles/Kadas</strong> — Complete the look</li><li><strong>Haathphool</strong> — The hand harness</li><li><strong>Nath</strong> — The nose ring, if traditional</li><li><strong>Payal</strong> — Anklets for the complete look</li></ul><h3>Book a Bridal Consultation</h3><p>Our bridal specialists offer personalized consultations to help you select pieces that match your outfit, budget, and vision. Book your appointment today.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
      status: 'PUBLISHED',
      authorId: 'user_admin_bj',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('👤 Admin: admin@baikunthh.com / admin1234');
  console.log('👤 Customer: priya@example.com / customer123');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
