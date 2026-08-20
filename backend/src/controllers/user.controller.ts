import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// GET /api/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// PUT /api/me
export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name: name || undefined, phone: phone !== undefined ? phone : undefined },
      select: { id: true, name: true, email: true, role: true, phone: true },
    });
    return res.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Update me error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

// PUT /api/me/password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
};

// GET /api/me/addresses
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    return res.json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    return res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// POST /api/me/addresses
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;
    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      return res.status(400).json({ error: 'fullName, phone, line1, city, state, pincode are required' });
    }

    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.userAddress.create({
      data: {
        id: randomUUID(),
        userId: req.user!.id,
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
  } catch (error) {
    console.error('Add address error:', error);
    return res.status(500).json({ error: 'Failed to add address' });
  }
};

// DELETE /api/me/addresses/:id
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const address = await prisma.userAddress.findFirst({ where: { id, userId: req.user!.id } });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    await prisma.userAddress.delete({ where: { id } });
    return res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    return res.status(500).json({ error: 'Failed to delete address' });
  }
};

// GET /api/admin/customers (admin)
export const getAllCustomers = async (_req: AuthRequest, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true, name: true, email: true, phone: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ customers });
  } catch (error) {
    console.error('Get customers error:', error);
    return res.status(500).json({ error: 'Failed to fetch customers' });
  }
};
