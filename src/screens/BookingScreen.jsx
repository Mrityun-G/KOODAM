import React from 'react';
import { useApp } from '../context/AppContext';

export const BookingScreen = () => {
  const {
    selectedHelper,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    trustFee,
    handleConfirmBooking,
    handleProceedToPayment,
    navigateTo
  } = useApp();

  const services = [
    {
      id: 1,
      title: 'Ceiling Fan / Exhaust Installation',
      desc: 'Includes blade balancing & regulator check',
      price: 249,
      duration: '~30 mins'
    },
    {
      id: 2,
      title: 'Emergency Short Circuit Diagnostic',
      desc: 'Line leakage, spark identification & testing',
      price: 399,
      duration: '~45 mins',
      tag: 'POPULAR'
    },
    {
      id: 3,
      title: 'Full MCB / Fuse Box Repair',
      desc: 'Load balancing and isolator replacement',
      price: 499,
      duration: '~60 mins'
    }
  ];

  const dates = [
    { label: 'Today', day: '22', active: selectedDate === 'Today 22' },
    { label: 'Tomorrow', day: '23', active: selectedDate === 'Tomorrow 23' },
    { label: 'Sat', day: '24', active: selectedDate === 'Sat 24' },
    { label: 'Sun', day: '25', active: selectedDate === 'Sun 25' }
  ];

  const times = [
    '10:30 AM - 11:30 AM',
    '02:00 PM - 03:00 PM',
    '05:30 PM - 06:30 PM'
  ];

  const totalAmount = selectedService.price + trustFee;

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#f8f9ff] min-h-screen">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-slate-100">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              aria-label="Go Back"
              onClick={() => navigateTo('home', 'home')}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <button
              aria-label="Go to Home"
              onClick={() => navigateTo('home', 'home')}
              className="shrink-0 active:scale-95 transition-transform"
            >
              <img
                alt="KOODAM Community Logo"
                className="h-7 w-auto object-contain"
                src="/logo.svg"
              />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#0b1c30] truncate">Helper Profile</span>
              <span className="text-[11px] text-[#5a4136] truncate">KOODAM Indiranagar</span>
            </div>
          </div>
          <button
            aria-label="More Options"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#eff4ff]"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pb-36">
        {/* Top Ambient Banner */}
        <div className="relative w-full h-32 bg-gradient-to-r from-[#b3c1ff] via-[#dce9ff] to-[#ffdbcc] overflow-hidden">
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#a14000]/10 blur-2xl"></div>
          <div className="absolute left-4 bottom-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md shadow-xs">
            <span
              className="material-symbols-outlined text-[#00ae78] text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-xs font-semibold text-[#0b1c30]">Top Rated in 100ft Road</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-4 -mt-10 flex flex-col gap-4">
          {/* Helper Header Profile Card */}
          <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col gap-3 relative border border-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div className="relative">
                <img
                  className="w-18 h-18 rounded-2xl object-cover shadow-sm"
                  alt={selectedHelper.name}
                  src={selectedHelper.avatar}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#00ae78] text-white rounded-full p-1 shadow-xs flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 bg-[#dce1ff] text-[#05164b] px-2.5 py-0.5 rounded-full">
                  <span
                    className="material-symbols-outlined text-[#a14000] text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                  <span className="text-[10px] font-bold">KOODAM Verified</span>
                </div>
                <span className="text-[11px] text-[#006c49] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00ae78] animate-pulse"></span>
                  Available Today
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                {selectedHelper.name}
              </h2>
              <p className="text-xs text-[#4e5c92] font-semibold">{selectedHelper.title}</p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center text-center">
                <div className="flex items-center gap-0.5 text-[#ff6a00]">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-xs font-bold text-[#0b1c30]">{selectedHelper.rating}</span>
                </div>
                <span className="text-[10px] text-[#5a4136]">184 reviews</span>
              </div>

              <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-[#0b1c30]">99%</span>
                <span className="text-[10px] text-[#5a4136]">Complete</span>
              </div>

              <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-[#0b1c30]">1.1 km</span>
                <span className="text-[10px] text-[#5a4136]">Away</span>
              </div>

              <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-[#0b1c30]">6+ yrs</span>
                <span className="text-[10px] text-[#5a4136]">Exp.</span>
              </div>
            </div>

            {/* Trust highlights banner */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#dce9ff] text-[#0b1c30]">
              <span className="material-symbols-outlined text-[#a14000] text-[20px] shrink-0">
                history_edu
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold">Background Checked & Insured</span>
                <span className="text-[10px] text-[#5a4136]">
                  Protected up to ₹10,000 under KOODAM Trust Shield
                </span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col gap-2 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4e5c92] text-[18px]">badge</span>
                About Arun
              </h3>
              <span className="text-[11px] text-[#4e5c92] bg-[#eff4ff] px-2 py-0.5 rounded-full font-medium">
                Neighbor favorite
              </span>
            </div>
            <p className="text-xs text-[#5a4136] leading-relaxed">
              Passionate community electrician serving Indiranagar and Koramangala. Specializes in emergency wiring, circuit breakers, fan installations, and inverter setups. Fluent in English, Kannada, and Hindi.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0b1c30] text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[#a14000] text-[13px]">translate</span>
                English, Kannada, Hindi
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0b1c30] text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[#00ae78] text-[13px]">bolt</span>
                Smart Switches & MCB
              </span>
            </div>
          </div>

          {/* Select Service List */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#a14000] text-[18px]">handyman</span>
                Select Service Needed
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Instant Transparent Pricing</span>
            </div>

            <div className="flex flex-col gap-2">
              {services.map((svc) => {
                const isSelected = selectedService.id === svc.id;
                return (
                  <label
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`cursor-pointer p-3.5 rounded-2xl shadow-xs flex items-center justify-between transition-all border ${
                      isSelected
                        ? 'bg-[#eff4ff] border-[#ff6a00] shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#ff6a00]' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-transparent'
                          }`}
                        ></div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0b1c30] truncate">
                            {svc.title}
                          </span>
                          {svc.tag && (
                            <span className="bg-[#ff6a00]/15 text-[#ff6a00] px-1.5 py-0.2 rounded text-[9px] font-extrabold tracking-wide">
                              {svc.tag}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#5a4136]">{svc.desc}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-sm font-extrabold text-[#a14000]">₹{svc.price}</span>
                      <span className="text-[10px] text-slate-400">{svc.duration}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Scheduling: Date and Time */}
          <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col gap-3 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4e5c92] text-[18px]">calendar_today</span>
                Choose Date & Time
              </h3>
              <span className="text-[11px] text-[#006c49] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                3 slots open
              </span>
            </div>

            {/* Date Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dates.map((d, i) => {
                const isSelected = selectedDate === `${d.label} ${d.day}`;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(`${d.label} ${d.day}`)}
                    className={`flex flex-col items-center justify-center py-2 px-3.5 rounded-2xl shrink-0 min-w-[68px] transition-all border ${
                      isSelected
                        ? 'bg-[#ff6a00] text-white border-[#ff6a00] shadow-sm'
                        : 'bg-[#eff4ff] text-[#0b1c30] border-transparent hover:bg-slate-100'
                    }`}
                    type="button"
                  >
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        isSelected ? 'text-white' : 'text-[#5a4136]'
                      }`}
                    >
                      {d.label}
                    </span>
                    <span className="text-base font-extrabold">{d.day}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Selector */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-xs font-bold text-slate-500">Available Time Slots</span>
              <div className="grid grid-cols-1 gap-1.5">
                {times.map((time, idx) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all border ${
                        isSelected
                          ? 'bg-[#eff4ff] text-[#a14000] border-[#ff6a00]'
                          : 'bg-white hover:bg-slate-50 text-[#0b1c30] border-slate-200'
                      }`}
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          schedule
                        </span>
                        <span>{time}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] bg-[#ffdbcc] text-[#7b2f00] px-2 py-0.5 rounded-full font-bold">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Transparent Bill Breakdown
            </h4>

            <div className="space-y-1.5 text-xs text-[#0b1c30]">
              <div className="flex justify-between">
                <span className="text-[#5a4136]">{selectedService.title}</span>
                <span className="font-bold">₹{selectedService.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a4136] flex items-center gap-1">
                  <span>Trust Shield & Neighbor Guarantee</span>
                  <span className="material-symbols-outlined text-[13px] text-[#00ae78]">verified</span>
                </span>
                <span className="font-bold">₹{trustFee}</span>
              </div>
              <div className="flex justify-between text-[#006c49] font-medium">
                <span>Platform Commission</span>
                <span>₹0 (100% to Helper)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center bg-[#eff4ff] p-2.5 rounded-xl">
              <div>
                <span className="text-xs font-bold text-[#0b1c30] block">Total Amount Payable</span>
                <span className="text-[10px] text-slate-500">Pay via UPI or Cash after service</span>
              </div>
              <span className="text-lg font-extrabold text-[#a14000]">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Confirmation Bar */}
      <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(11,28,48,0.08)] px-4 py-3 pb-safe z-40 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0 shrink-0">
            <span className="text-[11px] text-slate-500 font-medium">Total Cost</span>
            <span className="text-xl font-extrabold text-[#0b1c30]">₹{totalAmount}</span>
          </div>
          <button
            onClick={handleProceedToPayment}
            className="flex-1 py-3.5 px-4 rounded-full bg-[#ff6a00] hover:bg-[#a14000] text-white text-sm font-bold shadow-lg shadow-[#ff6a00]/30 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            type="button"
          >
            <span>Continue to Payment</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
