"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteCollection = exports.adminUpdateCollection = exports.adminCreateCollection = exports.adminGetCollections = exports.adminDeleteCategory = exports.adminUpdateCategory = exports.adminCreateCategory = exports.adminGetCategories = exports.adminDeleteProduct = exports.adminUpdateProduct = exports.adminCreateProduct = exports.adminGetProducts = exports.getCollections = exports.getCategories = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
const pricing_1 = require("../logic/pricing");
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// GET /api/categories
const getCategories = async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' },
        });
        return res.json({ categories });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
exports.getCategories = getCategories;
// GET /api/collections
const getCollections = async (_req, res) => {
    try {
        const collections = await prisma_1.prisma.collection.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' },
        });
        return res.json({ collections });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch collections' });
    }
};
exports.getCollections = getCollections;
// GET /api/admin/products (full list with all fields)
const adminGetProducts = async (_req, res) => {
    try {
        const products = await prisma_1.prisma.product.findMany({
            include: { category: true, collection: true, images: true, _count: { select: { reviews: true, orderItems: true } } },
            orderBy: { createdAt: 'desc' },
        });
        const rates = await prisma_1.prisma.metalRate.findMany();
        return res.json(products.map(p => ({ ...p, price: (0, pricing_1.calculateProductPrice)(p, rates) })));
    }
    catch (error) {
        console.error('Admin get products error:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.adminGetProducts = adminGetProducts;
// POST /api/admin/products
const adminCreateProduct = async (req, res) => {
    try {
        const { sku, name, description, categoryId, collectionId, priceType, fixedPrice, metalType, purity, grossWeight, netWeight, makingCharge, stoneCharge, stock, tags, isFeatured, isActive, images, } = req.body;
        if (!sku || !name || !description || !categoryId) {
            return res.status(400).json({ error: 'sku, name, description, categoryId are required' });
        }
        // Validate category exists
        const category = await prisma_1.prisma.category.findUnique({ where: { id: categoryId } });
        if (!category)
            return res.status(400).json({ error: 'Category not found' });
        const slug = slugify(name) + '-' + Date.now().toString().slice(-6);
        const productId = (0, crypto_1.randomUUID)();
        const product = await prisma_1.prisma.product.create({
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
                tags: Array.isArray(tags) ? tags : (tags ? [tags] : client_1.Prisma.JsonNull),
                isFeatured: Boolean(isFeatured),
                isActive: isActive !== undefined ? Boolean(isActive) : true,
                images: images?.length
                    ? { create: images.map((url, i) => ({ id: (0, crypto_1.randomUUID)(), url, sortOrder: i })) }
                    : undefined,
            },
            include: { category: true, collection: true, images: true },
        });
        return res.status(201).json({ message: 'Product created', product });
    }
    catch (error) {
        console.error('Admin create product error:', error);
        if (error.code === 'P2002')
            return res.status(400).json({ error: 'SKU or slug already exists. Use a unique name.' });
        return res.status(500).json({ error: 'Failed to create product' });
    }
};
exports.adminCreateProduct = adminCreateProduct;
// PUT /api/admin/products/:id
const adminUpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, categoryId, collectionId, priceType, fixedPrice, metalType, purity, grossWeight, netWeight, makingCharge, stoneCharge, stock, tags, isFeatured, isActive, images, } = req.body;
        // Check product exists
        const existing = await prisma_1.prisma.product.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ error: 'Product not found' });
        const data = {};
        if (name !== undefined) {
            data.name = name;
            data.slug = slugify(name) + '-' + Date.now().toString().slice(-6);
        }
        if (description !== undefined)
            data.description = description;
        if (categoryId !== undefined)
            data.categoryId = categoryId;
        if (collectionId !== undefined)
            data.collectionId = collectionId || null;
        if (priceType !== undefined)
            data.priceType = priceType;
        if (fixedPrice !== undefined)
            data.fixedPrice = fixedPrice != null && fixedPrice !== '' ? Number(fixedPrice) : null;
        if (metalType !== undefined)
            data.metalType = metalType || null;
        if (purity !== undefined)
            data.purity = purity || null;
        if (grossWeight !== undefined)
            data.grossWeight = grossWeight != null && grossWeight !== '' ? Number(grossWeight) : null;
        if (netWeight !== undefined)
            data.netWeight = netWeight != null && netWeight !== '' ? Number(netWeight) : null;
        if (makingCharge !== undefined)
            data.makingCharge = makingCharge != null && makingCharge !== '' ? Number(makingCharge) : null;
        if (stoneCharge !== undefined)
            data.stoneCharge = stoneCharge != null && stoneCharge !== '' ? Number(stoneCharge) : null;
        if (stock !== undefined)
            data.stock = Math.max(0, Number(stock));
        if (tags !== undefined)
            data.tags = Array.isArray(tags) ? tags : (tags ? [tags] : null);
        if (isFeatured !== undefined)
            data.isFeatured = Boolean(isFeatured);
        if (isActive !== undefined)
            data.isActive = Boolean(isActive);
        const product = await prisma_1.prisma.$transaction(async (tx) => {
            if (images !== undefined) {
                await tx.productImage.deleteMany({ where: { productId: id } });
                data.images = images?.length
                    ? { create: images.map((url, i) => ({ id: (0, crypto_1.randomUUID)(), url, sortOrder: i })) }
                    : undefined;
            }
            return tx.product.update({
                where: { id },
                data,
                include: { category: true, collection: true, images: true },
            });
        });
        return res.json({ message: 'Product updated', product });
    }
    catch (error) {
        console.error('Admin update product error:', error);
        if (error.code === 'P2002')
            return res.status(400).json({ error: 'Slug conflict — product name too similar to an existing product' });
        return res.status(500).json({ error: 'Failed to update product' });
    }
};
exports.adminUpdateProduct = adminUpdateProduct;
// DELETE /api/admin/products/:id
const adminDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.product.delete({ where: { id } });
        return res.json({ message: 'Product deleted' });
    }
    catch (error) {
        console.error('Admin delete product error:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
    }
};
exports.adminDeleteProduct = adminDeleteProduct;
// Admin Category CRUD
const adminGetCategories = async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({
            include: { _count: { select: { products: true } } },
        });
        return res.json({ categories });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
exports.adminGetCategories = adminGetCategories;
const adminCreateCategory = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        if (!name)
            return res.status(400).json({ error: 'name is required' });
        const category = await prisma_1.prisma.category.create({
            data: { id: `cat_${Date.now()}`, name, description: description || null, imageUrl: imageUrl || null, slug: slugify(name) },
        });
        return res.status(201).json({ message: 'Category created', category });
    }
    catch (error) {
        if (error.code === 'P2002')
            return res.status(400).json({ error: 'Category already exists' });
        return res.status(500).json({ error: 'Failed to create category' });
    }
};
exports.adminCreateCategory = adminCreateCategory;
const adminUpdateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl } = req.body;
        const category = await prisma_1.prisma.category.update({
            where: { id },
            data: {
                name: name || undefined,
                description: description !== undefined ? description : undefined,
                imageUrl: imageUrl !== undefined ? imageUrl : undefined,
                slug: name ? slugify(name) : undefined,
            },
        });
        return res.json({ message: 'Category updated', category });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update category' });
    }
};
exports.adminUpdateCategory = adminUpdateCategory;
const adminDeleteCategory = async (req, res) => {
    try {
        await prisma_1.prisma.category.delete({ where: { id: req.params.id } });
        return res.json({ message: 'Category deleted' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete category' });
    }
};
exports.adminDeleteCategory = adminDeleteCategory;
// Admin Collection CRUD
const adminGetCollections = async (_req, res) => {
    try {
        const collections = await prisma_1.prisma.collection.findMany({
            include: { _count: { select: { products: true } } },
        });
        return res.json({ collections });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch collections' });
    }
};
exports.adminGetCollections = adminGetCollections;
const adminCreateCollection = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        if (!name)
            return res.status(400).json({ error: 'name is required' });
        const collection = await prisma_1.prisma.collection.create({
            data: { id: `col_${Date.now()}`, name, description: description || null, imageUrl: imageUrl || null, slug: slugify(name) },
        });
        return res.status(201).json({ message: 'Collection created', collection });
    }
    catch (error) {
        if (error.code === 'P2002')
            return res.status(400).json({ error: 'Collection already exists' });
        return res.status(500).json({ error: 'Failed to create collection' });
    }
};
exports.adminCreateCollection = adminCreateCollection;
const adminUpdateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl } = req.body;
        const collection = await prisma_1.prisma.collection.update({
            where: { id },
            data: {
                name: name || undefined,
                description: description !== undefined ? description : undefined,
                imageUrl: imageUrl !== undefined ? imageUrl : undefined,
                slug: name ? slugify(name) : undefined,
            },
        });
        return res.json({ message: 'Collection updated', collection });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update collection' });
    }
};
exports.adminUpdateCollection = adminUpdateCollection;
const adminDeleteCollection = async (req, res) => {
    try {
        await prisma_1.prisma.collection.delete({ where: { id: req.params.id } });
        return res.json({ message: 'Collection deleted' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete collection' });
    }
};
exports.adminDeleteCollection = adminDeleteCollection;
