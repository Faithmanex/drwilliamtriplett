
import React, { useState } from 'react';
import { Send, Mail, MapPin, Loader2, CheckCircle, ArrowRight } from 'lucide-react';


const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to send email');
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('Failed to send email. Please try again later.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light pt-20">
       <div className="bg-brand-dark py-24 px-6 reveal-on-scroll">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="font-serif text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="font-sans text-xl text-slate-300 max-w-2xl mx-auto font-light">
            For professional inquiries, speaking engagements, or advisory requests.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Info Side */}
          <div className="lg:col-span-4 lg:pt-20 space-y-8 order-2 lg:order-1 reveal-on-scroll delay-100">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="font-serif text-xl font-bold text-brand-dark mb-6">Contact Details</h3>
               
               <div className="space-y-6">
                 <div className="flex items-start gap-4 group">
                   <div className="p-3 bg-brand-light rounded-xl text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                     <Mail size={20} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                     <p className="text-slate-700 font-medium">will@drwilliamtriplett.com</p>
                   </div>
                 </div>
                  <div className="flex items-start gap-4 group">
                   <div className="p-3 bg-brand-light rounded-xl text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                     <p className="text-slate-700 font-medium">Available Worldwide<br/><span className="text-sm text-slate-500 font-normal">(Remote & In-Person)</span></p>
                   </div>
                 </div>
               </div>
             </div>


          </div>

          {/* Form Side */}
          <div className="lg:col-span-8 order-1 lg:order-2 reveal-on-scroll delay-200">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-card border border-slate-100/50">
              {isSubmitted ? (
                <div className="animate-[fadeIn_0.5s_ease-out] py-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="text-green-600 w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-brand-dark mb-3">Message Sent Successfully</h3>
                    <p className="text-slate-600 max-w-sm mb-8">
                      Thank you, {formData.name.split(' ')[0]}. Your inquiry has been received and you will be contacted within 24 hours.
                    </p>



                    <button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors"
                    >
                      Send Another Message <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-5 py-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-slate-800 disabled:opacity-50"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-5 py-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-slate-800 disabled:opacity-50"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Topic</label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-5 py-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-slate-800 appearance-none disabled:opacity-50"
                      >
                        <option value="" disabled>Select a topic...</option>
                        <option value="Speaking">Speaking Engagement</option>
                        <option value="Advisory">Advisory Services</option>
                        <option value="Research">Research Collaboration</option>
                        <option value="Book">Book Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-5 py-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-slate-800 resize-y disabled:opacity-50"
                      placeholder="How can Dr. Triplett assist you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
