import { Router } from 'express';
import { authMiddleware, authorizeAdmin } from '../middleware/auth';

import * as auth from '../controllers/auth.controller';
import * as product from '../controllers/product.controller';
import * as productAdmin from '../controllers/product.admin.controller';
import * as order from '../controllers/order.controller';
import * as rate from '../controllers/rate.controller';
import * as appointment from '../controllers/appointment.controller';
import * as review from '../controllers/review.controller';
import * as coupon from '../controllers/coupon.controller';
import * as banner from '../controllers/banner.controller';
import * as article from '../controllers/article.controller';
import * as settings from '../controllers/settings.controller';
import * as user from '../controllers/user.controller';

const router = Router();

// ======================
// AUTH
// ======================
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// ======================
// PRODUCTS (Public)
// ======================
router.get('/products', product.getProducts);
router.get('/products/:slug', product.getProductBySlug);

// ======================
// CATEGORIES & COLLECTIONS (Public)
// ======================
router.get('/categories', productAdmin.getCategories);
router.get('/collections', productAdmin.getCollections);

// ======================
// REVIEWS
// ======================
router.get('/reviews', review.getProductReviews);
router.post('/reviews', authMiddleware, review.createReview);

// ======================
// BANNERS (Public)
// ======================
router.get('/banners', banner.getBanners);

// ======================
// ARTICLES (Public)
// ======================
router.get('/articles', article.getArticles);
router.get('/articles/:slug', article.getArticleBySlug);

// ======================
// SETTINGS (Public)
// ======================
router.get('/settings', settings.getSettings);

// ======================
// COUPONS
// ======================
router.post('/coupons/validate', coupon.validateCoupon);

// ======================
// METAL RATES (Public read, Admin write)
// ======================
router.get('/rates', rate.getAllRates);
router.put('/rates/:id', authMiddleware, authorizeAdmin, rate.updateRate);
router.post('/rates/bulk', authMiddleware, authorizeAdmin, rate.bulkUpdateRates);

// ======================
// ORDERS (Auth required)
// ======================
router.post('/orders', authMiddleware, order.createOrder);
router.get('/orders', authMiddleware, order.getMyOrders);

// ======================
// USER PROFILE (Auth required)
// ======================
router.get('/me', authMiddleware, user.getMe);
router.put('/me', authMiddleware, user.updateMe);
router.put('/me/password', authMiddleware, user.changePassword);
router.get('/me/addresses', authMiddleware, user.getAddresses);
router.post('/me/addresses', authMiddleware, user.addAddress);
router.delete('/me/addresses/:id', authMiddleware, user.deleteAddress);

// ======================
// APPOINTMENTS (Auth required)
// ======================
router.post('/appointments', authMiddleware, appointment.createAppointment);
router.get('/appointments', authMiddleware, appointment.getMyAppointments);

// ======================
// ADMIN — ORDERS
// ======================
router.get('/admin/orders', authMiddleware, authorizeAdmin, order.getAllOrders);
router.put('/admin/orders/:id/status', authMiddleware, authorizeAdmin, order.updateOrderStatus);

// ======================
// ADMIN — PRODUCTS
// ======================
router.get('/admin/products', authMiddleware, authorizeAdmin, productAdmin.adminGetProducts);
router.post('/admin/products', authMiddleware, authorizeAdmin, productAdmin.adminCreateProduct);
router.put('/admin/products/:id', authMiddleware, authorizeAdmin, productAdmin.adminUpdateProduct);
router.delete('/admin/products/:id', authMiddleware, authorizeAdmin, productAdmin.adminDeleteProduct);
router.put('/admin/products/:id/stock', authMiddleware, authorizeAdmin, product.updateProductStock);

// ======================
// ADMIN — CATEGORIES
// ======================
router.get('/admin/categories', authMiddleware, authorizeAdmin, productAdmin.adminGetCategories);
router.post('/admin/categories', authMiddleware, authorizeAdmin, productAdmin.adminCreateCategory);
router.put('/admin/categories/:id', authMiddleware, authorizeAdmin, productAdmin.adminUpdateCategory);
router.delete('/admin/categories/:id', authMiddleware, authorizeAdmin, productAdmin.adminDeleteCategory);

// ======================
// ADMIN — COLLECTIONS
// ======================
router.get('/admin/collections', authMiddleware, authorizeAdmin, productAdmin.adminGetCollections);
router.post('/admin/collections', authMiddleware, authorizeAdmin, productAdmin.adminCreateCollection);
router.put('/admin/collections/:id', authMiddleware, authorizeAdmin, productAdmin.adminUpdateCollection);
router.delete('/admin/collections/:id', authMiddleware, authorizeAdmin, productAdmin.adminDeleteCollection);

// ======================
// ADMIN — APPOINTMENTS
// ======================
router.get('/admin/appointments', authMiddleware, authorizeAdmin, appointment.getAllAppointments);
router.put('/admin/appointments/:id/status', authMiddleware, authorizeAdmin, appointment.updateAppointmentStatus);

// ======================
// ADMIN — REVIEWS
// ======================
router.get('/admin/reviews', authMiddleware, authorizeAdmin, review.getAllReviews);
router.put('/admin/reviews/:id/approve', authMiddleware, authorizeAdmin, review.toggleReviewApproval);
router.delete('/admin/reviews/:id', authMiddleware, authorizeAdmin, review.deleteReview);

// ======================
// ADMIN — COUPONS
// ======================
router.get('/admin/coupons', authMiddleware, authorizeAdmin, coupon.getAllCoupons);
router.post('/admin/coupons', authMiddleware, authorizeAdmin, coupon.createCoupon);
router.put('/admin/coupons/:id', authMiddleware, authorizeAdmin, coupon.updateCoupon);
router.delete('/admin/coupons/:id', authMiddleware, authorizeAdmin, coupon.deleteCoupon);

// ======================
// ADMIN — BANNERS
// ======================
router.get('/admin/banners', authMiddleware, authorizeAdmin, banner.getAllBanners);
router.post('/admin/banners', authMiddleware, authorizeAdmin, banner.createBanner);
router.put('/admin/banners/:id', authMiddleware, authorizeAdmin, banner.updateBanner);
router.delete('/admin/banners/:id', authMiddleware, authorizeAdmin, banner.deleteBanner);

// ======================
// ADMIN — ARTICLES (CMS)
// ======================
router.get('/admin/articles', authMiddleware, authorizeAdmin, article.getAllArticles);
router.post('/admin/articles', authMiddleware, authorizeAdmin, article.createArticle);
router.put('/admin/articles/:id', authMiddleware, authorizeAdmin, article.updateArticle);
router.delete('/admin/articles/:id', authMiddleware, authorizeAdmin, article.deleteArticle);

// ======================
// ADMIN — SETTINGS
// ======================
router.put('/admin/settings', authMiddleware, authorizeAdmin, settings.updateSettings);

// ======================
// ADMIN — CUSTOMERS
// ======================
router.get('/admin/customers', authMiddleware, authorizeAdmin, user.getAllCustomers);

export default router;