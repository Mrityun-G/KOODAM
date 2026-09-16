import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { NavigationBar } from '../components/NavigationBar';
import { VoiceAssistant } from '../components/VoiceAssistant';

export const UserHomeScreen = () => {
  const {
    location,
    handleBookHelper,
    setIsChatOpen,
    setChatPartner,
    setIsEmergencyModalOpen,
    navigateTo,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterActive, setFilterActive] = useState(false);

  // 8 Service Categories from Stitch Design System
  const categories = [
    { id: 'cleaning', name: 'Cleaning & Sanitize', icon: 'cleaning_services', bg: 'bg-[#d3e4fe]', color: 'text-[#a14000]' },
    { id: 'electrical', name: 'Electrical Works', icon: 'bolt', bg: 'bg-[#ffdbcc]', color: 'text-[#a14000]' },
    { id: 'plumbing', name: 'Plumbing & Repair', icon: 'plumbing', bg: 'bg-[#dce1ff]', color: 'text-[#4e5c92]' },
    { id: 'ac', name: 'AC & Appliance', icon: 'mode_fan', bg: 'bg-[#6ffbbe]', color: 'text-[#006c49]' },
    { id: 'carpentry', name: 'Carpentry & Decor', icon: 'carpenter', bg: 'bg-[#e5eeff]', color: 'text-[#5a4136]' },
    { id: 'painting', name: 'Painting & Decor', icon: 'format_paint', bg: 'bg-[#d3e4fe]', color: 'text-[#a14000]' },
    { id: 'tech', name: 'Tech & Wi-Fi', icon: 'router', bg: 'bg-[#dce1ff]', color: 'text-[#4e5c92]' },
    { id: 'elder', name: 'Elder & Pets', icon: 'volunteer_activism', bg: 'bg-[#6ffbbe]', color: 'text-[#006c49]' }
  ];

  // Helper Profiles from Stitch
  const helpers = [
    {
      id: 'arun',
      name: 'Arun Varma',
      category: 'electrical',
      title: 'Master Electrician & Smart Home Tech',
      rating: 4.92,
      reviewsCount: 184,
      distance: '1.1 km away',
      badge: 'Verified Partner',
      badgeColor: 'bg-[#6ffbbe] text-[#002113]',
      rate: '₹399',
      unit: '/ diagnostic',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJFP-hU-FEvoiJVzKzRp5W3wJOlmXvEIgsYb8I9Nmnf3XEq3dbTrQZ-NUDt5Cae6rToq_UsMM47w7oI4k31EWKotizKHaHa6paxpDCLq86tWj_0lR9U4DWJo4S5marrKLXymEKlXE1p9hioIBsUxdzwrwiQoNPjVq1YSg_qmiN58moH7YnlnV0w1FiNYrNcQzllBVwnvN640h9SbhbmRFpTLl6OBH6OWKG_RLEd2Z_WyLrjXVY5faO4w',
      vehicle: 'TVS Jupiter • KA-03-HM-4122'
    },
    {
      id: 'rajesh',
      name: 'Rajesh Kumar',
      category: 'electrical',
      title: 'Electrician & Appliance Specialist',
      rating: 4.9,
      reviewsCount: 128,
      distance: '0.8 km away',
      badge: 'Verified Neighbor',
      badgeColor: 'bg-[#6ffbbe] text-[#002113]',
      rate: '₹299',
      unit: '/ hr',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo8_JWX51DnHDJxHslSeqP8-OnCRNVpFGp6VuwxXIrGPMa7ylEnSc72HszM5Sq48mM-KE1xaklzwxAlPSiaSllRITkIxCU_CE5RKaQKj29zPm_4v8quCCPpj4Qn46sNlhUx1R8jKhms9lzQl7s670aCJh-nC7bHCNwTsJcao8kmjCdMWQhq4ECHXozrIBA52IIgIEhc_9khVu2TCU9D9Q9G7wtJlWzxZc6jX1x4asS612h_wnv6FhYbQ',
      vehicle: 'Honda Activa • KA-01-EQ-9081'
    },
    {
      id: 'lakshmi',
      name: 'Lakshmi Devi',
      category: 'cleaning',
      title: 'Home Deep Cleaning & Organizing',
      rating: 4.95,
      reviewsCount: 210,
      distance: '1.2 km away',
      badge: 'Police Verified',
      badgeColor: 'bg-[#dce1ff] text-[#05164b]',
      rate: '₹499',
      unit: '/ visit',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXsWBpn3c-GO-G-jbWVl1pLF3oNzqZ4VFzJzQTmERQ1r41Ts11g2-JlLGqGT4WBfcOIIr5rzYjD39sxeOKey5USQV_ySz9-LsRI8AegIAg_lyrY8TzPC1Mz7qI2JS0v4X51LLZ7QvyhJY0IlU33f8UPznITSx9wTPtjeWL29k93V5F9U4M5Jqg6WWw43EGLpnENskP4Y7krsThFpP5bjkEi51yz1IoklyfI-O8Oqm-D21IO-PxXlIAmQ',
      vehicle: 'Local Resident • 5th Cross'
    }
  ];

  // Filter logic
  const filteredHelpers = helpers.filter(h => {
    const matchesSearch = searchQuery === '' || 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || h.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#f8f9ff]">
      <Header subtitle="Home" />
      <VoiceAssistant />

      <main className="flex-1 flex flex-col relative w-full pb-6">
        {/* Search & Filter Bar Section */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-xs border border-slate-100">
            <div className="flex items-center gap-2 flex-1 pl-2 min-w-0">
              <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[#0b1c30] placeholder:text-slate-400 text-xs focus:outline-none min-w-0 font-medium"
                placeholder='Search "AC repair", "Electrician", "Elder care"...'
                type="text"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 text-xs p-1">
                  ✕
                </button>
              )}
            </div>
            <button
              aria-label="Filter Options"
              onClick={() => {
                setFilterActive(!filterActive);
                showToast(filterActive ? 'Filters reset' : 'Filtered to high rated verified only');
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                filterActive
                  ? 'bg-[#ff6a00] text-white'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#d3e4fe]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">tune</span>
            </button>
          </div>
        </div>

        {/* Neighborhood Activity Sparkle Pill */}
        <div className="px-4 py-1">
          <div className="flex items-center justify-between gap-2 bg-[#eff4ff] px-3.5 py-1.5 rounded-full shadow-2xs border border-slate-100">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="material-symbols-outlined text-[#ff6a00] text-[17px] shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="text-[11px] text-[#0b1c30] font-semibold truncate">
                1,420+ tasks completed in {location.split(',')[0]} this week!
              </span>
            </div>
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6a00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a14000]"></span>
            </span>
          </div>
        </div>

        {/* Community Broadcast / Emergency Card */}
        <div className="px-4 py-1.5">
          <div
            onClick={() => setIsEmergencyModalOpen(true)}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6a00] via-[#a14000] to-[#7b2f00] text-white p-4 shadow-md cursor-pointer hover:shadow-lg transition-all active:scale-98"
          >
            {/* Decorative pattern */}
            <div className="absolute -right-4 -bottom-6 opacity-15 pointer-events-none">
              <svg fill="none" height="120" viewBox="0 0 100 100" width="120">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeDasharray="6 6" strokeWidth="8" />
                <path d="M50 15V85M15 50H85" stroke="currentColor" strokeLinecap="round" strokeWidth="8" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
                  <span className="material-symbols-outlined text-[13px]">water_drop</span>
                  <span className="text-[10px] tracking-wide uppercase font-bold">Monsoon Drive</span>
                </div>
                <span className="text-[11px] text-[#ffdbcc] font-medium">Ward 112 Active</span>
              </div>

              <div className="flex flex-col mt-0.5">
                <h2 className="text-base font-extrabold text-white leading-tight">
                  Community Help Desk
                </h2>
                <p className="text-xs text-white/90 mt-0.5 leading-snug">
                  Ward monsoon preparedness is active! Need sandbags or immediate rooftop leak fixes? Tap here.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button className="flex items-center gap-1 text-xs text-white font-bold hover:underline">
                  <span>Request Emergency Aid</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                    34
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#00ae78] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Categories Grid Section */}
        <div className="px-4 pt-3 pb-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0b1c30]">Neighborhood Services</h2>
              <p className="text-xs text-[#5a4136]">Verified assistance within 15 minutes</p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-primary font-bold hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* 2x4 Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(isSelected ? null : cat.id);
                    showToast(isSelected ? 'Showing all services' : `Filtered to ${cat.name}`);
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all active:scale-95 shadow-2xs text-center border ${
                    isSelected
                      ? 'bg-[#ff6a00] text-white border-[#ff6a00] shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-[#0b1c30] border-slate-100'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-white/20 text-white' : `${cat.bg} ${cat.color}`
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                  </div>
                  <span
                    className={`text-[10px] leading-tight font-semibold line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-[#0b1c30]'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Realtime Help Map & Distance Pulse Micro-banner */}
        <div className="px-4 py-2">
          <div
            onClick={() => navigateTo('tracking', 'requests')}
            className="relative overflow-hidden rounded-2xl bg-[#eff4ff] p-3 flex items-center justify-between shadow-2xs border border-slate-100 cursor-pointer hover:bg-[#dce9ff] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#006c49]/10 flex items-center justify-center text-[#006c49] shrink-0">
                <span className="material-symbols-outlined text-[20px]">radar</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-[#0b1c30] font-bold truncate">Live Local Grid</span>
                <span className="text-[11px] text-[#5a4136] truncate">
                  18 verified helpers active near 100ft Road
                </span>
              </div>
            </div>
            <button className="px-3 py-1 rounded-full bg-[#1b2a5e] text-white text-[11px] font-semibold shrink-0 hover:bg-[#111a3a] transition-colors shadow-xs">
              Map View
            </button>
          </div>
        </div>

        {/* Top Helpers Section */}
        <div className="px-4 pt-1 pb-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-[#0b1c30]">Top Helpers Near You</h2>
              <span className="w-2 h-2 rounded-full bg-[#00ae78]"></span>
            </div>
            <span className="text-xs text-[#a14000] font-bold">
              {filteredHelpers.length} Available
            </span>
          </div>

          {/* Helper List */}
          <div className="flex flex-col gap-3">
            {filteredHelpers.map((helper) => (
              <div
                key={helper.id}
                className="bg-white rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-shadow flex flex-col gap-2 border border-slate-100"
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                      alt={helper.name}
                      src={helper.avatar}
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00ae78] flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-[#0b1c30] truncate">{helper.name}</h3>
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0b1c30] text-xs shrink-0">
                        <span
                          className="material-symbols-outlined text-[13px] text-amber-500"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-bold text-[11px]">{helper.rating}</span>
                        <span className="text-slate-400 text-[10px]">({helper.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#5a4136] truncate mt-0.5">{helper.title}</p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${helper.badgeColor}`}>
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        <span>{helper.badge}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">near_me</span>
                        {helper.distance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Pricing & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-medium">Starting from</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-extrabold text-[#a14000]">{helper.rate}</span>
                      <span className="text-xs text-slate-500">{helper.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      aria-label={`Chat with ${helper.name}`}
                      onClick={() => {
                        setChatPartner(helper.name);
                        setIsChatOpen(true);
                      }}
                      className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#1b2a5e] flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                    <button
                      onClick={() => handleBookHelper(helper)}
                      className="px-3.5 py-1.5 rounded-full bg-[#ff6a00] hover:bg-[#a14000] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>Quick Book</span>
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neighbor Trust Guarantee */}
        <div className="px-4 pb-2">
          <div className="bg-[#eff4ff] rounded-2xl p-3 flex items-center gap-3 shadow-2xs border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-[#6ffbbe] text-[#002113] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">handshake</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-xs font-bold text-[#0b1c30]">The KOODAM Neighbor Guarantee</h4>
              <p className="text-[11px] text-[#5a4136] mt-0.5 leading-snug">
                Zero commissions between neighbors. Every helper is identity-checked and vouched for by local residents.
              </p>
            </div>
          </div>
        </div>
      </main>

      <NavigationBar />
    </div>
  );
};
