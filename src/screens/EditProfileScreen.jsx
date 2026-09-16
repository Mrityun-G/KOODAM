import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubHeader } from '../components/SubHeader';

export const EditProfileScreen = () => {
  const { userProfile, updateUserProfile, navigateTo, showToast } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    updateUserProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    navigateTo('profile', 'profile');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#f8f9ff] min-h-screen">
      <SubHeader title="Edit Profile" />

      <main className="flex-1 flex flex-col relative w-full pb-10 px-4 space-y-4 pt-4">
        <div className="flex flex-col items-center gap-2">
          <img
            className="w-20 h-20 rounded-2xl object-cover shadow-xs"
            alt={userProfile.name}
            src={userProfile.avatar}
          />
          <button
            onClick={() => showToast('Photo upload coming soon!')}
            className="text-xs font-bold text-[#a14000] hover:underline"
          >
            Change Photo
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3.5">
          <label className="block">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-[#f8f9ff] p-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/40"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-[#f8f9ff] p-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/40"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-[#f8f9ff] p-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/40"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-full bg-[#ff6a00] hover:bg-[#a14000] text-white font-bold text-sm shadow-md active:scale-95 transition-all"
        >
          Save Changes
        </button>
      </main>
    </div>
  );
};
