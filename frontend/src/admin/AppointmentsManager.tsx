import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Calendar,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  type: string;
  status: string;
  notes: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
}

export const AppointmentsManager = () => {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setError('Admin login required.');
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/api/admin/appointments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error(
        'Failed to load appointments:',
        err
      );

      setError(
        'Unable to retrieve consultation requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (
    appointmentId: string,
    status: string
  ) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:5000/api/admin/appointments/${appointmentId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAppointments();
    } catch (err) {
      console.error(
        'Failed to update appointment status:',
        err
      );

      alert('Failed to update appointment status.');
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);

    return {
      day: d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),

      time: d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';

      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';

      case 'CANCELLED':
        return 'bg-red-50 text-red-600 border-red-200';

      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-bj-gold/10 p-12 text-center">
        <div className="w-8 h-8 border-2 border-bj-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />

        <p className="font-serif text-lg text-bj-charcoal">
          Loading appointments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-100 p-12 text-center">
        <p className="text-red-600 mb-5">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchAppointments}
          className="bg-bj-charcoal text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-bj-gold transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white border border-bj-gold/10 p-16 text-center">
        <Calendar
          size={40}
          className="text-bj-gold mx-auto mb-5"
        />

        <h2 className="font-serif text-2xl text-bj-charcoal">
          No Consultation Requests
        </h2>

        <p className="text-gray-500 mt-2">
          Customer appointments will appear here.
        </p>

        <button
          type="button"
          onClick={fetchAppointments}
          className="mt-6 border border-bj-charcoal px-6 py-3 text-xs uppercase tracking-widest hover:bg-bj-charcoal hover:text-white transition"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-bj-charcoal italic">
            Consultation Requests
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage customer appointments and consultations.
          </p>
        </div>

        <div className="text-xs uppercase tracking-widest text-bj-gold font-bold">
          {appointments.length} Total
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-5">

        {appointments.map((appointment) => {
          const { day, time } = formatDate(
            appointment.date
          );

          return (
            <div
              key={appointment.id}
              className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
            >

              <div className="grid grid-cols-1 lg:grid-cols-3">

                {/* Appointment */}
                <div className="p-7 bg-bj-ivory/50 border-b lg:border-b-0 lg:border-r border-gray-100">

                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-[10px] uppercase tracking-widest font-bold ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {appointment.status ===
                      'PENDING' && (
                      <AlertCircle size={12} />
                    )}

                    {appointment.status ===
                      'CONFIRMED' && (
                      <CheckCircle2 size={12} />
                    )}

                    {appointment.status ===
                      'COMPLETED' && (
                      <CheckCircle2 size={12} />
                    )}

                    {appointment.status ===
                      'CANCELLED' && (
                      <XCircle size={12} />
                    )}

                    {appointment.status}
                  </div>

                  <h3 className="font-serif text-2xl text-bj-charcoal mt-5">
                    {appointment.type}
                  </h3>

                  <div className="space-y-3 mt-5 text-sm text-gray-600">

                    <div className="flex items-center gap-3">
                      <Calendar
                        size={15}
                        className="text-bj-gold"
                      />

                      {day}
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock
                        size={15}
                        className="text-bj-gold"
                      />

                      {time}
                    </div>

                  </div>
                </div>

                {/* Customer */}
                <div className="p-7 border-b lg:border-b-0 lg:border-r border-gray-100">

                  <p className="text-[10px] uppercase tracking-widest text-bj-gold font-bold mb-5">
                    Customer
                  </p>

                  <h3 className="font-serif text-xl text-bj-charcoal">
                    {appointment.user.name}
                  </h3>

                  <div className="space-y-3 mt-5 text-sm text-gray-500">

                    <div className="flex items-center gap-3">
                      <Mail size={14} />
                      <span className="break-all">
                        {appointment.user.email}
                      </span>
                    </div>

                    {appointment.user.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={14} />
                        {appointment.user.phone}
                      </div>
                    )}

                  </div>
                </div>

                {/* Notes + Status */}
                <div className="p-7 flex flex-col justify-between">

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4 flex items-center gap-2">
                      <MessageSquare size={13} />
                      Requirements
                    </p>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {appointment.notes ||
                        'No specific requirements provided.'}
                    </p>
                  </div>

                  <div className="mt-8">

                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">
                      Update Status
                    </label>

                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        updateStatus(
                          appointment.id,
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-200 bg-white px-4 py-3 text-xs uppercase tracking-widest outline-none focus:border-bj-gold"
                    >
                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="CONFIRMED">
                        Confirmed
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>

                  </div>

                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};