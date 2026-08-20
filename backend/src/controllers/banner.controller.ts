import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// GET /api/banners (public - active banners only)
export const getBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return res.json({ banners });
  } catch (error) {
    console.error('Get banners error:', error);
    return res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

// GET /api/admin/banners (admin - all banners)
export const getAllBanners = async (_req: AuthRequest, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
    return res.json({ banners });
  } catch (error) {
    console.error('Get all banners error:', error);
    return res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

// POST /api/admin/banners
export const createBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, buttonText, displayOrder, isActive } = req.body;

    if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

    const banner = await prisma.banner.create({
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
  } catch (error) {
    console.error('Create banner error:', error);
    return res.status(500).json({ error: 'Failed to create banner' });
  }
};

// PUT /api/admin/banners/:id
export const updateBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, imageUrl, linkUrl, buttonText, displayOrder, isActive } = req.body;

    const banner = await prisma.banner.update({
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
  } catch (error) {
    console.error('Update banner error:', error);
    return res.status(500).json({ error: 'Failed to update banner' });
  }
};

// DELETE /api/admin/banners/:id
export const deleteBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({ where: { id } });
    return res.json({ message: 'Banner deleted' });
  } catch (error) {
    console.error('Delete banner error:', error);
    return res.status(500).json({ error: 'Failed to delete banner' });
  }
};
