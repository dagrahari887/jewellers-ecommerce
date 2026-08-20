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
    <div className="bg-bj-ivory min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <p className="section-eyebrow">Personalized Service</p>
          <h1 className="font-serif text-4xl md:text-5xl text-bj-charcoal mb-4">Book an Appointment</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            Experience our exclusive jewellery collections with a dedicated consultant in our private viewing rooms.
          </p>
        </div>

        {/* Tabs */}
        {user && (
          <div className="flex justify-center mb-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('book')}
              className={`px-8 py-4 text-xs uppercase tracking-widest transition-colors ${activeTab === 'book' ? 'text-bj-gold border-b-2 border-bj-gold font-medium' : 'text-gray-500 hover:text-bj-charcoal'}`}
            >
              Book New
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-8 py-4 text-xs uppercase tracking-widest transition-colors ${activeTab === 'history' ? 'text-bj-gold border-b-2 border-bj-gold font-medium' : 'text-gray-500 hover:text-bj-charcoal'}`}
            >
              My Appointments
            </button>
          </div>
        )}

        {/* Content */}
        {activeTab === 'book' ? (
          <div className="flex flex-col md:flex-row gap-10">
            {/* Form */}
            <div className="flex-1 bg-white p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl text-bj-charcoal mb-8">Appointment Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="label-luxury">Appointment Type *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['SHOPPING', 'BRIDAL', 'CUSTOM'].map(t => (
                      <div 
                        key={t}
                        onClick={() => setType(t)}
                        className={`p-4 border text-center cursor-pointer transition-colors ${type === t ? 'border-bj-gold bg-bj-gold/5 text-bj-gold' : 'border-gray-200 text-gray-500 hover:border-bj-gold/50'}`}
                      >
                        <span className="text-xs font-medium uppercase tracking-widest">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-luxury flex items-center gap-2"><Calendar size={14}/> Date *</label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      className="input-luxury w-full" 
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-luxury flex items-center gap-2"><Clock size={14}/> Time *</label>
                    <input 
                      type="time" 
                      required 
                      className="input-luxury w-full"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-luxury flex items-center gap-2"><FileText size={14}/> Special Requests / Notes</label>
                  <textarea 
                    className="input-luxury w-full min-h-[120px] resize-y" 
                    placeholder="Tell us if you're looking for something specific (e.g., engagement rings, specific collections)..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-gold w-full py-4 text-sm disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Request Appointment'}
                </button>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-4">
                  A consultant will contact you to confirm the appointment.
                </p>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="w-full md:w-80 shrink-0 space-y-6">
              <div className="bg-bj-charcoal text-white p-8">
                <h3 className="font-serif text-xl mb-6">Boutique Information</h3>
                
                <div className="space-y-4 text-sm text-gray-300 font-light">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-bj-gold shrink-0 mt-0.5" />
                    <p>123 Luxury Avenue,<br/>High Street District,<br/>Mumbai, 400001</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-bj-gold shrink-0 mt-0.5" />
                    <p>Mon - Sat: 11:00 AM - 8:00 PM<br/>Sunday: By appointment only</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-bj-gold shrink-0 mt-0.5" />
                    <p>+91 98765 43210<br/>concierge@baikunthh.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 border border-gray-100 shadow-sm">
                <h4 className="font-serif text-lg mb-2 text-bj-charcoal">Why Book?</h4>
                <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4 marker:text-bj-gold">
                  <li>Dedicated consultant for personalized advice</li>
                  <li>Access to exclusive viewing rooms</li>
                  <li>Pre-curated selection based on your preferences</li>
                  <li>No waiting time during peak hours</li>
                </ul>
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