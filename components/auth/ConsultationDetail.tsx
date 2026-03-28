import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, ArrowLeft, CheckCircle, FileText, ExternalLink, Shield, MessageSquare, Loader2, ArrowRight } from 'lucide-react';

const ConsultationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<any>(null);
  const [intakeForm, setIntakeForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultation();
  }, [id]);

  const loadConsultation = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Fetch consultation
      const { data: consultData, error: consultError } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

      if (consultError || !consultData) {
        navigate('/dashboard');
        return;
      }
      setConsultation(consultData);

      // Fetch intake form
      const { data: formData } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('consultation_id', id)
        .maybeSingle();
      
      setIntakeForm(formData);
    } catch (error) {
      console.error('Error loading consultation:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'scheduled': return { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      default: return { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  const status = getStatusInfo(consultation.status);
  const isFaculty = ['faculty-strategy', 'publication-strategy', 'promotion-tenure', 'executive-academic'].includes(consultation.service_id);
  const intakeRoute = isFaculty ? '/intake/faculty' : '/intake/dissertation';

  return (
    <div className="min-h-screen bg-brand-light pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-primary mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-brand-primary/30 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="font-medium text-sm">Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-brand-dark">{consultation.service_name}</h1>
                  <p className="text-slate-500 mt-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-primary" />
                    Secure Strategic Session
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${status.color} self-start`}>
                  {status.label}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-slate-100 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Session Date</p>
                  <p className="text-sm font-bold text-brand-dark flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-primary" />
                    {consultation.scheduled_at ? new Date(consultation.scheduled_at).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-sm font-bold text-brand-dark">${consultation.price}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reference ID</p>
                  <p className="text-xs font-mono text-slate-500">{consultation.id.slice(0, 8)}</p>
                </div>
              </div>

              {/* Intake Data Section */}
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-primary" />
                  Your Submission Details
                </h2>

                {intakeForm ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {Object.entries(intakeForm.data || {}).map(([key, value]) => {
                        if (key === 'acknowledgment' || !value) return null;
                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                        return (
                          <div key={key} className="group">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-brand-primary transition-colors">{formattedKey}</p>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                    <p className="text-slate-500 mb-6 font-medium">You haven't completed the intake form for this session yet.</p>
                    <NavLink
                      to={`${intakeRoute}/${consultation.id}`}
                      className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all hover:shadow-lg"
                    >
                      Fill Intake Form <ArrowRight size={18} />
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-brand-dark rounded-3xl p-8 text-white shadow-xl shadow-brand-dark/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-brand-light">
                <CheckCircle className="w-5 h-5" />
                Next Steps
              </h3>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                {!consultation.intake_submitted ? (
                  <>
                    <p>Completing your intake form is the first step. This allows Dr. Triplett to review your materials before the session.</p>
                    <p>Once submitted, you'll be contacted to finalize your appointment time.</p>
                  </>
                ) : (
                  <>
                    <p>Your materials are under review. Our administrative team will coordinate with Dr. Triplett to confirm your session time.</p>
                    <p>Expect a scheduling link via email within 48 business hours.</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-primary" />
                Support
              </h3>
              <p className="text-sm text-slate-500 mb-6">Need to reschedule or have questions about your session?</p>
              <NavLink 
                to="/contact" 
                className="flex items-center justify-between w-full px-4 py-3 bg-brand-light text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-primary/10 transition-colors"
              >
                Contact Academic Office
                <ExternalLink size={14} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;
