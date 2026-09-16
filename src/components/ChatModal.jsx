import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const ChatModal = () => {
  const { isChatOpen, setIsChatOpen, chatPartner, messages, sendChatMessage, role } = useApp();
  const myRole = role === 'partner' ? 'partner' : 'member';
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  if (!isChatOpen) return null;

  const quickReplies = [
    'Are you nearby?',
    'I am on the 2nd floor',
    'Please call when you reach',
    'Where to park two-wheeler?'
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#f8f9ff] h-[85vh] sm:h-[650px] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-8 duration-200">
        {/* Chat Header */}
        <div className="px-4 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJFP-hU-FEvoiJVzKzRp5W3wJOlmXvEIgsYb8I9Nmnf3XEq3dbTrQZ-NUDt5Cae6rToq_UsMM47w7oI4k31EWKotizKHaHa6paxpDCLq86tWj_0lR9U4DWJo4S5marrKLXymEKlXE1p9hioIBsUxdzwrwiQoNPjVq1YSg_qmiN58moH7YnlnV0w1FiNYrNcQzllBVwnvN640h9SbhbmRFpTLl6OBH6OWKG_RLEd2Z_WyLrjXVY5faO4w"
                alt={chatPartner}
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#0b1c30]">{chatPartner}</h3>
                <span className="material-symbols-outlined text-[15px] text-[#00ae78]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <p className="text-[11px] text-[#006c49] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ae78] animate-ping"></span>
                Active on TVS Jupiter (0.8 km)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="tel:+919876543210"
              className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#a14000] flex items-center justify-center hover:bg-[#ffdbcc] transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">call</span>
            </a>
            <button
              onClick={() => setIsChatOpen(false)}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">close</span>
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8f9ff]">
          <div className="flex justify-center">
            <span className="text-[11px] bg-slate-200/70 text-slate-600 px-3 py-1 rounded-full font-medium">
              Encrypted neighborhood chat for Order #KD-8924
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === myRole ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-xs text-sm ${
                  msg.sender === myRole
                    ? 'bg-[#ff6a00] text-white rounded-br-xs font-medium'
                    : 'bg-white text-[#0b1c30] rounded-bl-xs border border-slate-100'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white/70 backdrop-blur-xs border-t border-slate-100 flex gap-2 overflow-x-auto">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => sendChatMessage(reply)}
              className="px-3 py-1 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#404e83] text-xs font-medium shrink-0 transition-colors active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message Arun..."
            className="flex-1 h-11 px-4 rounded-full bg-[#eff4ff] text-sm text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/30"
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-full bg-[#ff6a00] hover:bg-[#a14000] text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[19px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
