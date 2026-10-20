import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { calculateProductPrice } from '../logic/pricing';

function formatProduct(product: any, rates: any[]) {
  return {
    ...product,
    price: calculateProductPrice(product, rates),
    fixedPrice: product.fixedPrice != null ? Number(product.fixedPrice) : null,
    grossWeight: product.grossWeight != null ? Number(product.grossWeight) : null,
    netWeight: product.netWeight != null ? Number(product.netWeight) : null,
    makingCharge: product.makingCharge != null ? Number(product.makingCharge) : null,
    stoneCharge: product.stoneCharge != null ? Number(product.stoneCharge) : null,
  };
}

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, collection, metal, purity, featured, search, minPrice, maxPrice } = req.query;

    const where: any = { isActive: true };
    if (category) where.category = { name: String(category) };
    if (collection) where.collection = { name: String(collection) };
    if (metal) where.metalType = String(metal).toUpperCase();
    if (purity) where.purity = String(purity);
    if (featured === 'true') where.isFeatured = true;
    if (search) where.name = { contains: String(search), mode: 'insensitive' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true, collection: true, images: true },
      orderBy: { createdAt: 'desc' },
    });

    const rates = await prisma.metalRate.findMany();
    let result = products.map((product) => formatProduct(product, rates));

    // Price filter (post-calculation) — exclude products with price=0 (missing rate data)
    if (minPrice || maxPrice) result = result.filter((p) => p.price > 0);
    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

    return res.json(result);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    // Cart items only store the product id, so accept either
    const product = await prisma.product.findFirst({
      where: { OR: [{ slug: req.params.slug }, { id: req.params.slug }] },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const rates = await prisma.metalRate.findMany();
    const formatted = formatProduct(product, rates);

    // Add avg rating
    const avgRating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    return res.json({ ...formatted, avgRating: Math.round(avgRating * 10) / 10 });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// PUT /api/admin/products/:id/stock (legacy, kept for compatibility)
export const updateProductStock = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const newStock = Number(stock);

    if (!Number.isInteger(newStock) || newStock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative integer' });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const updatedProduct = await prisma.product.update({ where: { id }, data: { stock: newStock } });
    return res.status(200).json({ message: 'Stock updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Update product stock error:', error);
    return res.status(500).json({ error: 'Unable to update product stock' });
  }
};
