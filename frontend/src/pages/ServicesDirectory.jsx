import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Search, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  X, 
  ArrowRight,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { fetchServices } from '../services/api';

export default function ServicesDirectory({ selectedServiceId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeService, setActiveService] = useState(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Identity', label: 'Identity & Cards' },
    { id: 'Travel', label: 'Travel & Mobility' },
    { id: 'Civic', label: 'Certificates & Revenue' },
    { id: 'Grievance', label: 'Grievances & RTI' },
  ];

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchServices();
        setServices(data);
        if (selectedServiceId) {
          const matched = data.find((s) => s.id === selectedServiceId);
          if (matched) setActiveService(matched);
        }
      } catch (err) {
        console.error('Services load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedServiceId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-800 rounded w-2/3" />
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-4/5" />
              <div className="h-10 bg-slate-800 rounded-xl w-full mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredServices = services.filter((srv) => {
    const matchesCat =
      selectedCategory === 'all' ||
      srv.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      srv.title.toLowerCase().includes(q) ||
      srv.title_tamil.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q) ||
      srv.relevant_authority.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Landmark className="w-3.5 h-3.5 text-blue-400" />
            <span>Digital India & Public Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Government Services Directory
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Step-by-step procedures, eligibility criteria, checklists, and verified portals for citizen public services.
          </p>
          <p className="text-xs sm:text-sm text-blue-300 font-tamil">
            அரசு சான்றிதழ்கள், அடையாள அட்டைகள் மற்றும் குறைதீர்ப்பு சேவைகளுக்கான அதிகாரப்பூர்வ வழிகாட்டி
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services (e.g. aadhaar, pan, passport)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 && (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <p className="text-base font-semibold">No services found for "{search}".</p>
          <p className="text-sm text-slate-500">Try broader keywords or browse all categories.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('all'); }}
            className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/20 transition-all"
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-blue-500/40 group transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/20 text-blue-300">
                  {srv.category}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {srv.processing_time.split(';')[0]}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-blue-400 font-tamil mt-0.5">
                  {srv.title_tamil}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {srv.description}
              </p>
              <p className="text-[11px] text-slate-400 font-tamil leading-relaxed">
                {srv.description_tamil}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-400">
                  <span className="text-slate-500">Authority: </span>
                  <span className="font-medium text-slate-300">{srv.relevant_authority}</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-500">Portal: </span>
                  <span className="font-mono text-cyan-300">{srv.official_portal_name}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setActiveService(srv)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-xs transition-all border border-slate-700/80 flex items-center justify-center gap-2"
              >
                <span>View Documents & Steps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Details Modal */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl my-8 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-blue-500/30 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveService(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 shrink-0">
                <Landmark className="w-8 h-8" />
              </div>
              <div className="space-y-1 pr-10">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/20 text-blue-300">
                  {activeService.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activeService.title}
                </h2>
                <p className="text-sm text-blue-400 font-tamil">
                  {activeService.title_tamil}
                </p>
              </div>
            </div>

            {/* Meta info: Authority & Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500">Relevant Authority:</span>
                <p className="font-semibold text-slate-200">{activeService.relevant_authority}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500">Prescribed Fee Structure:</span>
                <p className="font-semibold text-slate-200">{activeService.fee_structure}</p>
              </div>
            </div>

            {/* Eligibility */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Eligibility Criteria
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {activeService.eligibility.map((el, idx) => (
                  <li key={idx}>{el}</li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Required Documents Checklist (தேவையான ஆவணங்கள்)
              </h4>
              <div className="space-y-1.5">
                {activeService.required_documents.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by Step Application Workflow */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Step-by-Step Application Process (விண்ணப்பிக்கும் முறை)
              </h4>
              <div className="space-y-2">
                {activeService.step_by_step_process.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Source & Verification Notice */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-blue-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Public Portal Reference:</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Demo Verified Source</span>
              </div>
              <p className="text-slate-300">
                Official Designated Portal: <strong>{activeService.official_portal_name}</strong>
              </p>
              <div className="pt-1 flex items-center justify-between">
                <a
                  href={activeService.official_url_demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:underline font-mono"
                >
                  <span>{activeService.official_url_demo}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveService(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close Service Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
