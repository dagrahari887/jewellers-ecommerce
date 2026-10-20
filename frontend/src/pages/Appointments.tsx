import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, FileText } from 'lucide-react';
import { useStore, apiRequest } from '../store/useStore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Appointments = () => {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const addToast = useStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('SHOPPING');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (activeTab === 'history' && user) {
      const fetchAppointments = async () => {
        setFetchingHistory(true);
        try {
          const res = await apiRequest('/appointments');
          setAppointments(res.appointments || []);
        } catch (error: any) {
          addToast('error', error.message || 'Failed to fetch appointments');
        } finally {
          setFetchingHistory(false);
        }
      };
      fetchAppointments();
    }
  }, [activeTab, user, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      addToast('info', 'Please sign in to book an appointment');
      navigate('/login?redirect=/appointments');
      return;
    }

    if (!date || !time) {
      addToast('error', 'Please select a valid date and time');
      return;
    }

    setLoading(true);
    try {
      const dateTime = new Date(`${date}T${time}`);
      await apiRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          date: dateTime.toISOString(),
          type,
          notes
        })
      });
      
      addToast('success', 'Appointment request submitted successfully!');
      setDate('');
      setTime('');
      setNotes('');
      setActiveTab('history');
    } catch (error: any) {
      addToast('error', error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-success';
      case 'CANCELLED': return 'badge-error';
      case 'COMPLETED': return 'badge-charcoal';
      default: return 'badge-gold';
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        
        {/* Header */}
        <div className="mb-8 md:mb-10 fade-in">
          <h1 className="page-title mb-3">Book an Appointment</h1>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            Meet a consultant at our showroom for bridal jewellery, a custom design or a closer look at the collection.
          </p>
        </div>

        {/* Tabs */}
        {user && (
          <div className="flex mb-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('book')}
              className={`px-5 sm:px-8 py-4 -mb-px text-xs uppercase tracking-widest transition-colors ${activeTab === 'book' ? 'text-bj-gold border-b-2 border-bj-gold font-medium' : 'text-gray-500 hover:text-bj-charcoal'}`}
            >
              Book New
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-5 sm:px-8 py-4 -mb-px text-xs uppercase tracking-widest transition-colors ${activeTab === 'history' ? 'text-bj-gold border-b-2 border-bj-gold font-medium' : 'text-gray-500 hover:text-bj-charcoal'}`}
            >
              My Appointments
            </button>
          </div>
        )}

        {/* Content */}
        {activeTab === 'book' ? (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Form */}
            <div className="flex-1 bg-white p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl text-bj-charcoal mb-8">Appointment Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <p id="appt-type-label" className="label-luxury">Appointment Type *</p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4" role="group" aria-labelledby="appt-type-label">
                    {['SHOPPING', 'BRIDAL', 'CUSTOM'].map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setType(t)}
                        aria-pressed={type === t}
                        className={`px-2 py-4 border text-center transition-colors ${type === t ? 'border-bj-gold bg-bj-gold/5 text-bj-gold-dark' : 'border-gray-200 text-gray-500 hover:border-bj-gold/50 hover:text-bj-charcoal'}`}
                      >
                        <span className="text-xs font-medium uppercase tracking-widest">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="label-luxury flex items-center gap-2"><Calendar size={14}/> Date *</span>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      className="input-luxury w-full" 
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="label-luxury flex items-center gap-2"><Clock size={14}/> Time *</span>
                    <input 
                      type="time" 
                      required 
                      className="input-luxury w-full"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="label-luxury flex items-center gap-2"><FileText size={14}/> Special Requests / Notes</span>
                  <textarea 
                    className="input-luxury w-full min-h-[120px] resize-y" 
                    placeholder="Tell us if you're looking for something specific (e.g., engagement rings, specific collections)..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  ></textarea>
                </label>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-gold w-full py-4 text-sm disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Request Appointment'}
                </button>
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest mt-4">
                  A consultant will contact you to confirm the appointment.
                </p>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="bg-bj-charcoal text-white p-8">
                <h3 className="font-serif text-xl mb-6">Boutique Information</h3>
                
                <div className="space-y-4 text-sm text-gray-300 font-light">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-bj-gold shrink-0 mt-0.5" />
                    <p>Premium Jewellery Showroom<br/>Authorized Hallmark Centre</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-bj-gold shrink-0 mt-0.5" />
                    <p>
                      <a href="tel:+917068580500" className="hover:text-bj-gold transition-colors">+91 7068580500</a><br/>
                      <a href="mailto:care@baikunthh.com" className="hover:text-bj-gold transition-colors">care@baikunthh.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 md:p-10 shadow-sm border border-gray-100">
            {fetchingHistory ? (
              <LoadingSpinner message="Fetching appointments" />
            ) : appointments.length === 0 ? (
              <div className="text-center py-10">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-serif text-2xl text-bj-charcoal mb-2">No Appointments Yet</h3>
                <p className="text-gray-500 mb-6">You haven't booked any appointments with us.</p>
                <button onClick={() => setActiveTab('book')} className="btn-outline">Book Now</button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt: any) => (
                  <div key={appt.id} className="p-5 border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="badge-charcoal">{appt.type}</span>
                        <span className={getStatusColor(appt.status)}>{appt.status}</span>
                      </div>
                      <p className="font-medium text-bj-charcoal text-lg">
                        {new Date(appt.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(appt.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {appt.notes && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 border border-gray-100">
                          <span className="font-medium">Notes:</span> {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};