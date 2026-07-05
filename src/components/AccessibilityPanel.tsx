import React from 'react';
import { Type, Eye, Sparkles, Sliders, Smartphone, Check } from 'lucide-react';
import { ThemeMode, TremorSensitivity } from '../types';

interface AccessibilityPanelProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  tremorAssistOn: boolean;
  setTremorAssistOn: (on: boolean) => void;
  tremorSensitivity: TremorSensitivity;
  setTremorSensitivity: (sensitivity: TremorSensitivity) => void;
}

const fontSizes = [24, 32, 40, 48, 56, 64, 72];

export default function AccessibilityPanel({
  fontSize,
  setFontSize,
  themeMode,
  setThemeMode,
  tremorAssistOn,
  setTremorAssistOn,
  tremorSensitivity,
  setTremorSensitivity,
}: AccessibilityPanelProps) {

  // Styles based on high-contrast theme
  const getThemeClasses = () => {
    switch (themeMode) {
      case 'black-yellow':
        return {
          container: 'bg-[#FEF08A] text-black border-4 border-black p-6 rounded-2xl shadow-xl',
          sectionTitle: 'border-b-2 border-black pb-2 text-xl font-black mb-4',
          btnActive: 'bg-black text-[#FEF08A] border-4 border-black font-extrabold scale-105',
          btnInactive: 'bg-transparent text-black border-4 border-black/40 hover:border-black font-bold',
          badgeActive: 'bg-black text-[#FEF08A] border border-black',
        };
      case 'white-black':
        return {
          container: 'bg-[#1F2937] text-white border-4 border-white p-6 rounded-2xl shadow-xl',
          sectionTitle: 'border-b-2 border-white pb-2 text-xl font-black mb-4',
          btnActive: 'bg-white text-black border-4 border-white font-extrabold scale-105',
          btnInactive: 'bg-transparent text-white border-4 border-white/40 hover:border-white font-bold',
          badgeActive: 'bg-white text-black border border-white',
        };
      case 'dark-blue':
        return {
          container: 'bg-[#0F172A] text-white border-2 border-blue-500/30 p-6 rounded-2xl shadow-xl',
          sectionTitle: 'border-b border-blue-500/20 pb-2 text-xl font-extrabold mb-4 text-blue-400',
          btnActive: 'bg-blue-600 text-white border-2 border-blue-400 font-bold scale-105',
          btnInactive: 'bg-slate-800 text-slate-300 border-2 border-transparent hover:border-slate-600 font-bold',
          badgeActive: 'bg-blue-500 text-white',
        };
      case 'calm-blue':
      default:
        return {
          container: 'bg-white text-slate-800 border border-blue-100 p-6 rounded-2xl shadow-md',
          sectionTitle: 'border-b border-blue-100 pb-2 text-xl font-bold mb-4 text-[#1E40AF]',
          btnActive: 'bg-[#1E40AF] text-white border-2 border-transparent font-bold shadow-sm scale-105',
          btnInactive: 'bg-blue-50/50 text-[#1E40AF] border-2 border-blue-100/50 hover:bg-blue-50 hover:border-blue-200 font-semibold',
          badgeActive: 'bg-blue-600 text-white',
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <section className={`w-full ${classes.container} transition-colors duration-200`} id="accessibility-panel">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-6 h-6 text-current" />
        <h2 className="text-2xl font-black">Accessibility Controls</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Font Size Adjuster - Minimum 48px target size */}
        <div className="flex flex-col">
          <h3 className={`text-base font-bold ${classes.sectionTitle}`}>
            1. Magnified Font Size
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {fontSizes.map((size) => {
              const isActive = fontSize === size;
              return (
                <button
                  key={size}
                  id={`btn-fontsize-${size}`}
                  onClick={() => setFontSize(size)}
                  style={{ minHeight: '48px', minWidth: '56px' }}
                  className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 ${
                    isActive ? classes.btnActive : classes.btnInactive
                  }`}
                  aria-label={`Set font size to ${size} pixels`}
                >
                  <span className="text-lg font-black">{size}px</span>
                  <span className="text-[10px] opacity-75 font-mono">Size</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-2 opacity-80 italic font-medium">
            Currently adjusting: <span className="font-bold underline">{fontSize}px</span>. Ideal for reading comfort.
          </p>
        </div>

        {/* High Contrast Presets */}
        <div className="flex flex-col">
          <h3 className={`text-base font-bold ${classes.sectionTitle}`}>
            2. High Contrast Colors
          </h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* Calm Blue */}
            <button
              id="theme-calm-blue"
              onClick={() => setThemeMode('calm-blue')}
              style={{ minHeight: '52px' }}
              className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all duration-150 ${
                themeMode === 'calm-blue'
                  ? 'border-blue-600 bg-blue-50 text-[#1E40AF] font-bold ring-2 ring-blue-400'
                  : 'border-slate-200 bg-white text-[#1E40AF] hover:border-blue-300'
              }`}
              aria-label="Calm Blue contrast mode"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1E40AF] border border-white inline-block"></span>
                <span className="text-sm font-semibold">Calm Blue</span>
              </div>
              {themeMode === 'calm-blue' && <Check className="w-5 h-5" />}
            </button>

            {/* Black on Yellow */}
            <button
              id="theme-black-yellow"
              onClick={() => setThemeMode('black-yellow')}
              style={{ minHeight: '52px' }}
              className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all duration-150 ${
                themeMode === 'black-yellow'
                  ? 'border-black bg-[#FEF08A] text-black font-extrabold ring-4 ring-black/30'
                  : 'border-slate-300 bg-[#FEF08A] text-black hover:border-black'
              }`}
              aria-label="High Contrast Yellow contrast mode"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black border border-[#FEF08A] inline-block"></span>
                <span className="text-sm font-black">Yellow / Black</span>
              </div>
              {themeMode === 'black-yellow' && <Check className="w-5 h-5" />}
            </button>

            {/* White on Black */}
            <button
              id="theme-white-black"
              onClick={() => setThemeMode('white-black')}
              style={{ minHeight: '52px' }}
              className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all duration-150 ${
                themeMode === 'white-black'
                  ? 'border-white bg-[#1F2937] text-white font-extrabold ring-4 ring-white/30'
                  : 'border-slate-600 bg-[#1F2937] text-white hover:border-white'
              }`}
              aria-label="High Contrast Black contrast mode"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black inline-block"></span>
                <span className="text-sm font-bold">Black / White</span>
              </div>
              {themeMode === 'white-black' && <Check className="w-5 h-5" />}
            </button>

            {/* Dark Blue */}
            <button
              id="theme-dark-blue"
              onClick={() => setThemeMode('dark-blue')}
              style={{ minHeight: '52px' }}
              className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all duration-150 ${
                themeMode === 'dark-blue'
                  ? 'border-blue-500 bg-[#0F172A] text-white font-bold ring-2 ring-blue-500'
                  : 'border-slate-800 bg-[#0F172A] text-slate-300 hover:border-slate-600'
              }`}
              aria-label="Dark Blue night mode"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#3B82F6] border border-white inline-block"></span>
                <span className="text-sm font-semibold">Dark Blue</span>
              </div>
              {themeMode === 'dark-blue' && <Check className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tremor Assist Controls */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-current/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${tremorAssistOn ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-200 text-slate-600'}`}>
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg flex items-center gap-2">
                Tremor Compensation Assist
                <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase font-black ${tremorAssistOn ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                  {tremorAssistOn ? 'Active' : 'Off'}
                </span>
              </h4>
              <p className="text-xs opacity-80 font-medium">
                Uses gyroscopic sensors to stabilize text in response to shaky hands.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Toggle Button */}
            <button
              id="btn-toggle-tremor"
              onClick={() => setTremorAssistOn(!tremorAssistOn)}
              style={{ minHeight: '48px', minWidth: '120px' }}
              className={`flex-1 md:flex-initial flex items-center justify-center px-6 py-2 rounded-xl font-bold transition-all duration-150 ${
                tremorAssistOn
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                  : classes.btnInactive
              }`}
            >
              {tremorAssistOn ? 'Toggle Off' : 'Toggle On'}
            </button>

            {/* Sensitivity Presets */}
            {tremorAssistOn && (
              <div className="flex items-center bg-current/5 p-1 rounded-xl gap-1">
                {(['low', 'medium', 'high'] as TremorSensitivity[]).map((level) => {
                  const isActive = tremorSensitivity === level;
                  return (
                    <button
                      key={level}
                      id={`btn-sensitivity-${level}`}
                      onClick={() => setTremorSensitivity(level)}
                      style={{ minHeight: '40px' }}
                      className={`px-3 py-1 rounded-lg text-xs capitalize font-extrabold transition-all duration-150 ${
                        isActive ? classes.badgeActive : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
