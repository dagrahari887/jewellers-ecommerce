"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const register = async (req, res) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            error: 'Name, email and password are required',
        });
    }
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists',
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                email,
                password: hashedPassword,
                name,
                phone: phone || null,
            },
        });
        return res.status(201).json({
            message: 'Welcome to Baikunthh',
            userId: user.id,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            error: 'Registration failed',
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required',
        });
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
            });
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid credentials',
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                error: 'JWT_SECRET is not configured',
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
        }, secret, {
            expiresIn: '7d',
        });
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            error: 'Login failed',
        });
    }
};
exports.login = login;
