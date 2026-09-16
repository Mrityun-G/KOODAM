import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PartnerDashboard = () => {
  const {
    isPartnerOnline,
    togglePartnerDuty,
    partnerStats,
    hasIncomingJob,
    incomingCountdown,
    incomingJobDetails,
    acceptIncomingJob,
    declineIncomingJob,
    reviews,
    showToast,
    handleSelectMember,
    navigateTo,
    isSharingLocation,
    startSharingLocation,
    stopSharingLocation,
    partnerLocation,
    isFirebaseConfigured,
    activeOrder,
    verifyArrivalOtp,
    setChatPartner,
    setIsChatOpen
  } = useApp();

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [arrivalInput, setArrivalInput] = useState('');

  // Format countdown seconds into mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerifyArrival = () => {
    if (arrivalInput.length !== 4) return;
    if (verifyArrivalOtp(arrivalInput)) setArrivalInput('');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#f8f9ff] min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-slate-100">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              aria-label="Back to Resident View"
              onClick={handleSelectMember}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#a14000] transition-all active:scale-95 border border-slate-200"
              title="Return to resident view"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <button
              aria-label="Go to Partner Home"
              onClick={() => navigateTo('partner')}
              className="shrink-0 active:scale-95 transition-transform"
            >
              <img
                src="/logo.svg"
                alt="KOODAM Community Logo"
                className="h-8 w-auto object-contain"
              />
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-base text-[#0b1c30] leading-none">Partner Hub</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-[#006c49] font-bold truncate">Partner Mode</span>
              </div>
              <span className="text-[11px] text-slate-500 truncate">Indiranagar Sector 3</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              aria-label="Profile & Settings"
              onClick={() => navigateTo('profile', 'profile')}
              title="Profile & settings"
              className="w-10 h-10 flex items-center justify-center rounded-full p-0.5 hover:ring-2 hover:ring-[#ff6a00]/30 active:scale-95 transition-all"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-slate-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1KUaHaxx9-0zLYxXwe1qxLJ0jJYPLqCFsAjNOyvD60uX5AVr6RK2dvGziPMtH59A3aJOvnqyPP4w30p4E-MWzvTTddgIC6_jhVaV3Vv4v4zJDxVLTZ4QyusKSFBoaOmYL-PNBEX0PpYEvExLZfM8KanBylMX25cDla34VsABdoAJ66XZXU9OnKsInNA-vLjrtqUCQUpQACDv33Rg9utw_2rQVKnXf6z5x0U5ZiTD0NIvTo9L6FiJNEg"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pb-10 px-4 space-y-3.5 pt-3">
        {/* Partner Online Status & Greeting Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  alt="Arun Varma"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1KUaHaxx9-0zLYxXwe1qxLJ0jJYPLqCFsAjNOyvD60uX5AVr6RK2dvGziPMtH59A3aJOvnqyPP4w30p4E-MWzvTTddgIC6_jhVaV3Vv4v4zJDxVLTZ4QyusKSFBoaOmYL-PNBEX0PpYEvExLZfM8KanBylMX25cDla34VsABdoAJ66XZXU9OnKsInNA-vLjrtqUCQUpQACDv33Rg9utw_2rQVKnXf6z5x0U5ZiTD0NIvTo9L6FiJNEg"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                    isPartnerOnline ? 'bg-[#00ae78]' : 'bg-slate-400'
                  }`}
                ></span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-[#0b1c30] truncate">
                    Good morning, Arun!
                  </span>
                  <span
                    className="material-symbols-outlined text-[17px] text-[#ff6a00]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <p className="text-[11px] text-[#5a4136] flex items-center gap-1 font-medium">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isPartnerOnline ? 'bg-[#00ae78] animate-ping' : 'bg-slate-400'
                    }`}
                  ></span>
                  {isPartnerOnline
                    ? 'Receiving orders within 5 km'
                    : 'Offline • Tap switch to receive tasks'}
                </p>
              </div>
            </div>

            {/* Online Status Switch */}
            <button
              aria-label="Toggle Online Status"
              onClick={togglePartnerDuty}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all active:scale-95 shrink-0 shadow-2xs border ${
                isPartnerOnline
                  ? 'bg-[#00ae78]/15 text-[#006c49] border-[#00ae78]/30'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPartnerOnline ? 'bg-[#00ae78] animate-pulse' : 'bg-slate-400'
                }`}
              ></span>
              <span>{isPartnerOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>

        {/* Live GPS Sharing Card */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isSharingLocation ? 'bg-[#00ae78]/15 text-[#006c49]' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">my_location</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0b1c30]">Live GPS Sharing</p>
              <p className="text-[11px] text-slate-500 truncate">
                {!isFirebaseConfigured
                  ? 'Add Firebase keys to .env.local to enable'
                  : isSharingLocation
                  ? partnerLocation
                    ? `Broadcasting (${partnerLocation.lat.toFixed(4)}, ${partnerLocation.lng.toFixed(4)})`
                    : 'Waiting for GPS fix…'
                  : 'Customer sees your real-time location once enabled'}
              </p>
            </div>
          </div>

          <button
            aria-label="Toggle Live GPS Sharing"
            disabled={!isFirebaseConfigured}
            onClick={isSharingLocation ? stopSharingLocation : startSharingLocation}
            className={`shrink-0 px-3 py-1.5 rounded-full font-bold text-xs transition-all active:scale-95 border disabled:opacity-40 disabled:cursor-not-allowed ${
              isSharingLocation
                ? 'bg-[#ffdbcc] text-[#a14000] border-[#ffdbcc]'
                : 'bg-[#eff4ff] text-[#0b1c30] border-slate-200'
            }`}
          >
            {isSharingLocation ? 'Stop' : 'Start'}
          </button>
        </div>

        {/* Message Customer (opens the same shared chat thread as the customer's Live Tracking screen) */}
        <button
          onClick={() => {
            setChatPartner('Priya Sharma');
            setIsChatOpen(true);
          }}
          className="w-full flex items-center justify-between gap-3 bg-white rounded-2xl p-4 shadow-xs border border-slate-100 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#a14000] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-[#0b1c30]">Message Customer</p>
              <p className="text-[11px] text-slate-500 truncate">Order {activeOrder.orderId} • {activeOrder.serviceTitle}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
        </button>

        {/* Arrival Code Verification — shown once the partner is en route to an accepted job */}
        {activeOrder.currentStep === 3 && (
          <section className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#ffdbcc] text-[#a14000] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">pin</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0b1c30]">Verify Arrival Code</p>
                <p className="text-[11px] text-slate-500 truncate">Ask the customer for their 4-digit code to start the job</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={arrivalInput}
                onChange={(e) => setArrivalInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter code"
                inputMode="numeric"
                className="flex-1 rounded-xl border border-slate-200 bg-[#f8f9ff] px-3 py-2.5 text-sm font-mono tracking-widest text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/40"
              />
              <button
                onClick={handleVerifyArrival}
                disabled={arrivalInput.length !== 4}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#a14000] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold active:scale-95 transition-all"
              >
                Verify & Start
              </button>
            </div>
          </section>
        )}

        {/* Completion Code — shown to the partner to share with the customer once work is done */}
        {activeOrder.currentStep === 4 && activeOrder.completionOtp && (
          <section className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#6ffbbe]/40 text-[#006c49] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0b1c30]">Share Completion Code</p>
                <p className="text-[11px] text-slate-500 truncate">Give this code to the customer once the job is done</p>
              </div>
            </div>
            <div className="shrink-0 bg-[#eff4ff] px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-base tracking-widest text-[#a14000] font-extrabold font-mono">
                {activeOrder.completionOtp}
              </span>
            </div>
          </section>
        )}

        {/* Incoming High-Priority Job Request Card (Flash alert style) */}
        {hasIncomingJob && (
          <section className="relative overflow-hidden bg-white rounded-2xl p-4 shadow-lg border border-[#ffdbcc] animate-in fade-in duration-300">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff6a00]/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Alert Header Banner */}
            <div className="flex items-center justify-between bg-[#ffdbcc] rounded-xl px-3 py-2 text-[#7b2f00] mb-3">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="material-symbols-outlined text-[18px] text-[#a14000] shrink-0 animate-bounce"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                <span className="text-xs font-bold truncate">New Request Nearby!</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 bg-white/90 px-2 py-0.5 rounded-full shadow-2xs text-[#a14000]">
                <span className="material-symbols-outlined text-[13px]">timer</span>
                <span className="text-xs font-bold font-mono">
                  {formatTime(incomingCountdown)}
                </span>
              </div>
            </div>

            {/* Job Details & Payout */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <span className="inline-block text-[10px] font-semibold text-[#4e5c92] bg-[#dce1ff]/60 px-2 py-0.5 rounded-md mb-1">
                  {incomingJobDetails.category}
                </span>
                <h3 className="font-bold text-sm text-[#0b1c30] line-clamp-1">
                  {incomingJobDetails.title}
                </h3>
                <p className="text-xs text-[#5a4136] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#a14000]">near_me</span>
                  <span className="font-bold text-[#0b1c30]">{incomingJobDetails.distance}</span> ({incomingJobDetails.etaMins} mins away) • {incomingJobDetails.area}
                </p>
              </div>

              <div className="text-right shrink-0 bg-[#eff4ff] px-2.5 py-1 rounded-xl">
                <p className="text-[10px] text-slate-400 font-medium">Est. Payout</p>
                <p className="text-base font-extrabold text-[#a14000]">₹{incomingJobDetails.payout}</p>
              </div>
            </div>

            {/* Customer Snippet */}
            <div className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-xl mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt={`Customer ${incomingJobDetails.customerName}`}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZKnQP42EPG0JORpP5bTXuIreTz7lfmiiSke3JZzhdqFV7Pjd2tXztHMC9EFtcT5E4kJn8YRuq5kEZ2bY4nLB26pkktCdavk6F9afmmNcRO2-78-t3OIh-d6M4MEHLzSSTtgitcy1iLAAEEID2qFcx87ghwK_nevrbzFgkGapbKiIL-k7CKiXuYJOLFBuvsbd1Yh0UejQrUggO7n7AEewo0rMhrh8u93xBcXUG6Blrutcyp3EPmw7TGw"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0b1c30] truncate">{incomingJobDetails.customerName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span
                      className="material-symbols-outlined text-[13px] text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-bold text-[#0b1c30]">{incomingJobDetails.customerRating}</span>
                    <span>• Verified Resident</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-[#006c49] bg-[#00ae78]/15 px-2 py-0.5 rounded-full font-bold shrink-0">
                Cash / UPI
              </span>
            </div>

            {/* Decision Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={declineIncomingJob}
                className="flex-1 py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold active:scale-95 transition-all text-center"
              >
                Decline
              </button>
              <button
                onClick={acceptIncomingJob}
                className="flex-[2] py-2.5 px-3 rounded-full bg-[#ff6a00] hover:bg-[#a14000] text-white text-xs font-bold active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Accept Job (Earn ₹{incomingJobDetails.payout})</span>
              </button>
            </div>
          </section>
        )}

        {/* Daily Earnings & Stats Bento Grid */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#0b1c30]">Earnings & Overview</h2>
            <span className="text-[10px] text-slate-400 font-medium">Updated Real-Time</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Today's Earnings */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold text-slate-500">Today's Earnings</span>
                <div className="w-7 h-7 rounded-full bg-[#ffdbcc] flex items-center justify-center text-[#a14000]">
                  <span className="material-symbols-outlined text-[16px]">currency_rupee</span>
                </div>
              </div>

              <div className="mt-2">
                <span className="text-2xl font-extrabold text-[#0b1c30] leading-none">
                  ₹{partnerStats.todayEarnings}
                </span>
                <p className="text-[11px] text-[#006c49] font-medium mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">task_alt</span>
                  {partnerStats.completedJobs} jobs completed
                </p>
              </div>
            </div>

            {/* Rating & Feedback */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold text-slate-500">Rating & Trust</span>
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#0b1c30] leading-none">
                    {partnerStats.rating}
                  </span>
                  <span
                    className="material-symbols-outlined text-[#ff6a00] text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {partnerStats.reviews} reviews • 98% pos.
                </p>
              </div>
            </div>

            {/* Weekly Balance Card (Span 2) */}
            <div className="col-span-2 bg-[#1b2a5e] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-slate-700">
              <div className="min-w-0">
                <p className="text-[11px] text-[#dce1ff] opacity-90">Weekly Available Balance</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold tracking-tight">₹{partnerStats.weeklyBalance}</span>
                  <span className="text-[10px] text-[#dce1ff]/80">Pending clearance: ₹0</span>
                </div>
              </div>

              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="bg-[#ff6a00] hover:bg-[#a14000] text-white px-3.5 py-2 rounded-full text-xs font-bold active:scale-95 transition-all shrink-0 flex items-center gap-1 shadow-md"
              >
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                Instant Withdraw
              </button>
            </div>
          </div>
        </section>

        {/* Recent Reviews from Customers */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#0b1c30]">Recent Reviews</h2>
            <span className="text-[10px] text-slate-400 font-medium">{reviews.length} total</span>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 text-center">
              <p className="text-xs text-slate-400">No reviews yet. They'll show up here once a customer rates a completed job.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-[15px] ${
                            i <= r.stars ? 'text-[#ff6a00]' : 'text-slate-200'
                          }`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{r.time}</span>
                  </div>
                  <p className="text-xs font-bold text-[#0b1c30] mt-1.5 truncate">{r.serviceTitle}</p>
                  {r.feedback && (
                    <p className="text-[11px] text-slate-500 mt-0.5">"{r.feedback}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Jobs & Upcoming Schedule */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#0b1c30]">Scheduled Ahead</h2>
            <button
              onClick={() => showToast('Calendar view opened')}
              className="text-xs text-[#a14000] font-bold hover:underline"
            >
              View Calendar
            </button>
          </div>

          <div className="space-y-2">
            {/* Job 1 */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#4e5c92] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">handyman</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#eff4ff] text-[#0b1c30] text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Today, 2:00 PM
                    </span>
                    <span className="text-[10px] text-[#006c49] font-semibold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ae78]"></span>
                      Confirmed
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#0b1c30] mt-1 truncate">
                    Ceiling Fan Fitting & Balancing
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    Customer: Vikram S. • 4th Cross, HAL 2nd Stage
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-xs text-[#a14000] shrink-0">₹249</span>
            </div>

            {/* Job 2 */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] flex items-center justify-center text-[#a14000] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#eff4ff] text-[#0b1c30] text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Tomorrow, 11:00 AM
                    </span>
                    <span className="text-[10px] text-[#006c49] font-semibold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ae78]"></span>
                      Confirmed
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#0b1c30] mt-1 truncate">
                    Inverter Wiring & MCB Safety Check
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    Customer: Ananya Rao • 100ft Road Defence Colony
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-xs text-[#a14000] shrink-0">₹499</span>
            </div>
          </div>
        </section>
      </main>

      {/* Withdrawal Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffdbcc] text-[#a14000] flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                </div>
                <h3 className="font-bold text-[#0b1c30] text-base">Instant UPI Payout</h3>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Transfer available balance directly to your registered UPI ID with zero fee.
            </p>

            <div className="bg-[#eff4ff] p-3 rounded-2xl mb-4 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Destination Account</span>
              <p className="text-xs font-bold text-[#0b1c30]">arun.varma@okhdfcbank</p>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-600">Transfer Amount:</span>
                <span className="text-base font-extrabold text-[#a14000]">
                  ₹{partnerStats.weeklyBalance}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setWithdrawModalOpen(false);
                showToast(`Payout of ₹${partnerStats.weeklyBalance} processed successfully to your UPI!`);
              }}
              className="w-full py-3 rounded-full bg-[#00ae78] hover:bg-[#006c49] text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Transfer ₹{partnerStats.weeklyBalance} to UPI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
