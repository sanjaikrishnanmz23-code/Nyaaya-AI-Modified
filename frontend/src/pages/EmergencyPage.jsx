import React, { useState, useEffect } from 'react';
import { PhoneCall, ShieldAlert, Copy, Check, Clock, Info } from 'lucide-react';
import { fetchEmergencyContacts } from '../services/api';

export default function EmergencyPage() {
  const [contacts, setContacts] = useState([]);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchEmergencyContacts();
        setContacts(data);
      } catch (err) {
        console.error('Emergency contacts load error:', err);
        // contacts remain empty array; fallback handled inside fetchEmergencyContacts
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-800 rounded w-2/3" />
              <div className="h-16 bg-slate-800 rounded w-full" />
              <div className="h-10 bg-red-900/30 rounded-xl w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleCopy = (number) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Page Header */}
      <div className="space-y-2 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span>Verified Government Helplines Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          National Emergency Helplines
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Official toll-free emergency phone contacts for immediate police rescue, financial cyber freeze, women safety, and free legal aid.
        </p>
        <p className="text-xs sm:text-sm text-red-400 font-tamil">
          அவசர காவல் உதவி, இணைய நிதி இழப்பு மற்றும் இலவச சட்ட உதவிக்கான தேசிய தொலைபேசி எண்கள்
        </p>
      </div>

      {/* Emergency Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-start gap-3 text-xs text-red-200 leading-relaxed">
        <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div>
          <strong>Immediate Danger:</strong> In situations of physical threat or life emergency, immediately dial <strong>112</strong> without delay. NyaayaAI is an educational informational assistant and does not replace emergency response services.
        </div>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-red-500/30 group transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {c.category}
                </span>
                {c.available_24_7 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    24x7 Active
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-red-400 font-tamil mt-0.5">
                  {c.name_tamil}
                </p>
              </div>

              <div className="py-2">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono tracking-wider">
                    {c.number}
                  </span>
                  <button
                    onClick={() => handleCopy(c.number)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Helpline Number"
                  >
                    {copiedNumber === c.number ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {c.description}
              </p>
              <p className="text-[11px] text-slate-400 font-tamil leading-relaxed">
                {c.description_tamil}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <a
                href={`tel:${c.number.replace(/[^0-9]/g, '')}`}
                className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-semibold text-xs transition-all border border-red-500/30 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {c.number} Directly</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
