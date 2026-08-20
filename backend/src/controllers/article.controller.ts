import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// GET /api/articles (published only, public)
export const getArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, slug: true, description: true, imageUrl: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// GET /api/articles/:slug (public)
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
    });
    if (!article || article.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Article not found' });
    }
    return res.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    return res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// GET /api/admin/articles (admin - all including drafts)
export const getAllArticles = async (_req: AuthRequest, res: Response) => {
  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ articles });
  } catch (error) {
    console.error('Get all articles error:', error);
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// POST /api/admin/articles
export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, content, imageUrl, status } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title and content are required' });

    const slug = slugify(title) + '-' + Date.now().toString().slice(-4);

    const article = await prisma.article.create({
      data: {
        id: randomUUID(),
        title,
        slug,
        description: description || null,
        content,
        imageUrl: imageUrl || null,
        status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        authorId: req.user!.id,
      },
    });
    return res.status(201).json({ message: 'Article created', article });
  } catch (error) {
    console.error('Create article error:', error);
    return res.status(500).json({ error: 'Failed to create article' });
  }
};

// PUT /api/admin/articles/:id
export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, content, imageUrl, status } = req.body;

    const data: any = {};
    if (title !== undefined) { data.title = title; data.slug = slugify(title) + '-' + Date.now().toString().slice(-4); }
    if (description !== undefined) data.description = description;
    if (content !== undefined) data.content = content;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (status !== undefined) data.status = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';

    const article = await prisma.article.update({ where: { id }, data });
    return res.json({ message: 'Article updated', article });
  } catch (error) {
    console.error('Update article error:', error);
    return res.status(500).json({ error: 'Failed to update article' });
  }
};

// DELETE /api/admin/articles/:id
export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.article.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Delete article error:', error);
    return res.status(500).json({ error: 'Failed to delete article' });
  }
};
