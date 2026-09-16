import React from 'react';
import { useApp } from '../context/AppContext';

export const PaymentScreen = () => {
  const { selectedHelper, selectedService, trustFee, selectedDate, selectedTime, handleConfirmBooking, navigateTo } = useApp();
  const totalAmount = selectedService.price + trustFee;

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#f8f9ff]">
      <header className="flex h-16 items-center gap-2 border-b border-slate-100 bg-white px-4">
        <button type="button" aria-label="Go back" onClick={() => navigateTo('booking')} className="flex h-10 w-10 items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#eff4ff]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <p className="text-sm font-bold text-[#0b1c30]">Secure payment</p>
          <p className="text-[11px] text-slate-500">Final review before dispatch</p>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="rounded-3xl bg-[#0b1c30] p-5 text-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6ffbbe]">Ready to dispatch</span>
          <h1 className="mt-2 text-2xl font-extrabold">₹{totalAmount}</h1>
          <p className="mt-1 text-xs text-slate-300">{selectedService.title} with {selectedHelper.name}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs"><span className="text-slate-500">When</span><span className="font-bold text-[#0b1c30]">{selectedDate}, {selectedTime}</span></div>
          <div className="my-3 border-t border-slate-100" />
          <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Service</span><span className="font-bold text-[#0b1c30]">₹{selectedService.price}</span></div>
          <div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-500">Trust Shield</span><span className="font-bold text-[#0b1c30]">₹{trustFee}</span></div>
        </div>

        <div className="rounded-2xl border border-[#6ffbbe]/50 bg-[#eafff4] p-4 text-xs text-[#006c49]">
          <span className="material-symbols-outlined mr-1 align-middle text-[16px]">lock</span>
          Payment gateway will be connected here. For now, this demo confirms the request without charging your card or UPI.
        </div>
      </main>

      <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur-xl">
        <button type="button" onClick={handleConfirmBooking} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6a00] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff6a00]/30">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          Confirm request and continue
        </button>
      </div>
    </div>
  );
};