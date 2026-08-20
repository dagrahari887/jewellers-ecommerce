"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentStatus = exports.getAllAppointments = exports.getMyAppointments = exports.createAppointment = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
// CUSTOMER - CREATE APPOINTMENT
// POST /api/appointments
const createAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, type, notes } = req.body;
        const allowedTypes = ['BRIDAL', 'CUSTOM', 'SHOPPING'];
        if (!date) {
            return res.status(400).json({ error: 'Appointment date is required' });
        }
        if (!type || !allowedTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid appointment type. Must be BRIDAL, CUSTOM, or SHOPPING' });
        }
        const appointmentDate = new Date(date);
        if (Number.isNaN(appointmentDate.getTime())) {
            return res.status(400).json({ error: 'Invalid appointment date format' });
        }
        if (appointmentDate <= new Date()) {
            return res.status(400).json({ error: 'Appointment must be in the future' });
        }
        const appointment = await prisma_1.prisma.appointment.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                userId,
                date: appointmentDate,
                type,
                notes: notes || null,
                status: 'PENDING',
            },
        });
        return res.status(201).json({ message: 'Appointment booked successfully', appointment });
    }
    catch (error) {
        console.error('Create appointment error:', error);
        return res.status(500).json({ error: 'Failed to book appointment' });
    }
};
exports.createAppointment = createAppointment;
// CUSTOMER - GET MY APPOINTMENTS
// GET /api/appointments
const getMyAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await prisma_1.prisma.appointment.findMany({
            where: { userId },
            orderBy: { date: 'asc' },
        });
        return res.status(200).json({ appointments });
    }
    catch (error) {
        console.error('Get my appointments error:', error);
        return res.status(500).json({ error: 'Unable to load appointments' });
    }
};
exports.getMyAppointments = getMyAppointments;
// ADMIN - GET ALL APPOINTMENTS
// GET /api/admin/appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma_1.prisma.appointment.findMany({
            orderBy: { date: 'asc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });
        return res.status(200).json({ appointments });
    }
    catch (error) {
        console.error('Get all appointments error:', error);
        return res.status(500).json({ error: 'Unable to load appointments' });
    }
};
exports.getAllAppointments = getAllAppointments;
// ADMIN - UPDATE APPOINTMENT STATUS
// PUT /api/admin/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const allowedStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid appointment status. Must be PENDING, CONFIRMED, COMPLETED, or CANCELLED' });
        }
        const existing = await prisma_1.prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        const appointment = await prisma_1.prisma.appointment.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });
        return res.status(200).json({ message: 'Appointment status updated successfully', appointment });
    }
    catch (error) {
        console.error('Update appointment status error:', error);
        return res.status(500).json({ error: 'Unable to update appointment' });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
