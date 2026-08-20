"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const auth = __importStar(require("../controllers/auth.controller"));
const product = __importStar(require("../controllers/product.controller"));
const productAdmin = __importStar(require("../controllers/product.admin.controller"));
const order = __importStar(require("../controllers/order.controller"));
const rate = __importStar(require("../controllers/rate.controller"));
const appointment = __importStar(require("../controllers/appointment.controller"));
const review = __importStar(require("../controllers/review.controller"));
const coupon = __importStar(require("../controllers/coupon.controller"));
const banner = __importStar(require("../controllers/banner.controller"));
const article = __importStar(require("../controllers/article.controller"));
const settings = __importStar(require("../controllers/settings.controller"));
const user = __importStar(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
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
router.post('/reviews', auth_1.authMiddleware, review.createReview);
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
router.put('/rates/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, rate.updateRate);
router.post('/rates/bulk', auth_1.authMiddleware, auth_1.authorizeAdmin, rate.bulkUpdateRates);
// ======================
// ORDERS (Auth required)
// ======================
router.post('/orders', auth_1.authMiddleware, order.createOrder);
router.get('/orders', auth_1.authMiddleware, order.getMyOrders);
// ======================
// USER PROFILE (Auth required)
// ======================
router.get('/me', auth_1.authMiddleware, user.getMe);
router.put('/me', auth_1.authMiddleware, user.updateMe);
router.put('/me/password', auth_1.authMiddleware, user.changePassword);
router.get('/me/addresses', auth_1.authMiddleware, user.getAddresses);
router.post('/me/addresses', auth_1.authMiddleware, user.addAddress);
router.delete('/me/addresses/:id', auth_1.authMiddleware, user.deleteAddress);
// ======================
// APPOINTMENTS (Auth required)
// ======================
router.post('/appointments', auth_1.authMiddleware, appointment.createAppointment);
router.get('/appointments', auth_1.authMiddleware, appointment.getMyAppointments);
// ======================
// ADMIN — ORDERS
// ======================
router.get('/admin/orders', auth_1.authMiddleware, auth_1.authorizeAdmin, order.getAllOrders);
router.put('/admin/orders/:id/status', auth_1.authMiddleware, auth_1.authorizeAdmin, order.updateOrderStatus);
// ======================
// ADMIN — PRODUCTS
// ======================
router.get('/admin/products', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminGetProducts);
router.post('/admin/products', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminCreateProduct);
router.put('/admin/products/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminUpdateProduct);
router.delete('/admin/products/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminDeleteProduct);
router.put('/admin/products/:id/stock', auth_1.authMiddleware, auth_1.authorizeAdmin, product.updateProductStock);
// ======================
// ADMIN — CATEGORIES
// ======================
router.get('/admin/categories', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminGetCategories);
router.post('/admin/categories', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminCreateCategory);
router.put('/admin/categories/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminUpdateCategory);
router.delete('/admin/categories/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminDeleteCategory);
// ======================
// ADMIN — COLLECTIONS
// ======================
router.get('/admin/collections', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminGetCollections);
router.post('/admin/collections', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminCreateCollection);
router.put('/admin/collections/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminUpdateCollection);
router.delete('/admin/collections/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, productAdmin.adminDeleteCollection);
// ======================
// ADMIN — APPOINTMENTS
// ======================
router.get('/admin/appointments', auth_1.authMiddleware, auth_1.authorizeAdmin, appointment.getAllAppointments);
router.put('/admin/appointments/:id/status', auth_1.authMiddleware, auth_1.authorizeAdmin, appointment.updateAppointmentStatus);
// ======================
// ADMIN — REVIEWS
// ======================
router.get('/admin/reviews', auth_1.authMiddleware, auth_1.authorizeAdmin, review.getAllReviews);
router.put('/admin/reviews/:id/approve', auth_1.authMiddleware, auth_1.authorizeAdmin, review.toggleReviewApproval);
router.delete('/admin/reviews/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, review.deleteReview);
// ======================
// ADMIN — COUPONS
// ======================
router.get('/admin/coupons', auth_1.authMiddleware, auth_1.authorizeAdmin, coupon.getAllCoupons);
router.post('/admin/coupons', auth_1.authMiddleware, auth_1.authorizeAdmin, coupon.createCoupon);
router.put('/admin/coupons/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, coupon.updateCoupon);
router.delete('/admin/coupons/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, coupon.deleteCoupon);
// ======================
// ADMIN — BANNERS
// ======================
router.get('/admin/banners', auth_1.authMiddleware, auth_1.authorizeAdmin, banner.getAllBanners);
router.post('/admin/banners', auth_1.authMiddleware, auth_1.authorizeAdmin, banner.createBanner);
router.put('/admin/banners/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, banner.updateBanner);
router.delete('/admin/banners/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, banner.deleteBanner);
// ======================
// ADMIN — ARTICLES (CMS)
// ======================
router.get('/admin/articles', auth_1.authMiddleware, auth_1.authorizeAdmin, article.getAllArticles);
router.post('/admin/articles', auth_1.authMiddleware, auth_1.authorizeAdmin, article.createArticle);
router.put('/admin/articles/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, article.updateArticle);
router.delete('/admin/articles/:id', auth_1.authMiddleware, auth_1.authorizeAdmin, article.deleteArticle);
// ======================
// ADMIN — SETTINGS
// ======================
router.put('/admin/settings', auth_1.authMiddleware, auth_1.authorizeAdmin, settings.updateSettings);
// ======================
// ADMIN — CUSTOMERS
// ======================
router.get('/admin/customers', auth_1.authMiddleware, auth_1.authorizeAdmin, user.getAllCustomers);
exports.default = router;
