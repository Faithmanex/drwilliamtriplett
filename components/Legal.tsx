import React from 'react';
import { Scale, Shield, AlertTriangle, Users, Copyright, Clock, Lock, Globe } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="bg-brand-light min-h-screen pt-20">
      <div className="bg-brand-dark py-20 px-6 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white">Legal Statements & Professional Disclosures</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Important information about the nature of services provided by Dr. William Triplett.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 space-y-12">
          
          {/* Section 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">1. Academic Integrity & Advisory Disclosure</h2>
              <p className="text-slate-600 leading-relaxed">
                All services provided are strategic and developmental advisory services. Dr. William Triplett does not engage in ghostwriting, authorship, or completion of academic assignments, dissertations, or scholarly work on behalf of clients. Clients retain full responsibility for the originality, integrity, and submission of all academic materials.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">2. No Guarantee of Outcome</h2>
              <p className="text-slate-600 leading-relaxed">
                The Advisor makes no guarantees regarding academic or professional outcomes, including but not limited to promotion decisions, tenure outcomes, publication acceptance, IRB approval, dissertation approval, or degree conferral.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">3. Independent Contractor Status</h2>
              <p className="text-slate-600 leading-relaxed">
                The Advisor operates as an independent contractor. Nothing in any engagement constitutes employment, partnership, joint venture, institutional representation, or agency relationship.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">4. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                To the maximum extent permitted by law, the Advisor's liability shall be limited to the total amount paid by the Client for the specific service rendered.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Copyright className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">5. Intellectual Property Rights</h2>
              <p className="text-slate-600 leading-relaxed">
                All intellectual property, drafts, research materials, and documents shared by the Client remain the sole property of the Client. The Advisor claims no ownership interest in submitted materials.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">6. Scope of Communication & Access</h2>
              <p className="text-slate-600 leading-relaxed">
                Advisory services include structured consultation and feedback within agreed timelines. Ongoing or unlimited communication outside the defined scope of engagement is not included unless otherwise agreed in writing.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">7. Refund & Rescheduling Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                All session fees are non-refundable. Rescheduling is permitted with at least 24 hours notice. Missed sessions without notice may be forfeited.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">8. File Retention Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                Submitted materials are stored securely and retained for 90 days unless an ongoing advisory engagement continues. Clients may request deletion of their materials at any time.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">9. Data Security Disclaimer</h2>
              <p className="text-slate-600 leading-relaxed">
                Reasonable security measures are implemented; however, absolute data security cannot be guaranteed due to the nature of digital transmission and third-party platforms.
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">10. Force Majeure</h2>
              <p className="text-slate-600 leading-relaxed">
                The Advisor shall not be liable for delays or inability to perform services due to circumstances beyond reasonable control, including but not limited to illness, emergency, or technical disruption.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-brand-light rounded-xl p-8 mt-8">
            <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">Questions?</h3>
            <p className="text-slate-600 mb-4">For questions regarding these disclosures, please contact:</p>
            <a href="mailto:advisory@drwilliamtriplett.com" className="text-brand-primary font-bold hover:underline">
              advisory@drwilliamtriplett.com
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Legal;
