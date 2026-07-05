import React from 'react';
import { Smartphone, Zap, Activity, FileText, Settings, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  activeTab: 'read' | 'scanner' | 'exercises';
  setActiveTab: (tab: 'read' | 'scanner' | 'exercises') => void;
  themeMode: ThemeMode;
  streakCount: number;
}

export default function Header({ activeTab, setActiveTab, themeMode, streakCount }: HeaderProps) {
  // Styles based on current high-contrast theme
  const getThemeClasses = () => {
    switch (themeMode) {
      case 'black-yellow':
        return {
          bg: 'bg-[#FEF08A] text-black border-b-4 border-black',
          badge: 'bg-black text-[#FEF08A] border-2 border-black',
          btnActive: 'bg-black text-[#FEF08A] border-2 border-black font-extrabold',
          btnInactive: 'text-black border-2 border-transparent hover:border-black font-bold',
        };
      case 'white-black':
        return {
          bg: 'bg-[#1F2937] text-white border-b-4 border-white',
          badge: 'bg-white text-black border-2 border-white',
          btnActive: 'bg-white text-black border-2 border-white font-extrabold',
          btnInactive: 'text-white border-2 border-transparent hover:border-white font-bold',
        };
      case 'dark-blue':
        return {
          bg: 'bg-[#0F172A] text-white border-b-4 border-blue-500',
          badge: 'bg-blue-600 text-white',
          btnActive: 'bg-blue-600 text-white border-2 border-blue-400 font-bold',
          btnInactive: 'text-slate-300 border-2 border-transparent hover:border-slate-700 font-bold',
        };
      case 'calm-blue':
      default:
        return {
          bg: 'bg-white text-[#1E40AF] shadow-md border-b-2 border-blue-100',
          badge: 'bg-blue-100 text-[#1E40AF] font-semibold',
          btnActive: 'bg-[#1E40AF] text-white font-bold shadow-sm',
          btnInactive: 'text-[#1E40AF] hover:bg-blue-50 font-medium',
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <header className={`py-4 px-4 sm:px-6 ${classes.bg} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            {/* Styled Logo matching design specs */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-current animate-pulse" />
              <div className="absolute top-[14px] left-[6px] right-[6px] flex flex-col gap-1">
                <div className="h-[2px] bg-emerald-500 w-[14px] mx-auto rounded-full"></div>
                <div className="h-[2px] bg-emerald-500 w-[14px] mx-auto rounded-full"></div>
                <div className="h-[2px] bg-emerald-500 w-[14px] mx-auto rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center animate-ping"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-1">
                TremorLens
              </h1>
              {streakCount > 0 && (
                <div className={`px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 ${classes.badge}`}>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{streakCount} Day Streak</span>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm opacity-80 font-medium tracking-wide">
              “Read clearly, even when your hands shake.”
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Big touch targets: min 48px high) */}
        <nav className="flex items-center gap-2 w-full md:w-auto" aria-label="Main Navigation">
          <button
            id="tab-read"
            onClick={() => setActiveTab('read')}
            className={`flex-1 md:flex-initial h-12 px-5 rounded-xl flex items-center justify-center gap-2 text-base transition-all duration-150 ${
              activeTab === 'read' ? classes.btnActive : classes.btnInactive
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span>Read</span>
          </button>

          <button
            id="tab-scanner"
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 md:flex-initial h-12 px-5 rounded-xl flex items-center justify-center gap-2 text-base transition-all duration-150 ${
              activeTab === 'scanner' ? classes.btnActive : classes.btnInactive
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Smart Scanner</span>
          </button>

          <button
            id="tab-exercises"
            onClick={() => setActiveTab('exercises')}
            className={`flex-1 md:flex-initial h-12 px-5 rounded-xl flex items-center justify-center gap-2 text-base transition-all duration-150 ${
              activeTab === 'exercises' ? classes.btnActive : classes.btnInactive
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Exercises</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
