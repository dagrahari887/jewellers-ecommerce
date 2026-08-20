import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { calculateProductPrice } from '../logic/pricing';

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// GET /api/categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// GET /api/collections
export const getCollections = async (_req: Request, res: Response) => {
  try {
    const collections = await prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return res.json({ collections });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

// GET /api/admin/products (full list with all fields)
export const adminGetProducts = async (_req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, collection: true, images: true, _count: { select: { reviews: true, orderItems: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const rates = await prisma.metalRate.findMany();
    return res.json({ products: products.map(p => ({ ...p, price: calculateProductPrice(p as any, rates) })) });
  } catch (error) {
    console.error('Admin get products error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// POST /api/admin/products
export const adminCreateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      sku, name, description, categoryId, collectionId,
      priceType, fixedPrice, metalType, purity,
      grossWeight, netWeight, makingCharge, stoneCharge,
      stock, tags, isFeatured, isActive, images,
    } = req.body;

    if (!sku || !name || !description || !categoryId) {
      return res.status(400).json({ error: 'sku, name, description, categoryId are required' });
    }

    // Validate category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return res.status(400).json({ error: 'Category not found' });

    const slug = slugify(name) + '-' + Date.now().toString().slice(-6);
    const productId = randomUUID();

    const product = await prisma.product.create({
      data: {
        id: productId,
        sku: String(sku).toUpperCase().trim(),
        name,
        description,
        slug,
        categoryId,
        collectionId: collectionId || null,
        priceType: priceType || 'RATE_BASED',
        fixedPrice: fixedPrice != null && fixedPrice !== '' ? Number(fixedPrice) : null,
        metalType: metalType || null,
        purity: purity || null,
        grossWeight: grossWeight != null && grossWeight !== '' ? Number(grossWeight) : null,
        netWeight: netWeight != null && netWeight !== '' ? Number(netWeight) : null,
        makingCharge: makingCharge != null && makingCharge !== '' ? Number(makingCharge) : null,
        stoneCharge: stoneCharge != null && stoneCharge !== '' ? Number(stoneCharge) : null,
        stock: Number(stock || 0),
        tags: Array.isArray(tags) ? tags : (tags ? [tags] : Prisma.JsonNull),
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        images: images?.length
          ? { create: images.map((url: string, i: number) => ({ id: randomUUID(), url, sortOrder: i })) }
          : undefined,
      },
      include: { category: true, collection: true, images: true },
    });
    return res.status(201).json({ message: 'Product created', product });
  } catch (error: any) {
    console.error('Admin create product error:', error);
    if (error.code === 'P2002') return res.status(400).json({ error: 'SKU or slug already exists. Use a unique name.' });
    return res.status(500).json({ error: 'Failed to create product' });
  }
};

// PUT /api/admin/products/:id
export const adminUpdateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name, description, categoryId, collectionId,
      priceType, fixedPrice, metalType, purity,
      grossWeight, netWeight, makingCharge, stoneCharge,
      stock, tags, isFeatured, isActive, images,
    } = req.body;

    // Check product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const data: any = {};
    if (name !== undefined) { data.name = name; data.slug = slugify(name) + '-' + Date.now().toString().slice(-6); }
    if (description !== undefined) data.description = description;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (collectionId !== undefined) data.collectionId = collectionId || null;
    if (priceType !== undefined) data.priceType = priceType;
    if (fixedPrice !== undefined) data.fixedPrice = fixedPrice != null && fixedPrice !== '' ? Number(fixedPrice) : null;
    if (metalType !== undefined) data.metalType = metalType || null;
    if (purity !== undefined) data.purity = purity || null;
    if (grossWeight !== undefined) data.grossWeight = grossWeight != null && grossWeight !== '' ? Number(grossWeight) : null;
    if (netWeight !== undefined) data.netWeight = netWeight != null && netWeight !== '' ? Number(netWeight) : null;
    if (makingCharge !== undefined) data.makingCharge = makingCharge != null && makingCharge !== '' ? Number(makingCharge) : null;
    if (stoneCharge !== undefined) data.stoneCharge = stoneCharge != null && stoneCharge !== '' ? Number(stoneCharge) : null;
    if (stock !== undefined) data.stock = Math.max(0, Number(stock));
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags : (tags ? [tags] : null);
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const product = await prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        data.images = images?.length
          ? { create: images.map((url: string, i: number) => ({ id: randomUUID(), url, sortOrder: i })) }
          : undefined;
      }
      return tx.product.update({
        where: { id },
        data,
        include: { category: true, collection: true, images: true },
      });
    });
    return res.json({ message: 'Product updated', product });
  } catch (error: any) {
    console.error('Admin update product error:', error);
    if (error.code === 'P2002') return res.status(400).json({ error: 'Slug conflict — product name too similar to an existing product' });
    return res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE /api/admin/products/:id
export const adminDeleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Admin delete product error:', error);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Admin Category CRUD
export const adminGetCategories = async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const adminCreateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const category = await prisma.category.create({
      data: { id: `cat_${Date.now()}`, name, description: description || null, imageUrl: imageUrl || null, slug: slugify(name) },
    });
    return res.status(201).json({ message: 'Category created', category });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Category already exists' });
    return res.status(500).json({ error: 'Failed to create category' });
  }
};

export const adminUpdateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        slug: name ? slugify(name) : undefined,
      },
    });
    return res.json({ message: 'Category updated', category });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update category' });
  }
};

export const adminDeleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete category' });
  }
};

// Admin Collection CRUD
export const adminGetCollections = async (_req: AuthRequest, res: Response) => {
  try {
    const collections = await prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
    });
    return res.json({ collections });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

export const adminCreateCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const collection = await prisma.collection.create({
      data: { id: `col_${Date.now()}`, name, description: description || null, imageUrl: imageUrl || null, slug: slugify(name) },
    });
    return res.status(201).json({ message: 'Collection created', collection });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Collection already exists' });
    return res.status(500).json({ error: 'Failed to create collection' });
  }
};

export const adminUpdateCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;
    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        slug: name ? slugify(name) : undefined,
      },
    });
    return res.json({ message: 'Collection updated', collection });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update collection' });
  }
};

export const adminDeleteCollection = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.collection.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Collection deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete collection' });
  }
};
