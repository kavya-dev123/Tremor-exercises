import React, { useState } from 'react';
import { Clipboard, FileText, Sparkles, Check, ArrowRight } from 'lucide-react';
import { ThemeMode } from '../types';

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  themeMode: ThemeMode;
}

const SAMPLE_PRESETS = [
  {
    label: "💬 WhatsApp Message",
    title: "WhatsApp message from granddaughter",
    text: "Hi Grandfather! Hope you are feeling better today. I left the blue medicine box on your dining table. Please take exactly 1 capsule after lunch with plenty of water. Call me when you read this! Love, Kavya ❤️"
  },
  {
    label: "💊 Medicine Label Instructions",
    title: "Generic Medicine directions",
    text: "AMOXICILLIN 500MG CAPSULES\nDOSAGE: Take one capsule three times daily. Finish the entire course of antibiotics unless instructed otherwise by your physician. Can be taken with or without food. Store in a dry, cool place."
  },
  {
    label: "📰 Local News Snippet",
    title: "Hyderabad Claude Hackathon clipping",
    text: "HYDERABAD, JULY 5, 2026: Local tech innovators gather in Hyderabad for a historic hackathon, aiming to build life-changing assistive technologies. Among the top prototypes, 'TremorLens' emerges as a beacon of hope for senior citizens living with Parkinson's and age-related tremors."
  }
];

export default function TextInput({ text, setText, themeMode }: TextInputProps) {
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const getThemeStyles = () => {
    switch (themeMode) {
      case 'black-yellow':
        return {
          cardBg: 'bg-[#FEF08A] text-black border-4 border-black p-6 rounded-2xl shadow-xl',
          inputBg: 'bg-black text-[#FEF08A] border-4 border-black font-bold placeholder-yellow-600/60',
          btn: 'bg-black text-[#FEF08A] border-2 border-black font-black hover:bg-[#FEF08A] hover:text-black',
          presetBtn: 'border-2 border-black/60 bg-black/5 hover:bg-black text-black hover:text-[#FEF08A]',
          label: 'text-black font-black text-lg',
        };
      case 'white-black':
        return {
          cardBg: 'bg-[#1F2937] text-white border-4 border-white p-6 rounded-2xl shadow-xl',
          inputBg: 'bg-white text-black border-4 border-white font-bold placeholder-gray-400',
          btn: 'bg-white text-black border-2 border-white font-bold hover:bg-black hover:text-white',
          presetBtn: 'border-2 border-white/60 bg-white/5 hover:bg-white text-white hover:text-black',
          label: 'text-white font-black text-lg',
        };
      case 'dark-blue':
        return {
          cardBg: 'bg-[#0F172A] text-white border border-blue-500/30 p-6 rounded-2xl shadow-xl',
          inputBg: 'bg-[#1E293B] text-white border border-slate-700 placeholder-slate-500 focus:border-blue-500',
          btn: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-400',
          presetBtn: 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white',
          label: 'text-blue-400 font-bold text-lg',
        };
      case 'calm-blue':
      default:
        return {
          cardBg: 'bg-white text-slate-800 border border-blue-100 p-6 rounded-2xl shadow-md',
          inputBg: 'bg-blue-50/20 text-slate-900 border border-blue-100 placeholder-slate-400 focus:border-blue-500 focus:bg-white',
          btn: 'bg-[#1E40AF] text-white hover:bg-blue-800',
          presetBtn: 'border border-blue-100 bg-blue-50/50 text-[#1E40AF] hover:bg-blue-50',
          label: 'text-[#1E40AF] font-bold text-lg',
        };
    }
  };

  const styles = getThemeStyles();

  // One-tap Clipboard paste helper
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          setText(clipboardText);
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 2000);
        } else {
          alert("Clipboard is empty. Try typing or click a preset below!");
        }
      } else {
        // Fallback instructions if API blocked/iframe constraints
        alert("Due to browser security in this preview, please press Ctrl+V (or command+V) inside the text box to paste your copied text.");
      }
    } catch (err) {
      alert("Please paste your text directly using Ctrl+V or select one of our easy Grandfather presets below!");
    }
  };

  return (
    <div className={`${styles.cardBg} flex flex-col gap-4 transition-colors duration-200`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-current/10 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-current" />
          <h3 className={`${styles.label}`}>Paste or Type Text to Read</h3>
        </div>

        <button
          id="btn-paste-clipboard"
          onClick={handlePaste}
          style={{ minHeight: '48px' }}
          className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-base font-extrabold transition-all duration-150 ${styles.btn}`}
        >
          {copiedSuccess ? (
            <>
              <Check className="w-5 h-5 text-emerald-500" />
              <span>Pasted!</span>
            </>
          ) : (
            <>
              <Clipboard className="w-5 h-5" />
              <span>One-Tap Paste</span>
            </>
          )}
        </button>
      </div>

      {/* Large Input Text Area */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="text-input" className="sr-only">Type or paste text content</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Grandfather, paste your WhatsApp message or type anything here to read it clearly and stable..."
          className={`w-full h-36 p-4 rounded-xl resize-none text-base outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 ${styles.inputBg}`}
        />
      </div>

      {/* Preset Buttons for Grandfather */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Or try a helpful reading preset:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              id={`btn-preset-${idx}`}
              onClick={() => setText(preset.text)}
              style={{ minHeight: '48px' }}
              className={`flex-1 min-w-[150px] px-3.5 py-2 rounded-xl text-sm font-bold flex items-center justify-between gap-1 transition-all duration-150 ${styles.presetBtn}`}
              title={preset.title}
            >
              <span>{preset.label}</span>
              <ArrowRight className="w-4 h-4 opacity-75" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
