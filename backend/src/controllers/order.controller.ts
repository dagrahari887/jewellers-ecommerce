import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { calculateProductPrice } from '../logic/pricing';
import { AuthRequest } from '../middleware/auth';

// CREATE ORDER
export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { items: cartItems, address: shippingAddress, couponCode, paymentMethod, notes } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const order = await prisma.$transaction(async (tx) => {
      const rates = await tx.metalRate.findMany();

      // Validate coupon if provided
      let couponRecord: any = null;
      if (couponCode) {
        couponRecord = await tx.coupon.findUnique({ where: { code: String(couponCode).toUpperCase() } });
        if (!couponRecord || !couponRecord.isActive || new Date() > couponRecord.expiryDate) {
          throw new Error('Invalid or expired coupon');
        }
      }

      let subtotal = 0;
      const items: { id: string; productId: string; quantity: number; price: number }[] = [];

      for (const item of cartItems) {
        if (!item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error('Invalid cart item');
        }
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error('Product not found');
        if (product.stock < item.quantity) throw new Error(`${product.name} is out of stock`);

        const price = calculateProductPrice(product, rates);
        if (price <= 0) throw new Error(`Unable to calculate price for ${product.name}`);

        subtotal += price * item.quantity;
        items.push({ id: randomUUID(), productId: product.id, quantity: item.quantity, price });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Calculate coupon discount
      let discountAmount = 0;
      if (couponRecord) {
        if (couponRecord.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(couponRecord.value)) / 100;
          if (couponRecord.maxDiscount) {
            discountAmount = Math.min(discountAmount, Number(couponRecord.maxDiscount));
          }
        } else {
          discountAmount = Number(couponRecord.value);
        }
        discountAmount = Math.min(Math.round(discountAmount), subtotal);

        // Increment usage count
        await tx.coupon.update({
          where: { id: couponRecord.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      const amountAfterDiscount = subtotal - discountAmount;
      // GST is typically inclusive in jewellery pricing (already in product price)
      // Separate GST line for display only
      const settings = await tx.settings.findFirst();
      const gstRate = Number(settings?.gstPercentage || 3) / 100;
      const gstAmount = Math.round(amountAfterDiscount * gstRate / (1 + gstRate)); // extract from inclusive
      const finalAmount = amountAfterDiscount; // GST already included in price

      return tx.order.create({
        data: {
          id: randomUUID(),
          orderNumber: `BJ-${Date.now()}`,
          userId,
          totalAmount: subtotal,
          discountAmount,
          gstAmount,
          finalAmount,
          couponCode: couponRecord?.code || null,
          couponId: couponRecord?.id || null,
          address: shippingAddress,
          status: 'CONFIRMED',
          paymentStatus: 'PENDING',
          paymentMethod: paymentMethod || 'COD',
          notes: notes || null,
          items: { create: items },
        },
        include: { items: { include: { product: { select: { id: true, name: true, slug: true } } } } },
      });
    });

    // Clear server-side cart
    await prisma.cartItem.deleteMany({ where: { cart: { userId } } });

    return res.status(201).json({ message: 'Order created successfully', order });
  } catch (error: any) {
    console.error('Create order error:', error);
    return res.status(400).json({ error: error?.message || 'Failed to create order' });
  }
}

// GET MY ORDERS
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: { take: 1 } },
            },
          },
        },
      },
    });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    return res.status(500).json({ error: 'Unable to load orders' });
  }
};

// ADMIN - GET ALL ORDERS
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: { select: { url: true } } } },
          },
        },
      },
    });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ error: 'Unable to load all orders' });
  }
};

// ADMIN - UPDATE ORDER STATUS
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, trackingUrl } = req.body;

    const allowedStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const allowedPaymentStatuses = ['PENDING', 'PAID', 'FAILED'];

    const updateData: any = {};
    if (status) {
      if (!allowedStatuses.includes(status)) return res.status(400).json({ error: 'Invalid order status' });
      updateData.status = status;
    }
    if (paymentStatus) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) return res.status(400).json({ error: 'Invalid payment status' });
      updateData.paymentStatus = paymentStatus;
    }
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) return res.status(404).json({ error: 'Order not found' });

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { product: { select: { id: true, name: true, slug: true } } } },
      },
    });

    return res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ error: 'Unable to update order status' });
  }
};