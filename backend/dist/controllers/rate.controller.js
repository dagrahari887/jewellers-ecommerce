"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateRates = exports.updateRate = exports.getAllRates = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
/**
 * GET ALL CURRENT METAL RATES
 * GET /api/rates
 */
const getAllRates = async (_req, res) => {
    try {
        const rates = await prisma_1.prisma.metalRate.findMany({
            orderBy: [
                { metal: 'asc' },
                { purity: 'desc' },
            ],
        });
        return res.json(rates);
    }
    catch (error) {
        console.error('Get rates error:', error);
        return res.status(500).json({
            error: 'Failed to fetch metal rates',
        });
    }
};
exports.getAllRates = getAllRates;
/**
 * UPDATE SINGLE METAL RATE
 * PUT /api/rates/:id
 */
const updateRate = async (req, res) => {
    const { id } = req.params;
    const { rate } = req.body;
    const newRate = Number(rate);
    if (rate === undefined ||
        rate === null ||
        rate === '' ||
        !Number.isFinite(newRate) ||
        newRate <= 0) {
        return res.status(400).json({
            error: 'Please provide a valid positive rate',
        });
    }
    try {
        const updatedRate = await prisma_1.prisma.$transaction(async (tx) => {
            const currentRate = await tx.metalRate.findUnique({
                where: { id },
            });
            if (!currentRate) {
                throw new Error('RATE_NOT_FOUND');
            }
            // Save old rate in history
            await tx.rateHistory.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    metal: currentRate.metal,
                    purity: currentRate.purity,
                    rate: currentRate.rate,
                },
            });
            // Update current rate
            return await tx.metalRate.update({
                where: { id },
                data: {
                    rate: newRate,
                },
            });
        });
        return res.json({
            message: 'Rate updated successfully',
            updatedRate,
        });
    }
    catch (error) {
        console.error('Update rate error:', error);
        if (error.message === 'RATE_NOT_FOUND') {
            return res.status(404).json({
                error: 'Rate record not found',
            });
        }
        return res.status(500).json({
            error: 'Failed to update metal rate',
        });
    }
};
exports.updateRate = updateRate;
/**
 * BULK UPDATE METAL RATES
 * POST /api/rates/bulk
 */
const bulkUpdateRates = async (req, res) => {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
            error: 'Please provide a valid updates array',
        });
    }
    try {
        const updatedRates = await prisma_1.prisma.$transaction(async (tx) => {
            const results = [];
            for (const update of updates) {
                const newRate = Number(update.rate);
                if (!update.id ||
                    !Number.isFinite(newRate) ||
                    newRate <= 0) {
                    throw new Error('INVALID_RATE');
                }
                const currentRate = await tx.metalRate.findUnique({
                    where: {
                        id: update.id,
                    },
                });
                if (!currentRate) {
                    throw new Error('RATE_NOT_FOUND');
                }
                // Save previous rate in history
                await tx.rateHistory.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        metal: currentRate.metal,
                        purity: currentRate.purity,
                        rate: currentRate.rate,
                    },
                });
                // Update rate
                const updated = await tx.metalRate.update({
                    where: {
                        id: update.id,
                    },
                    data: {
                        rate: newRate,
                    },
                });
                results.push(updated);
            }
            return results;
        });
        return res.json({
            message: 'All rates updated successfully',
            updatedRates,
        });
    }
    catch (error) {
        console.error('Bulk rate update error:', error);
        if (error.message === 'INVALID_RATE') {
            return res.status(400).json({
                error: 'One or more rates are invalid',
            });
        }
        if (error.message === 'RATE_NOT_FOUND') {
            return res.status(404).json({
                error: 'One or more rate records were not found',
            });
        }
        return res.status(500).json({
            error: 'Failed to update bulk rates',
        });
    }
};
exports.bulkUpdateRates = bulkUpdateRates;
