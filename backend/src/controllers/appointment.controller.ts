import { randomUUID } from 'crypto';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// CUSTOMER - CREATE APPOINTMENT
// POST /api/appointments
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
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

    const appointment = await prisma.appointment.create({
      data: {
        id: randomUUID(),
        userId,
        date: appointmentDate,
        type,
        notes: notes || null,
        status: 'PENDING',
      },
    });

    return res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    return res.status(500).json({ error: 'Failed to book appointment' });
  }
};

// CUSTOMER - GET MY APPOINTMENTS
// GET /api/appointments
export const getMyAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    return res.status(200).json({ appointments });
  } catch (error: any) {
    console.error('Get my appointments error:', error);
    return res.status(500).json({ error: 'Unable to load appointments' });
  }
};

// ADMIN - GET ALL APPOINTMENTS
// GET /api/admin/appointments
export const getAllAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return res.status(200).json({ appointments });
  } catch (error: any) {
    console.error('Get all appointments error:', error);
    return res.status(500).json({ error: 'Unable to load appointments' });
  }
};

// ADMIN - UPDATE APPOINTMENT STATUS
// PUT /api/admin/appointments/:id/status
export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid appointment status. Must be PENDING, CONFIRMED, COMPLETED, or CANCELLED' });
    }

    const existing = await prisma.appointment.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return res.status(200).json({ message: 'Appointment status updated successfully', appointment });
  } catch (error: any) {
    console.error('Update appointment status error:', error);
    return res.status(500).json({ error: 'Unable to update appointment' });
  }
};