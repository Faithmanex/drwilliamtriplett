import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, BookOpen, Calendar, Clock, LogOut, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { NavLink, useSearchParams } from 'react-router-dom';

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const bookingSuccess = searchParams.get('booking') === 'success';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Consultations
            </h2>
            
            {consultations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No consultations yet.</p>
                <NavLink
                  to="/services/academic"
                  className="inline-flex items-center gap-2 text-brand-primary font-medium hover:underline"
                >
                  Book your first consultation <ArrowRight size={16} />
                </NavLink>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((consult) => (
                  <div key={consult.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-brand-dark">{consult.service_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(consult.status)}`}>
                        {consult.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">${consult.price}</span>
                      {consult.scheduled_at && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(consult.scheduled_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
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