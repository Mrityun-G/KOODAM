import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export const VoiceAssistant = () => {
  const { handleVoiceBooking, showToast } = useApp();
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      showToast('Voice commands need Chrome or Edge on this device.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const text = Array.from(event.results).map(result => result[0].transcript).join('');
      setTranscript(text);
      if (event.results[0].isFinal) handleVoiceBooking(text);
    };
    recognition.onerror = () => {
      setIsListening(false);
      showToast('I could not hear that. Please try again.');
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <section className="mx-4 mt-3 overflow-hidden rounded-3xl bg-[#0b1c30] text-white shadow-lg shadow-[#0b1c30]/20">
      <div className="relative p-4">
        <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-[#6ffbbe]/30" />
        <div className="absolute -right-4 -top-6 h-20 w-20 rounded-full border border-[#ff6a00]/30" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6ffbbe]">
              <span className={`h-2 w-2 rounded-full ${isListening ? 'animate-ping bg-[#ff6a00]' : 'bg-[#6ffbbe]'}`} />
              Koodam voice automation
            </div>
            <h2 className="text-base font-extrabold">Tell us what you need</h2>
            <p className="mt-1 max-w-[250px] text-[11px] leading-relaxed text-slate-300">
              “I need a plumber for ₹500 by this morning”
            </p>
          </div>
          <button
            type="button"
            onClick={startListening}
            disabled={isListening}
            aria-label={isListening ? 'Listening' : 'Start voice booking'}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${isListening ? 'bg-[#ff6a00] shadow-lg shadow-[#ff6a00]/40' : 'bg-[#6ffbbe] text-[#002113] hover:bg-white'} disabled:cursor-wait`}
          >
            <span className="material-symbols-outlined text-[28px]">{isListening ? 'graphic_eq' : 'mic'}</span>
          </button>
        </div>
        {transcript && (
          <p className="relative mt-3 truncate rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-200">
            {supported ? transcript : 'Voice is not supported in this browser.'}
          </p>
        )}
      </div>
    </section>
  );
};