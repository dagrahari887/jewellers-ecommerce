"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getAllArticles = exports.getArticleBySlug = exports.getArticles = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// GET /api/articles (published only, public)
const getArticles = async (_req, res) => {
    try {
        const articles = await prisma_1.prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { id: true, title: true, slug: true, description: true, imageUrl: true, createdAt: true, updatedAt: true },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ articles });
    }
    catch (error) {
        console.error('Get articles error:', error);
        return res.status(500).json({ error: 'Failed to fetch articles' });
    }
};
exports.getArticles = getArticles;
// GET /api/articles/:slug (public)
const getArticleBySlug = async (req, res) => {
    try {
        const article = await prisma_1.prisma.article.findUnique({
            where: { slug: req.params.slug },
        });
        if (!article || article.status !== 'PUBLISHED') {
            return res.status(404).json({ error: 'Article not found' });
        }
        return res.json({ article });
    }
    catch (error) {
        console.error('Get article error:', error);
        return res.status(500).json({ error: 'Failed to fetch article' });
    }
};
exports.getArticleBySlug = getArticleBySlug;
// GET /api/admin/articles (admin - all including drafts)
const getAllArticles = async (_req, res) => {
    try {
        const articles = await prisma_1.prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
        return res.json({ articles });
    }
    catch (error) {
        console.error('Get all articles error:', error);
        return res.status(500).json({ error: 'Failed to fetch articles' });
    }
};
exports.getAllArticles = getAllArticles;
// POST /api/admin/articles
const createArticle = async (req, res) => {
    try {
        const { title, description, content, imageUrl, status } = req.body;
        if (!title || !content)
            return res.status(400).json({ error: 'title and content are required' });
        const slug = slugify(title) + '-' + Date.now().toString().slice(-4);
        const article = await prisma_1.prisma.article.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                title,
                slug,
                description: description || null,
                content,
                imageUrl: imageUrl || null,
                status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
                authorId: req.user.id,
            },
        });
        return res.status(201).json({ message: 'Article created', article });
    }
    catch (error) {
        console.error('Create article error:', error);
        return res.status(500).json({ error: 'Failed to create article' });
    }
};
exports.createArticle = createArticle;
// PUT /api/admin/articles/:id
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, imageUrl, status } = req.body;
        const data = {};
        if (title !== undefined) {
            data.title = title;
            data.slug = slugify(title) + '-' + Date.now().toString().slice(-4);
        }
        if (description !== undefined)
            data.description = description;
        if (content !== undefined)
            data.content = content;
        if (imageUrl !== undefined)
            data.imageUrl = imageUrl;
        if (status !== undefined)
            data.status = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
        const article = await prisma_1.prisma.article.update({ where: { id }, data });
        return res.json({ message: 'Article updated', article });
    }
    catch (error) {
        console.error('Update article error:', error);
        return res.status(500).json({ error: 'Failed to update article' });
    }
};
exports.updateArticle = updateArticle;
// DELETE /api/admin/articles/:id
const deleteArticle = async (req, res) => {
    try {
        await prisma_1.prisma.article.delete({ where: { id: req.params.id } });
        return res.json({ message: 'Article deleted' });
    }
    catch (error) {
        console.error('Delete article error:', error);
        return res.status(500).json({ error: 'Failed to delete article' });
    }
};
exports.deleteArticle = deleteArticle;
