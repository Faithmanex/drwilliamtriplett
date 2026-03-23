import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, ArrowLeft, Loader2, Upload, AlertCircle } from 'lucide-react';

interface RouteParams {
  id: string;
}

const DissertationIntakeForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [consultation, setConsultation] = useState<any>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    degreeProgram: '',
    dissertationStage: '',
    researchProblem: '',
    researchQuestions: '',
    theoreticalFramework: '',
    methodology: '',
    irbStatus: '',
    targetDefenseDate: '',
    biggestChallenge: '',
    pagesCompleted: '',
    weeklyWritingHours: '',
    acknowledgment: false,
  });

  useEffect(() => {
    checkAccess();
  }, [id]);

  const checkAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login?redirect=/intake/dissertation');
        return;
      }
      setUser(session.user);

      const { data: consult } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

      if (!consult) {
        setError('Consultation not found');
        return;
      }

      setConsultation(consult);

      const { data: existingForm } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('consultation_id', id)
        .single();

      if (existingForm) {
        setSubmitted(true);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: profile.email || '',
        }));
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acknowledgment) {
      setError('Please acknowledge the terms');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await supabase.from('intake_forms').insert({
        consultation_id: id,
        user_id: user.id,
        form_type: 'dissertation_strategy',
        data: formData,
      });

      await supabase
        .from('consultations')
        .update({ intake_submitted: true })
        .eq('id', id);

      // Send notification to Dr. Triplett
      await fetch('/api/intake-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId: id,
          formType: 'dissertation_strategy',
          formData,
          userEmail: formData.email,
          serviceName: 'Dissertation Strategy Intensive'
        })
      });

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-light pt-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-4">Form Submitted!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for submitting your intake form. Dr. Triplett will review your materials and contact you within 48 business hours.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error && !consultation) {
    return (
      <div className="min-h-screen bg-brand-light pt-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-brand-dark mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/services/academic')}
            className="text-brand-primary hover:underline"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-brand-primary hover:underline mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h1 className="font-serif text-2xl font-bold text-brand-dark mb-2">Dissertation Strategy Intake Form</h1>
          <p className="text-slate-500 mb-8">Please complete this form before your session with Dr. Triplett.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">University *</label>
                <input
                  type="text"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Degree Program *</label>
                <select
                  required
                  value={formData.degreeProgram}
                  onChange={(e) => setFormData({...formData, degreeProgram: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select degree</option>
                  <option value="PhD">PhD</option>
                  <option value="EdD">EdD</option>
                  <option value="DBA">DBA</option>
                  <option value="Other Doctoral">Other Doctoral</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Dissertation Stage *</label>
                <select
                  required
                  value={formData.dissertationStage}
                  onChange={(e) => setFormData({...formData, dissertationStage: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select stage</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Chapter 1-2">Chapters 1-2</option>
                  <option value="Chapter 3">Chapter 3 (Methodology)</option>
                  <option value="Data Collection">Data Collection</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="Writing/Revision">Writing/Revision</option>
                  <option value="Defense Ready">Defense Ready</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Defense Date</label>
                <input
                  type="date"
                  value={formData.targetDefenseDate}
                  onChange={(e) => setFormData({...formData, targetDefenseDate: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Research Problem Statement *</label>
              <textarea
                required
                rows={4}
                value={formData.researchProblem}
                onChange={(e) => setFormData({...formData, researchProblem: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Research Questions *</label>
              <textarea
                required
                rows={3}
                value={formData.researchQuestions}
                onChange={(e) => setFormData({...formData, researchQuestions: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Theoretical/Conceptual Framework *</label>
              <textarea
                required
                rows={4}
                value={formData.theoreticalFramework}
                onChange={(e) => setFormData({...formData, theoreticalFramework: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Methodology *</label>
                <select
                  required
                  value={formData.methodology}
                  onChange={(e) => setFormData({...formData, methodology: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select methodology</option>
                  <option value="Qualitative">Qualitative</option>
                  <option value="Quantitative">Quantitative</option>
                  <option value="Mixed Methods">Mixed Methods</option>
                  <option value="Mixed Methods">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">IRB Status</label>
                <select
                  value={formData.irbStatus}
                  onChange={(e) => setFormData({...formData, irbStatus: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Approved">Approved</option>
                  <option value="Exempt">Exempt</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pages Completed</label>
                <input
                  type="number"
                  value={formData.pagesCompleted}
                  onChange={(e) => setFormData({...formData, pagesCompleted: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Weekly Writing Hours</label>
                <select
                  value={formData.weeklyWritingHours}
                  onChange={(e) => setFormData({...formData, weeklyWritingHours: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select hours</option>
                  <option value="0-2">0-2 hours</option>
                  <option value="3-5">3-5 hours</option>
                  <option value="6-10">6-10 hours</option>
                  <option value="10+">10+ hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Biggest Current Challenge *</label>
              <textarea
                required
                rows={3}
                value={formData.biggestChallenge}
                onChange={(e) => setFormData({...formData, biggestChallenge: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Upload Proposal or Draft Chapter (PDF/DOCX - 20MB max) *</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" required />
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={formData.acknowledgment}
                  onChange={(e) => setFormData({...formData, acknowledgment: e.target.checked})}
                  className="mt-1 rounded text-brand-primary"
                />
                <span className="text-sm text-slate-600">
                  I acknowledge that this is a paid advisory session. All information provided is confidential. 
                  I understand that Dr. Triplett does not provide ghostwriting or authorship services.
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-dark hover:bg-slate-800 text-white py-4 px-6 rounded-lg font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Intake Form'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DissertationIntakeForm;