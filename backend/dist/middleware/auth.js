"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader ||
        !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Access Denied',
        });
    }
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({
            error: 'JWT_SECRET is not configured',
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({
            error: 'Invalid or expired token',
        });
    }
};
exports.authMiddleware = authMiddleware;
const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Authentication required',
        });
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Admin access required',
        });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
