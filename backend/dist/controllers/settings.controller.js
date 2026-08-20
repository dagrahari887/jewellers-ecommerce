"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const prisma_1 = require("../lib/prisma");
// GET /api/settings (public)
const getSettings = async (_req, res) => {
    try {
        let settings = await prisma_1.prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma_1.prisma.settings.create({
                data: {
                    id: 'store_settings',
                    storeName: 'Baikunthh Jewellers',
                    contactEmail: 'care@baikunthh.com',
                    contactPhone: '+91 7068580500',
                    whatsappNumber: '+917068580500',
                    instagramLink: 'https://instagram.com/devanshabhushan',
                    gstPercentage: 3,
                    address: 'Premium Jewellery Showroom, Authorized Hallmark Centre',
                    announcement: 'Complimentary Insured Shipping on all Bridal Collections',
                },
            });
        }
        return res.json({ settings });
    }
    catch (error) {
        console.error('Get settings error:', error);
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }
};
exports.getSettings = getSettings;
// PUT /api/admin/settings
const updateSettings = async (req, res) => {
    try {
        const updateData = req.body;
        if (updateData.gstPercentage !== undefined)
            updateData.gstPercentage = Number(updateData.gstPercentage);
        let settings = await prisma_1.prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma_1.prisma.settings.create({
                data: { id: 'store_settings', ...updateData },
            });
        }
        else {
            settings = await prisma_1.prisma.settings.update({
                where: { id: settings.id },
                data: updateData,
            });
        }
        return res.json({ message: 'Settings updated', settings });
    }
    catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({ error: 'Failed to update settings' });
    }
};
exports.updateSettings = updateSettings;
