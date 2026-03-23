import React from 'react';
import { academicServices, oneOnOneServices, facultyAdvisoryServices, dissertationAdvisoryServices } from '../data/academicServices';
import { BookOpen, Users, GraduationCap, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';

interface ServiceCardProps {
  service: typeof academicServices[0];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const handleBookNow = () => {
    window.location.href = `/services/academic/${service.id}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:border-brand-primary/20 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-lg md:text-xl font-bold text-brand-dark">{service.title}</h3>
        <div className="text-right">
          <span className="bg-brand-light text-brand-primary text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap block">
            ${service.price}
          </span>
          {service.priceLabel && (
            <span className="text-xs text-slate-500 mt-1 block whitespace-nowrap">{service.priceLabel}</span>
          )}
        </div>
      </div>
      
      {service.duration && (
        <p className="text-sm text-slate-500 mb-3">{service.duration}</p>
      )}
      
      <p className="text-slate-600 mb-4 text-sm">{service.description}</p>
      
      <ul className="space-y-2 mb-6 flex-grow">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm text-slate-600">
            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      
      <button
        onClick={handleBookNow}
        className="w-full bg-brand-dark hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2"
      >
        Book Now
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

const AcademicServices: React.FC = () => {
  return (
    <div className="bg-brand-light min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-brand-primary hover:underline"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
      </div>
      <div className="bg-brand-dark py-16 md:py-20 px-6 text-center">
        <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white">Academic Advisory Services</h1>
        <p className="font-sans text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
          Strategic guidance for faculty, researchers, and doctoral candidates seeking to advance their academic careers.
        </p>
      </div>

      {/* One-On-One Sessions (One-Time) */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark">One-On-One Sessions</h2>
        </div>
        <p className="text-slate-500 mb-8">(One-Time)</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {oneOnOneServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Faculty Advisory Programs (Post-Consultation) */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark">Faculty Advisory Programs</h2>
        </div>
        <p className="text-slate-500 mb-8">(Post-Consultation)</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {facultyAdvisoryServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Dissertation Advisory Programs (Post-Consultation) */}
      <div className="max-w-7xl mx-auto px-6 py-16 pb-24">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark">Dissertation Advisory Programs</h2>
        </div>
        <p className="text-slate-500 mb-8">(Post-Consultation)</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {dissertationAdvisoryServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-white py-12 px-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            All services are advisory and developmental in nature. Dr. Triplett does not provide ghostwriting or authorship services. 
            Clients remain solely responsible for the originality and submission of their academic work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademicServices;
