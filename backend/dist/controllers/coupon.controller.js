"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getAllCoupons = exports.validateCoupon = void 0;
const prisma_1 = require("../lib/prisma");
// POST /api/coupons/validate
const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code)
            return res.status(400).json({ error: 'Coupon code required' });
        const coupon = await prisma_1.prisma.coupon.findUnique({ where: { code: String(code).toUpperCase() } });
        if (!coupon)
            return res.status(404).json({ error: 'Invalid coupon code' });
        if (!coupon.isActive)
            return res.status(400).json({ error: 'This coupon is no longer active' });
        if (new Date() > coupon.expiryDate)
            return res.status(400).json({ error: 'This coupon has expired' });
        const amount = Number(orderAmount || 0);
        if (amount < Number(coupon.minOrderAmount)) {
            return res.status(400).json({
                error: `Minimum order amount of ₹${Number(coupon.minOrderAmount).toLocaleString('en-IN')} required`,
            });
        }
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ error: 'This coupon has reached its usage limit' });
        }
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (amount * Number(coupon.value)) / 100;
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
            }
        }
        else {
            discountAmount = Number(coupon.value);
        }
        discountAmount = Math.min(discountAmount, amount);
        return res.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                discountType: coupon.discountType,
                value: Number(coupon.value),
                description: coupon.description,
            },
            discountAmount: Math.round(discountAmount),
        });
    }
    catch (error) {
        console.error('Validate coupon error:', error);
        return res.status(500).json({ error: 'Failed to validate coupon' });
    }
};
exports.validateCoupon = validateCoupon;
// GET /api/admin/coupons
const getAllCoupons = async (_req, res) => {
    try {
        const coupons = await prisma_1.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
        return res.json({ coupons });
    }
    catch (error) {
        console.error('Get coupons error:', error);
        return res.status(500).json({ error: 'Failed to fetch coupons' });
    }
};
exports.getAllCoupons = getAllCoupons;
// POST /api/admin/coupons
const createCoupon = async (req, res) => {
    try {
        const { code, description, discountType, value, minOrderAmount, maxDiscount, expiryDate, usageLimit } = req.body;
        if (!code || !discountType || !value || !expiryDate) {
            return res.status(400).json({ error: 'code, discountType, value, expiryDate are required' });
        }
        const existing = await prisma_1.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
        if (existing)
            return res.status(400).json({ error: 'Coupon code already exists' });
        const coupon = await prisma_1.prisma.coupon.create({
            data: {
                id: `coupon_${Date.now()}`,
                code: code.toUpperCase(),
                description: description || null,
                discountType,
                value: Number(value),
                minOrderAmount: Number(minOrderAmount || 0),
                maxDiscount: maxDiscount ? Number(maxDiscount) : null,
                expiryDate: new Date(expiryDate),
                usageLimit: usageLimit ? Number(usageLimit) : null,
                isActive: true,
            },
        });
        return res.status(201).json({ message: 'Coupon created', coupon });
    }
    catch (error) {
        console.error('Create coupon error:', error);
        return res.status(500).json({ error: 'Failed to create coupon' });
    }
};
exports.createCoupon = createCoupon;
// PUT /api/admin/coupons/:id
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, description, discountType, value, minOrderAmount, maxDiscount, expiryDate, usageLimit, isActive } = req.body;
        const coupon = await prisma_1.prisma.coupon.update({
            where: { id },
            data: {
                code: code ? code.toUpperCase() : undefined,
                description: description !== undefined ? description : undefined,
                discountType: discountType || undefined,
                value: value !== undefined ? Number(value) : undefined,
                minOrderAmount: minOrderAmount !== undefined ? Number(minOrderAmount) : undefined,
                maxDiscount: maxDiscount !== undefined ? (maxDiscount ? Number(maxDiscount) : null) : undefined,
                expiryDate: expiryDate ? new Date(expiryDate) : undefined,
                usageLimit: usageLimit !== undefined ? (usageLimit ? Number(usageLimit) : null) : undefined,
                isActive: isActive !== undefined ? Boolean(isActive) : undefined,
            },
        });
        return res.json({ message: 'Coupon updated', coupon });
    }
    catch (error) {
        console.error('Update coupon error:', error);
        return res.status(500).json({ error: 'Failed to update coupon' });
    }
};
exports.updateCoupon = updateCoupon;
// DELETE /api/admin/coupons/:id
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.coupon.delete({ where: { id } });
        return res.json({ message: 'Coupon deleted' });
    }
    catch (error) {
        console.error('Delete coupon error:', error);
        return res.status(500).json({ error: 'Failed to delete coupon' });
    }
};
exports.deleteCoupon = deleteCoupon;
