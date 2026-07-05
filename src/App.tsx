import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AccessibilityPanel from './components/AccessibilityPanel';
import StabilizedViewport from './components/StabilizedViewport';
import TextInput from './components/TextInput';
import ReportsTab from './components/ReportsTab';
import ExercisesTab from './components/ExercisesTab';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { ThemeMode, TremorSensitivity } from './types';
import { Smartphone, Zap, Eye, Activity } from 'lucide-react';

export default function App() {
  // Main states
  const [activeTab, setActiveTab] = useState<'read' | 'scanner' | 'exercises'>('read');
  const [fontSize, setFontSize] = useState<number>(32); // Default to a highly legible 32px
  const [themeMode, setThemeMode] = useState<ThemeMode>('calm-blue');
  const [tremorAssistOn, setTremorAssistOn] = useState<boolean>(true); // Enabled by default to aid seniors
  const [tremorSensitivity, setTremorSensitivity] = useState<TremorSensitivity>('medium');
  const [streakCount, setStreakCount] = useState<number>(3); // Default streak of 3 days to feel active

  // Granddaughter's lovely initial WhatsApp message
  const [text, setText] = useState<string>(
    "Hi Grandfather! Hope you are feeling better today. I left the blue medicine box on your dining table. Please take exactly 1 capsule after lunch with plenty of water. Call me when you read this! Love, Kavya ❤️"
  );

  // Load state from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('tremor_font_size');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));

    const savedThemeMode = localStorage.getItem('tremor_theme_mode');
    if (savedThemeMode) setThemeMode(savedThemeMode as ThemeMode);

    const savedTremorAssist = localStorage.getItem('tremor_assist_on');
    if (savedTremorAssist) setTremorAssistOn(savedTremorAssist === 'true');

    const savedSensitivity = localStorage.getItem('tremor_sensitivity');
    if (savedSensitivity) setTremorSensitivity(savedSensitivity as TremorSensitivity);

    const savedStreak = localStorage.getItem('tremor_streak_count');
    if (savedStreak) {
      setStreakCount(parseInt(savedStreak));
    } else {
      localStorage.setItem('tremor_streak_count', '3');
    }
  }, []);

  // Save states to localStorage on change
  const handleSetFontSize = (size: number) => {
    setFontSize(size);
    localStorage.setItem('tremor_font_size', size.toString());
  };

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem('tremor_theme_mode', mode);
  };

  const handleSetTremorAssist = (on: boolean) => {
    setTremorAssistOn(on);
    localStorage.setItem('tremor_assist_on', on.toString());
  };

  const handleSetSensitivity = (sensitivity: TremorSensitivity) => {
    setTremorSensitivity(sensitivity);
    localStorage.setItem('tremor_sensitivity', sensitivity);
  };

  // Connect Web Speech Synthesis engine for Word-by-Word highlighting
  const {
    isPlaying,
    isPaused,
    spokenWordIndex,
    wordsList,
    play,
    stop,
  } = useTextToSpeech();

  // Dynamic colors for the main wrapper based on High Contrast Theme selection
  const getPageStyles = () => {
    switch (themeMode) {
      case 'black-yellow':
        return {
          bg: 'bg-black text-white min-h-screen pb-12 selection:bg-yellow-500 selection:text-black',
          innerContainer: 'max-w-4xl mx-auto px-4 py-6 space-y-6',
        };
      case 'white-black':
        return {
          bg: 'bg-[#1F2937] text-white min-h-screen pb-12 selection:bg-white selection:text-black',
          innerContainer: 'max-w-4xl mx-auto px-4 py-6 space-y-6',
        };
      case 'dark-blue':
        return {
          bg: 'bg-[#0B0F19] text-slate-100 min-h-screen pb-12 selection:bg-blue-500 selection:text-white',
          innerContainer: 'max-w-4xl mx-auto px-4 py-6 space-y-6',
        };
      case 'calm-blue':
      default:
        return {
          bg: 'bg-[#E8F4F8] text-slate-800 min-h-screen pb-12 selection:bg-blue-200 selection:text-blue-900',
          innerContainer: 'max-w-4xl mx-auto px-4 py-6 space-y-6',
        };
    }
  };

  const styles = getPageStyles();

  return (
    <div className={styles.bg}>
      {/* Brand & Tabs Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          stop(); // Stop speaking when changing tabs
        }}
        themeMode={themeMode}
        streakCount={streakCount}
      />

      <main className={styles.innerContainer}>
        {/* TAB 1: READ VIEW (MAGNIFIED TEXT READER WITH ACCELEROMETER/TREMOR COMPENSATED VIEWPORT) */}
        {activeTab === 'read' && (
          <div className="space-y-6 animate-fade-in">
            {/* TextInput component */}
            <TextInput 
              text={text} 
              setText={setText} 
              themeMode={themeMode} 
            />

            {/* Accessibility Controls Panel */}
            <AccessibilityPanel
              fontSize={fontSize}
              setFontSize={handleSetFontSize}
              themeMode={themeMode}
              setThemeMode={handleSetThemeMode}
              tremorAssistOn={tremorAssistOn}
              setTremorAssistOn={handleSetTremorAssist}
              tremorSensitivity={tremorSensitivity}
              setTremorSensitivity={handleSetSensitivity}
            />

            {/* Floating TTS Controls above viewport */}
            <div className="flex items-center justify-between bg-current/5 p-4 rounded-xl border border-current/10">
              <span className="text-sm font-extrabold flex items-center gap-2">
                <Smartphone className="w-4 h-4 animate-bounce" />
                Speech Synthesis Voice Reader
              </span>
              <div className="flex gap-2">
                {!isPlaying ? (
                  <button
                    id="btn-play-tts-main"
                    onClick={() => play(text)}
                    style={{ minHeight: '44px' }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 rounded-xl text-sm shadow-md"
                  >
                    Read Message Aloud
                  </button>
                ) : (
                  <button
                    id="btn-stop-tts-main"
                    onClick={stop}
                    style={{ minHeight: '44px' }}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 rounded-xl text-sm shadow-md"
                  >
                    Stop Speaking
                  </button>
                )}
              </div>
            </div>

            {/* Stabilized Magnifying Reading Viewport */}
            <StabilizedViewport
              text={text}
              fontSize={fontSize}
              themeMode={themeMode}
              tremorAssistOn={tremorAssistOn}
              tremorSensitivity={tremorSensitivity}
              wordsList={wordsList}
              spokenWordIndex={spokenWordIndex}
            />
          </div>
        )}

        {/* TAB 2: SMART SCANNER VIEW (GEMINI POWERED OCR & MEDICINE WARNING PARSER) */}
        {activeTab === 'scanner' && (
          <div className="animate-fade-in">
            <ReportsTab
              themeMode={themeMode}
              onReadText={(scannedText) => {
                setText(scannedText);
                setActiveTab('read'); // Automatically focus back to stabilized reader
              }}
              readAloud={play}
              isTtsPlaying={isPlaying}
              stopTts={stop}
            />
          </div>
        )}

        {/* TAB 3: DAILY THERAPEUTIC EXERCISES & STABILITY MINI-GAME */}
        {activeTab === 'exercises' && (
          <div className="animate-fade-in">
            <ExercisesTab
              themeMode={themeMode}
              streakCount={streakCount}
              setStreakCount={setStreakCount}
              readAloud={play}
              isTtsPlaying={isPlaying}
              stopTts={stop}
            />
          </div>
        )}
      </main>
    </div>
  );
}
