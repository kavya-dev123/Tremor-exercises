import React, { useState, useEffect, useRef } from 'react';
import { ThemeMode, TremorSensitivity } from '../types';
import { Eye, Hand, Move, RotateCcw, AlertCircle } from 'lucide-react';

interface StabilizedViewportProps {
  text: string;
  fontSize: number;
  themeMode: ThemeMode;
  tremorAssistOn: boolean;
  tremorSensitivity: TremorSensitivity;
  wordsList?: string[];
  spokenWordIndex?: number | null;
}

export default function StabilizedViewport({
  text,
  fontSize,
  themeMode,
  tremorAssistOn,
  tremorSensitivity,
  wordsList = [],
  spokenWordIndex = null,
}: StabilizedViewportProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  // Simulated tremor state
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 });
  const [shakeIntensity, setShakeIntensity] = useState(2); // 1 = Low, 2 = Med, 3 = High
  const [isSimulatingShake, setIsSimulatingShake] = useState(true);

  // Real device motion state (if supported)
  const [realMotion, setRealMotion] = useState({ x: 0, y: 0 });
  const [deviceSupportsMotion, setDeviceSupportsMotion] = useState(false);

  // 1. Simulate hand shake (continuous wave pattern)
  useEffect(() => {
    if (!isSimulatingShake) {
      setShakeOffset({ x: 0, y: 0 });
      return;
    }

    let angle = 0;
    const interval = setInterval(() => {
      // Calculate shake offsets using a combination of sine/cosine waves for a natural erratic movement
      const frequency = 28; // Hz
      const amplitude = shakeIntensity === 1 ? 5 : shakeIntensity === 2 ? 12 : 22;
      
      const x = Math.sin(angle) * amplitude + Math.cos(angle * 1.7) * (amplitude / 2);
      const y = Math.cos(angle * 1.3) * amplitude + Math.sin(angle * 2.1) * (amplitude / 2);
      
      setShakeOffset({ x, y });
      angle += 0.25;
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isSimulatingShake, shakeIntensity]);

  // 2. Real gyroscopic motion listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setDeviceSupportsMotion(true);
        // Get raw tilting values, normalize slightly
        const factor = tremorSensitivity === 'low' ? 1.5 : tremorSensitivity === 'medium' ? 3 : 5.5;
        const x = (e.gamma) * factor;
        const y = (e.beta - 45) * factor; // assuming a natural 45-degree hold angle
        setRealMotion({ x, y });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [tremorSensitivity]);

  // Handle Dragging (Smooth Panning)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX - dragOffset.x,
        y: e.touches[0].clientY - dragOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setDragOffset({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y,
    });
  };

  const resetPanning = () => {
    setDragOffset({ x: 0, y: 0 });
  };

  // Determine current styling based on theme Mode
  const getThemeStyles = () => {
    switch (themeMode) {
      case 'black-yellow':
        return {
          cardBg: 'bg-[#FEF08A] text-black border-4 border-black',
          viewportBg: 'bg-black text-[#FEF08A] border-4 border-black',
          btn: 'bg-black text-[#FEF08A] border-2 border-black font-extrabold hover:bg-[#FEF08A] hover:text-black',
          highlight: 'bg-[#FEF08A] text-black px-1 rounded font-black',
          infoText: 'text-black font-extrabold',
        };
      case 'white-black':
        return {
          cardBg: 'bg-[#1F2937] text-white border-4 border-white',
          viewportBg: 'bg-white text-black border-4 border-[#1F2937]',
          btn: 'bg-white text-black border-2 border-white font-extrabold hover:bg-black hover:text-white',
          highlight: 'bg-yellow-200 text-black px-1 rounded font-black',
          infoText: 'text-white font-bold',
        };
      case 'dark-blue':
        return {
          cardBg: 'bg-[#0F172A] text-white border border-blue-500/30',
          viewportBg: 'bg-[#1E293B] text-slate-100 border border-slate-700',
          btn: 'bg-blue-600 text-white border border-blue-400 hover:bg-blue-700',
          highlight: 'bg-cyan-500 text-black font-bold px-1 rounded',
          infoText: 'text-slate-300',
        };
      case 'calm-blue':
      default:
        return {
          cardBg: 'bg-white text-slate-800 border border-blue-100 shadow-lg',
          viewportBg: 'bg-blue-50/40 text-[#1E40AF] border border-blue-100/50',
          btn: 'bg-[#1E40AF] text-white hover:bg-blue-800',
          highlight: 'bg-yellow-200 text-slate-900 font-semibold px-1 rounded',
          infoText: 'text-slate-600',
        };
    }
  };

  const styles = getThemeStyles();

  // Apply Tremor Compensation physics
  // If tremor assist is ON:
  // - The text layer translation has a counter-offset to stabilize it!
  // If tremor assist is OFF:
  // - No counter offset. The viewport frames literally shake the text.
  const containerShakeTransform = isSimulatingShake
    ? `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`
    : 'translate(0px, 0px)';

  const textStabilizationTransform = tremorAssistOn && isSimulatingShake
    ? `translate(${-shakeOffset.x}px, ${-shakeOffset.y}px)`
    : 'translate(0px, 0px)';

  // Combine dragging offset + stabilization
  const combinedTextTransform = `translate(${dragOffset.x + (tremorAssistOn ? -shakeOffset.x : 0)}px, ${dragOffset.y + (tremorAssistOn ? -shakeOffset.y : 0)}px)`;

  // Split text into individual words for speech highlighting if available
  const renderTextContent = () => {
    if (!text) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center opacity-60">
          <AlertCircle className="w-8 h-8 mb-2 text-current" />
          <p className="text-lg font-bold">No text provided.</p>
          <p className="text-xs">Paste some text above or snap a picture in the Scanner tab!</p>
        </div>
      );
    }

    if (wordsList.length > 0) {
      return (
        <div className="leading-relaxed whitespace-pre-wrap select-none p-4">
          {wordsList.map((word, idx) => {
            const isWordHighlighted = idx === spokenWordIndex;
            return (
              <span
                key={idx}
                className={`transition-colors duration-100 ${
                  isWordHighlighted ? styles.highlight : ''
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      );
    }

    return <div className="leading-relaxed p-4 select-none whitespace-pre-wrap">{text}</div>;
  };

  return (
    <div className={`rounded-2xl p-6 ${styles.cardBg} flex flex-col gap-4 shadow-md`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/10 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-current" />
          <h3 className="text-xl font-bold">Magnified Stabilized Viewport</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulated Shaking Controls - helps demonstrate feature on desktop */}
          <div className="flex items-center bg-current/5 rounded-xl px-3 py-1 gap-2">
            <span className="text-xs font-bold whitespace-nowrap">Simulate Tremor:</span>
            <input
              id="sim-tremor-toggle"
              type="checkbox"
              checked={isSimulatingShake}
              onChange={(e) => setIsSimulatingShake(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
            />
            {isSimulatingShake && (
              <select
                id="sim-tremor-intensity"
                value={shakeIntensity}
                onChange={(e) => setShakeIntensity(Number(e.target.value))}
                className="text-xs font-extrabold bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value={1} className="text-black">Mild</option>
                <option value={2} className="text-black">Moderate</option>
                <option value={3} className="text-black">Severe</option>
              </select>
            )}
          </div>

          <button
            id="btn-reset-pan"
            onClick={resetPanning}
            style={{ minHeight: '36px' }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${styles.btn}`}
            title="Reset text position to center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset position</span>
          </button>
        </div>
      </div>

      {/* Shake demonstration helper bar */}
      {isSimulatingShake && (
        <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${tremorAssistOn ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
          <div className={`w-2 h-2 rounded-full ${tremorAssistOn ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-pulse'}`}></div>
          <span className="font-semibold">
            {tremorAssistOn 
              ? '✨ Tremor Assist is counter-moving text. Hold mouse button or finger to pan.' 
              : '⚠️ Shaky Hands simulated. Text is dancing and hard to read. Toggle "Tremor Compensation Assist" to steady it!'}
          </span>
        </div>
      )}

      {/* Viewport Frame - this has the simulated shake applied directly */}
      <div 
        className="relative overflow-hidden rounded-xl border-2 border-current/20 h-[320px] cursor-grab active:cursor-grabbing select-none focus:outline-none"
        style={{
          transform: containerShakeTransform,
          transition: isDragging ? 'none' : 'transform 0.05s ease-out',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
      >
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

        {/* Text Container Layer - this counter-balances the shake when assist is ON */}
        <div
          ref={viewportRef}
          className="absolute w-full h-full flex items-start justify-start overflow-visible"
          style={{
            transform: combinedTextTransform,
            fontSize: `${fontSize}px`,
            transition: isDragging ? 'none' : 'transform 0.05s ease-out',
          }}
        >
          <div className="w-full max-w-none text-left leading-normal font-sans tracking-wide">
            {renderTextContent()}
          </div>
        </div>

        {/* Floating Pan Instructions */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 pointer-events-none">
          <Move className="w-3 h-3" />
          <span>Drag/swipe text to pan</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs opacity-70">
        <span className="font-mono">Viewport: 24px - 72px Magnified</span>
        <span className="font-mono">{deviceSupportsMotion ? '📱 Gyroscope detected' : '💻 Cursor/simulation mode'}</span>
      </div>
    </div>
  );
}
