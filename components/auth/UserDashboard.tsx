import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, BookOpen, Calendar, Clock, LogOut, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Load consultations
      const { data: consultData } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setConsultations(consultData || []);

      // Load purchases
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
      case 'completed': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
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
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <div className="bg-brand-dark py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">
              Welcome, {profile?.full_name || user.email}
            </h1>
            <p className="text-slate-300">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <NavLink
            to="/services/academic"
            className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-all"
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
            className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark">Purchase Books</h3>
                <p className="text-sm text-slate-500">Browse publications</p>
              </div>
            </div>
          </NavLink>

          <div className="bg-white p-6 rounded-2xl shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark">Profile</h3>
                <p className="text-sm text-slate-500">{profile?.institution || 'Set up profile'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Consultations */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Consultations
            </h2>
            
            {consultations.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No consultations yet.{' '}
                <NavLink to="/services/academic" className="text-brand-primary hover:underline">
                  Book one now
                </NavLink>
              </p>
            ) : (
              <div className="space-y-4">
                {consultations.map((consult) => (
                  <div key={consult.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-brand-dark">{consult.service_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(consult.status)}`}>
                        {consult.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">${consult.price}</p>
                    {consult.scheduled_at && (
                      <p className="text-slate-500 text-xs">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(consult.scheduled_at).toLocaleDateString()}
                      </p>
                    )}
                    {!consult.intake_submitted && consult.status === 'pending' && (
                      <NavLink
                        to={`/intake/${consult.id}`}
                        className="mt-2 inline-block text-sm text-brand-primary hover:underline"
                      >
                        Complete intake form →
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchases */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              My Purchases
            </h2>
            
            {purchases.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No purchases yet.{' '}
                <NavLink to="/books" className="text-brand-primary hover:underline">
                  Browse books
                </NavLink>
              </p>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-brand-dark">{purchase.book_id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">${purchase.amount}</p>
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