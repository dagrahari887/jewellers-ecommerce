import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// GET /api/reviews?productId=xxx
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ error: 'productId required' });

    const reviews = await prisma.review.findMany({
      where: { productId: String(productId), isApproved: true },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, count: reviews.length });
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// POST /api/reviews (auth required)
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ error: 'productId and rating are required' });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if already reviewed
    const existing = await prisma.review.findFirst({
      where: { userId, productId },
    });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: {
        id: randomUUID(),
        userId,
        productId,
        rating: ratingNum,
        title: title || null,
        comment: comment || null,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
};

// GET /api/admin/reviews (admin)
export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ reviews });
  } catch (error) {
    console.error('Get all reviews error:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// PUT /api/admin/reviews/:id/approve (admin)
export const toggleReviewApproval = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });
    return res.json({ message: 'Review updated', review });
  } catch (error) {
    console.error('Toggle review error:', error);
    return res.status(500).json({ error: 'Failed to update review' });
  }
};

// DELETE /api/admin/reviews/:id (admin)
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    return res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
};
