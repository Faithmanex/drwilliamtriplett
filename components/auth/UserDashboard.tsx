import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, BookOpen, Calendar, Clock, LogOut, ArrowRight, CheckCircle, XCircle, List, Search } from 'lucide-react';
import { NavLink, useSearchParams } from 'react-router-dom';

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [intakeForms, setIntakeForms] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const bookingSuccess = searchParams.get('booking') === 'success';

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      const { data: consultData } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setConsultations(consultData || []);

      // Fetch intake forms
      const { data: intakeData } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('user_id', user.id);
      setIntakeForms(intakeData || []);

      const { data: purchaseData } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPurchases(purchaseData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  // Derived state for filtered consultations
  const filteredConsultations = consultations
    .filter(consult => {
      const matchesSearch = consult.service_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'filled' && consult.intake_submitted) || 
        (filterStatus === 'pending' && !consult.intake_submitted);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-high': return b.price - a.price;
        case 'price-low': return a.price - b.price;
        default: return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pt-20">
      {/* Success Banner */}
      {bookingSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-medium">Booking successful! Dr. Triplett will contact you within 24-48 hours.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-brand-dark py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
            </h1>
            <p className="text-slate-300 mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <NavLink
            to="/services/academic"
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-primary/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark">Book Consultation</h3>
                <p className="text-sm text-slate-500">Schedule a session</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/services"
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-primary/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark">Browse Services</h3>
                <p className="text-sm text-slate-500">View all services</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/books"
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-primary/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark">Browse Books</h3>
                <p className="text-sm text-slate-500">Purchase publications</p>
              </div>
            </div>
          </NavLink>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark">Your Profile</h3>
                <p className="text-sm text-slate-500">{profile?.institution || 'Complete your profile'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consultations */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              My Consultations
            </h2>

            {/* Controls */}
            {consultations.length > 0 && (
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    aria-label="Search services"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    aria-label="Filter by intake status"
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium text-slate-700"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="filled">Form Filled</option>
                    <option value="pending">Form Not Filled</option>
                  </select>
                  <select
                    aria-label="Sort consultations"
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium text-slate-700"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>
            )}
            
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">
                  {consultations.length === 0 ? "No consultations yet." : "No matching consultations found."}
                </p>
                {consultations.length === 0 && (
                  <NavLink
                    to="/services/academic"
                    className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
                  >
                    Book your first consultation <ArrowRight size={16} />
                  </NavLink>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConsultations.map((consult) => {
                  const isFaculty = ['faculty-strategy', 'publication-strategy', 'promotion-tenure', 'executive-academic'].includes(consult.service_id);
                  const intakeRoute = isFaculty ? '/intake/faculty' : '/intake/dissertation';
                  const isExpanded = expandedId === consult.id;
                  const form = intakeForms.find(f => f.consultation_id === consult.id);

                  return (
                    <div key={consult.id} className={`border border-slate-200 shadow-sm transition-all duration-300 ${isExpanded ? 'bg-slate-50 border-brand-primary' : 'bg-white'} rounded-xl overflow-hidden`}>
                      <div 
                        className="p-4 cursor-pointer hover:bg-slate-50/50"
                        onClick={() => setExpandedId(isExpanded ? null : consult.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-brand-dark">{consult.service_name}</h3>
                          <div className="flex flex-col items-end gap-1">
                            {consult.intake_submitted ? (
                              <span className="px-2 py-1 rounded-full text-[10px] font-bold border bg-green-100 text-green-700 border-green-200 whitespace-nowrap">
                                Form Filled
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-[10px] font-bold border bg-amber-100 text-amber-700 border-amber-200 whitespace-nowrap">
                                Action Needed
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-600 font-medium">${consult.price}</span>
                            <span className="text-slate-400">|</span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(consult.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-brand-primary font-bold flex items-center gap-1">
                            {isExpanded ? 'Close' : 'View Details'}
                            <ArrowRight size={12} className={`transition-transform duration-300 ${isExpanded ? '-rotate-90' : ''}`} />
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            {/* Left: Summary */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Session Info</h4>
                                <div className="bg-white border border-slate-100 rounded-lg p-3 space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Service ID</span>
                                    <span className="text-slate-700 font-mono">{consult.service_id}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Scheduled For</span>
                                    <span className="text-slate-700">{consult.scheduled_at ? new Date(consult.scheduled_at).toLocaleString() : 'Pending review'}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Next Steps</h4>
                                <div className="bg-brand-dark text-slate-200 rounded-lg p-3 text-xs leading-relaxed">
                                  {!consult.intake_submitted ? (
                                    <p>Please complete your intake form. Dr. Triplett requires this information to prepare for your specific academic context.</p>
                                  ) : (
                                    <p>Your intake form is under review. You will receive an email to finalize your session time within 48 business hours.</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right: Intake Form Summary */}
                            <div>
                               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Submission Details</h4>
                               {form ? (
                                 <div className="bg-white border border-slate-100 rounded-lg p-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                                   <div className="space-y-3">
                                     {Object.entries(form.data || {}).map(([key, value]) => {
                                       if (key === 'acknowledgment' || !value) return null;
                                       const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                                       return (
                                         <div key={key}>
                                           <p className="text-[10px] font-bold text-slate-400">{formattedKey}</p>
                                           <p className="text-xs text-slate-700 mt-0.5">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                                         </div>
                                       );
                                     })}
                                   </div>
                                 </div>
                               ) : (
                                 <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                                   <p className="text-xs text-amber-700 mb-3">No intake data available yet.</p>
                                   <NavLink
                                      to={`${intakeRoute}/${consult.id}`}
                                      className="inline-block bg-brand-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-md hover:bg-brand-dark transition-colors"
                                    >
                                      Fill Intake Form
                                    </NavLink>
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Purchases */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              My Purchases
            </h2>
            
            {purchases.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No purchases yet.</p>
                <NavLink
                  to="/books"
                  className="inline-flex items-center gap-2 text-brand-primary font-medium hover:underline"
                >
                  Browse our books <ArrowRight size={16} />
                </NavLink>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-brand-dark">{purchase.book_id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </div>
                    <span className="text-slate-600 text-sm">${purchase.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;