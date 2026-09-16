import React from 'react';
import { useApp } from '../context/AppContext';

export const EmergencyModal = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, showToast, location } = useApp();

  if (!isEmergencyModalOpen) return null;

  const emergencyServices = [
    { title: 'Immediate Rooftop Water Leak Patch', eta: '10-15 mins', icon: 'roofing', price: '₹450' },
    { title: 'Flood Barrier / Sandbag Dispatch (Ward 112)', eta: '20 mins', icon: 'waves', price: 'Free Volunteer' },
    { title: 'Emergency Electrical Line Cut-off & Check', eta: '12 mins', icon: 'power_off', price: '₹350' },
    { title: 'Tree Branch Fallen Clearing (BBMP/Local)', eta: '30 mins', icon: 'nature', price: 'Free Volunteer' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-red-100 max-h-[90vh] animate-in slide-in-from-bottom-8 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-red-600 to-[#ff6a00] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                  Monsoon Action Cell
                </span>
                <span className="text-xs text-white/80">• Ward 112</span>
              </div>
              <h3 className="font-extrabold text-lg tracking-tight mt-0.5">Emergency Assistance</h3>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Info */}
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-600 text-xl shrink-0">crisis_alert</span>
          <p className="text-xs text-red-900 leading-snug">
            Heavy rainfall alert in <span className="font-bold">{location}</span>. Priority volunteer teams are on standby for water-logging and electrical safety.
          </p>
        </div>

        {/* Services List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 bg-[#f8f9ff]">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Fast Response Options
          </h4>
          {emergencyServices.map((service, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between gap-3 hover:border-orange-300 transition-all cursor-pointer active:scale-98"
              onClick={() => {
                showToast(`Emergency dispatch triggered for: ${service.title}`);
                setIsEmergencyModalOpen(false);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">{service.icon}</span>
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-[#0b1c30] truncate">{service.title}</h5>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    ETA: {service.eta}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-xs text-red-600">{service.price}</span>
                <span className="text-[10px] text-slate-400">Request</span>
              </div>
            </div>
          ))}
        </div>

        {/* SOS Hotline Bar */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
          <a
            href="tel:112"
            className="flex-1 py-3 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            <span>Dial Ward 112 Help Line</span>
          </a>
        </div>
      </div>
    </div>
  );
};
