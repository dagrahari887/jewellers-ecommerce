"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCustomers = exports.deleteAddress = exports.addAddress = exports.getAddresses = exports.changePassword = exports.updateMe = exports.getMe = void 0;
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
// GET /api/me
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        return res.json({ user });
    }
    catch (error) {
        console.error('Get me error:', error);
        return res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
exports.getMe = getMe;
// PUT /api/me
const updateMe = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: { name: name || undefined, phone: phone !== undefined ? phone : undefined },
            select: { id: true, name: true, email: true, role: true, phone: true },
        });
        return res.json({ message: 'Profile updated', user });
    }
    catch (error) {
        console.error('Update me error:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
};
exports.updateMe = updateMe;
// PUT /api/me/password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const match = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!match)
            return res.status(400).json({ error: 'Current password is incorrect' });
        const hashed = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
        return res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ error: 'Failed to change password' });
    }
};
exports.changePassword = changePassword;
// GET /api/me/addresses
const getAddresses = async (req, res) => {
    try {
        const addresses = await prisma_1.prisma.userAddress.findMany({
            where: { userId: req.user.id },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        return res.json({ addresses });
    }
    catch (error) {
        console.error('Get addresses error:', error);
        return res.status(500).json({ error: 'Failed to fetch addresses' });
    }
};
exports.getAddresses = getAddresses;
// POST /api/me/addresses
const addAddress = async (req, res) => {
    try {
        const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;
        if (!fullName || !phone || !line1 || !city || !state || !pincode) {
            return res.status(400).json({ error: 'fullName, phone, line1, city, state, pincode are required' });
        }
        if (isDefault) {
            await prisma_1.prisma.userAddress.updateMany({
                where: { userId: req.user.id },
                data: { isDefault: false },
            });
        }
        const address = await prisma_1.prisma.userAddress.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                userId: req.user.id,
                label: label || 'Home',
                fullName,
                phone,
                line1,
                line2: line2 || null,
                city,
                state,
                pincode,
                isDefault: Boolean(isDefault),
            },
        });
        return res.status(201).json({ message: 'Address added', address });
    }
    catch (error) {
        console.error('Add address error:', error);
        return res.status(500).json({ error: 'Failed to add address' });
    }
};
exports.addAddress = addAddress;
// DELETE /api/me/addresses/:id
const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await prisma_1.prisma.userAddress.findFirst({ where: { id, userId: req.user.id } });
        if (!address)
            return res.status(404).json({ error: 'Address not found' });
        await prisma_1.prisma.userAddress.delete({ where: { id } });
        return res.json({ message: 'Address deleted' });
    }
    catch (error) {
        console.error('Delete address error:', error);
        return res.status(500).json({ error: 'Failed to delete address' });
    }
};
exports.deleteAddress = deleteAddress;
// GET /api/admin/customers (admin)
const getAllCustomers = async (_req, res) => {
    try {
        const customers = await prisma_1.prisma.user.findMany({
            where: { role: 'CUSTOMER' },
            select: {
                id: true, name: true, email: true, phone: true, createdAt: true,
                _count: { select: { orders: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ customers });
    }
    catch (error) {
        console.error('Get customers error:', error);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
};
exports.getAllCustomers = getAllCustomers;
