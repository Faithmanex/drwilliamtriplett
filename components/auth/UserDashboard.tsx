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
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const bookingSuccess = searchParams.get('booking') === 'success';

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-brand-dark flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-primary" />
                My Consultations
              </h2>
              {consultations.length > 0 && (
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${showFilters ? 'bg-brand-primary text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-brand-dark border border-slate-200'}`}
                >
                  <List size={14} />
                  {showFilters ? 'Hide Filters' : 'Filters'}
                  {(searchQuery || filterStatus !== 'all' || sortBy !== 'newest') && !showFilters && (
                    <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
                  )}
                </button>
              )}
            </div>

            {/* Compact Controls */}
            {consultations.length > 0 && showFilters && (
              <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    aria-label="Search services"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    aria-label="Filter by intake status"
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-slate-700"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="filled">Form Filled</option>
                    <option value="pending">Form Not Filled</option>
                  </select>
                  <select
                    aria-label="Sort consultations"
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-slate-700"
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
              <div className="text-center py-16 px-6 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,24,39,0.02)_0%,transparent_50%))]"></div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mx-auto mb-4 relative z-10">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-2 relative z-10">
                  {consultations.length === 0 ? "No Active Consultations" : "No Matches Found"}
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto relative z-10 leading-relaxed text-sm">
                  {consultations.length === 0 
                    ? "Your scheduled advisory sessions, structural reviews, and coaching packages will appear here." 
                    : "Adjust your filters or search terms to find specific sessions."}
                </p>
                {consultations.length === 0 && (
                  <NavLink
                    to="/services/academic"
                    className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all hover:shadow-lg relative z-10"
                  >
                    Explore Academic Services <ArrowRight size={16} />
                  </NavLink>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConsultations.map((consult) => {
                  return (
                    <NavLink 
                      key={consult.id} 
                      to={`/dashboard/consultation/${consult.id}`}
                      className="block group"
                    >
                      <div className="border border-slate-200 shadow-sm bg-white rounded-2xl p-5 hover:border-brand-primary/40 hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-brand-dark group-hover:text-brand-primary transition-colors pr-4 leading-tight">{consult.service_name}</h3>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {consult.intake_submitted ? (
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 whitespace-nowrap shadow-sm">
                                Form Filled
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Required Action
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t border-slate-100/60">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-700 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100">${consult.price}</span>
                            <span className="text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium">{new Date(consult.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </span>
                          </div>
                          <div className="text-brand-primary opacity-0 group-hover:opacity-100 font-bold flex items-center gap-1.5 transition-all transform translate-x-2 group-hover:translate-x-0">
                            Session Details
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </NavLink>
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