import { AcademicService } from '../types';

export const academicServices: AcademicService[] = [
  // One-On-One Sessions
  {
    id: 'faculty-strategy',
    title: 'Faculty Strategy Intensive',
    shortTitle: 'Faculty Strategy',
    price: 400,
    duration: '60-75 Minutes',
    description: 'A comprehensive one-on-one session focused on your academic advancement.',
    features: [
      'Pre-session intake review',
      'Research and advancement assessment',
      'Promotion & tenure positioning guidance',
      'Publication strategy insight',
      'Written strategic roadmap'
    ],
    category: 'one-on-one',
    priceLabel: '(One-Time)',
    stripePriceId: 'price_faculty_strategy'
  },
  {
    id: 'dissertation-strategy',
    title: 'Dissertation Strategy Intensive',
    shortTitle: 'Dissertation Strategy',
    price: 350,
    duration: '75 Minutes',
    description: 'Focused guidance to accelerate your dissertation progress.',
    features: [
      'Intake analysis',
      'Research framework evaluation',
      'Methodology & IRB guidance (if applicable)',
      'Structured completion strategy roadmap',
      'Defense preparation insight'
    ],
    category: 'one-on-one',
    priceLabel: '(One-Time)',
    stripePriceId: 'price_dissertation_strategy'
  },
  // Faculty Advisory Programs (Post-Consultation)
  {
    id: 'publication-strategy',
    title: 'Publication Strategy Advisory Program',
    shortTitle: 'Publication Strategy',
    price: 1800,
    description: 'Comprehensive support for building your publication pipeline.',
    features: [
      'Publication pipeline development',
      'Journal targeting strategy',
      'Article positioning refinement',
      'Structured milestone planning'
    ],
    category: 'faculty-advisory',
    priceLabel: '(One-Time)',
    stripePriceId: 'price_publication_strategy'
  },
  {
    id: 'promotion-tenure',
    title: 'Promotion & Tenure Portfolio Advisory Program',
    shortTitle: 'Promotion & Tenure',
    price: 3500,
    description: 'Complete portfolio strategy for your promotion and tenure journey.',
    features: [
      'Portfolio strategy alignment',
      'Research narrative refinement',
      'Impact positioning',
      'Institutional expectation mapping'
    ],
    category: 'faculty-advisory',
    priceLabel: '(One-Time)',
    stripePriceId: 'price_promotion_tenure'
  },
  {
    id: 'executive-academic',
    title: 'Executive Academic Advisory Retainer',
    shortTitle: 'Executive Advisory',
    price: 1200,
    description: 'Monthly strategic consultation for academic leaders.',
    features: [
      'Monthly strategic consultation',
      'Leadership positioning',
      'Research scaling strategy',
      'Institutional navigation support'
    ],
    category: 'faculty-advisory',
    priceLabel: '(Subscription)',
    stripePriceId: 'price_executive_academic'
  },
  // Dissertation Advisory Programs (Post-Consultation)
  {
    id: 'proposal-irb',
    title: 'Proposal & IRB Advisory Program',
    shortTitle: 'Proposal & IRB',
    price: 1500,
    description: 'Expert guidance for your proposal and IRB approval.',
    features: [
      'Proposal refinement',
      'Research question alignment',
      'Methodology clarity',
      'IRB readiness review'
    ],
    category: 'dissertation-advisory',
    priceLabel: '(One-Time)',
    stripePriceId: 'price_proposal_irb'
  },
  {
    id: 'chapter-development',
    title: 'Chapter Development Advisory',
    shortTitle: 'Chapter Development',
    price: 1200,
    description: 'Structural and argumentative feedback on your dissertation chapters.',
    features: [
      'Structural feedback',
      'Argument clarity review',
      'Theoretical alignment refinement',
      'Developmental guidance'
    ],
    category: 'dissertation-advisory',
    priceLabel: '(per Chapter)',
    stripePriceId: 'price_chapter_development'
  },
  {
    id: 'dissertation-completion',
    title: 'Dissertation Completion Strategy & Advisory Program',
    shortTitle: 'Dissertation Completion',
    price: 4500,
    description: 'Comprehensive support for final-stage dissertation writing and defense.',
    features: [
      'Final-stage writing refinement',
      'Revision strategy',
      'Defense preparation',
      'Structured milestone accountability'
    ],
    category: 'dissertation-advisory',
    priceLabel: '(One-Time)',
    stripePriceId: 'price_dissertation_completion'
  }
];

export const oneOnOneServices = academicServices.filter(s => s.category === 'one-on-one');
export const facultyAdvisoryServices = academicServices.filter(s => s.category === 'faculty-advisory');
export const dissertationAdvisoryServices = academicServices.filter(s => s.category === 'dissertation-advisory');
