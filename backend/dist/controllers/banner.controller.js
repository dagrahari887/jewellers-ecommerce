"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getAllBanners = exports.getBanners = void 0;
const prisma_1 = require("../lib/prisma");
// GET /api/banners (public - active banners only)
const getBanners = async (_req, res) => {
    try {
        const banners = await prisma_1.prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
        return res.json({ banners });
    }
    catch (error) {
        console.error('Get banners error:', error);
        return res.status(500).json({ error: 'Failed to fetch banners' });
    }
};
exports.getBanners = getBanners;
// GET /api/admin/banners (admin - all banners)
const getAllBanners = async (_req, res) => {
    try {
        const banners = await prisma_1.prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
        return res.json({ banners });
    }
    catch (error) {
        console.error('Get all banners error:', error);
        return res.status(500).json({ error: 'Failed to fetch banners' });
    }
};
exports.getAllBanners = getAllBanners;
// POST /api/admin/banners
const createBanner = async (req, res) => {
    try {
        const { title, subtitle, imageUrl, linkUrl, buttonText, displayOrder, isActive } = req.body;
        if (!imageUrl)
            return res.status(400).json({ error: 'imageUrl is required' });
        const banner = await prisma_1.prisma.banner.create({
            data: {
                id: `banner_${Date.now()}`,
                title: title || null,
                subtitle: subtitle || null,
                imageUrl,
                linkUrl: linkUrl || null,
                buttonText: buttonText || null,
                displayOrder: Number(displayOrder || 0),
                isActive: isActive !== undefined ? Boolean(isActive) : true,
            },
        });
        return res.status(201).json({ message: 'Banner created', banner });
    }
    catch (error) {
        console.error('Create banner error:', error);
        return res.status(500).json({ error: 'Failed to create banner' });
    }
};
exports.createBanner = createBanner;
// PUT /api/admin/banners/:id
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, imageUrl, linkUrl, buttonText, displayOrder, isActive } = req.body;
        const banner = await prisma_1.prisma.banner.update({
            where: { id },
            data: {
                title: title !== undefined ? title : undefined,
                subtitle: subtitle !== undefined ? subtitle : undefined,
                imageUrl: imageUrl || undefined,
                linkUrl: linkUrl !== undefined ? linkUrl : undefined,
                buttonText: buttonText !== undefined ? buttonText : undefined,
                displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
                isActive: isActive !== undefined ? Boolean(isActive) : undefined,
            },
        });
        return res.json({ message: 'Banner updated', banner });
    }
    catch (error) {
        console.error('Update banner error:', error);
        return res.status(500).json({ error: 'Failed to update banner' });
    }
};
exports.updateBanner = updateBanner;
// DELETE /api/admin/banners/:id
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.banner.delete({ where: { id } });
        return res.json({ message: 'Banner deleted' });
    }
    catch (error) {
        console.error('Delete banner error:', error);
        return res.status(500).json({ error: 'Failed to delete banner' });
    }
};
exports.deleteBanner = deleteBanner;
