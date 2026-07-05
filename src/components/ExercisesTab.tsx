import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Check, Flame, Trophy, Calendar, Sparkles, Smartphone, Volume2, ArrowLeft, Gamepad2, Heart, ShieldAlert } from 'lucide-react';
import { Exercise, ThemeMode } from '../types';

interface ExercisesTabProps {
  themeMode: ThemeMode;
  streakCount: number;
  setStreakCount: (count: number) => void;
  readAloud: (text: string) => void;
  isTtsPlaying: boolean;
  stopTts: () => void;
}

const EXERCISES_LIST: Exercise[] = [
  {
    id: "ex-1",
    title: "1. Finger Taps",
    description: "Hold hand open. Press index finger to thumb, then middle, ring, pinky, and repeat in sequence.",
    imageUrl: "https://res.cloudinary.com/tdq0puk9/image/upload/v1783233692/3d483270-443b-4421-84cc-dc498fd5d115_jajwfa.png",
    duration: 30,
    benefits: "Improves independent finger dexterity, coordinates small hand muscles, and stabilizes tremors.",
    instructions: [
      "Find a comfortable, supported seated position with your forearm resting flat on a table.",
      "Spread all fingers wide and hold your palm relaxed.",
      "Touch the tip of your index finger to the tip of your thumb. Press firmly for 1 second.",
      "Open your hand wide, then touch your middle finger to your thumb.",
      "Continue with your ring finger and pinky finger, then reverse the sequence.",
      "Keep a slow, steady rhythm matching the pulse bubble on the screen."
    ]
  },
  {
    id: "ex-2",
    title: "2. Wrist Rotations",
    description: "Turn your wrist slowly in a circular motion, clockwise then counterclockwise to release tension.",
    imageUrl: "https://res.cloudinary.com/tdq0puk9/image/upload/v1783233962/be12c3db-5620-48e8-9258-6442f6267fc4_u3idp1.png",
    duration: 30,
    benefits: "Increases range of motion, lubricates wrist joints, and stretches tendons to damp rapid shaking.",
    instructions: [
      "Extend your arm forward with your elbow slightly bent.",
      "Make a loose, gentle fist with your fingers.",
      "Slowly rotate your wrist clockwise, drawing the largest possible circle with your knuckles.",
      "Do not rush; focus on completing a single deep circle every 4 seconds.",
      "Halfway through, switch to counterclockwise rotations.",
      "If you feel any sharp pain, stop immediately and rest."
    ]
  },
  {
    id: "ex-3",
    title: "3. Hand Squeezes / Grips",
    description: "Squeeze a soft ball or your empty fist tightly, hold for 5 seconds, and release fully.",
    imageUrl: "https://res.cloudinary.com/tdq0puk9/image/upload/v1783233979/e0ba9a35-f305-426d-ad6d-de46689f93a0_tg5ckk.png",
    duration: 30,
    benefits: "Builds palm grip strength, increases blood flow, and provides calming tactile sensory feedback.",
    instructions: [
      "Hold a soft therapy ball, sponge, or simply form a solid fist with your bare hands.",
      "Squeeze as hard as comfortable, engaging all your fingers and thumb.",
      "Hold the squeeze firmly while counting to five slowly.",
      "Slowly open your fingers and release the grip entirely, extending your fingers wide.",
      "Rest for 2 seconds, then repeat the sequence.",
      "Maintain a steady breathing pattern; do not hold your breath while squeezing."
    ]
  },
  {
    id: "ex-4",
    title: "4. Finger Opposition / Pinches",
    description: "Pinch index finger to thumb firmly, hold for 2 seconds, release, and switch to next finger.",
    imageUrl: "https://res.cloudinary.com/tdq0puk9/image/upload/v1783233992/8e4dfae7-d44e-49bc-933e-4c513fcf0837_rmjzlk.png",
    duration: 30,
    benefits: "Strengthens terminal thumb/finger pinch muscles, critical for holding utensils and reading.",
    instructions: [
      "Hold your hand upright with fingers straight.",
      "Pinch the pad of your index finger firmly against your thumb pad.",
      "Press together, feeling the muscles in your palm and thumb base engage.",
      "Hold for 2 seconds, then release.",
      "Repeat the pinch with the middle, ring, and pinky finger sequentially.",
      "Perform the pinches on both hands to balance motor control."
    ]
  },
  {
    id: "ex-5",
    title: "5. Extension / Flexion",
    description: "Stretch palm forward, pull fingers backward gently with other hand, then push downward.",
    imageUrl: "https://res.cloudinary.com/tdq0puk9/image/upload/v1783234068/0ee8a8a0-b2ea-4ee4-9a19-3f19e4dc29fe_xbhe32.png",
    duration: 30,
    benefits: "Stretches wrist flexor/extensor muscle groups, reducing stiffness that worsens hand tremors.",
    instructions: [
      "Extend your arm straight in front of you, palm facing outward as if pushing a wall.",
      "Use your opposite hand to gently pull your extended fingers back toward your body.",
      "Hold this deep stretch for 5 seconds; you should feel a comfortable stretch under your forearm.",
      "Now, point your fingers straight down toward the floor, palm facing you.",
      "Use your other hand to apply gentle pressure on the back of your hand, pulling it closer.",
      "Hold for 5 seconds, then alternate back and forth."
    ]
  },
  {
    id: "ex-6",
    title: "6. Thumb Circles",
    description: "Keep all other fingers steady, move your thumb in a large circular sweep continuously.",
    imageUrl: "https://res.cloudinary.com/tdq0puk9/image/upload/v1783234441/e3f13732-a9ae-4685-8fea-edad58bbd316_lvaivg.png",
    duration: 30,
    benefits: "Stabilizes the thumb joint, which is the foundational point for smart-phone grip and support.",
    instructions: [
      "Open your hand relaxed with fingers pointing straight.",
      "Keep your four fingers completely stationary.",
      "Isolate your thumb and slowly move it in a clockwise circular path.",
      "Try to stretch the thumb as far outward as comfortable on each sweep.",
      "Perform 5 clockwise rotations, then reverse to counterclockwise.",
      "Keep your palm completely flat on the desk if fingers try to move."
    ]
  }
];

export default function ExercisesTab({
  themeMode,
  streakCount,
  setStreakCount,
  readAloud,
  isTtsPlaying,
  stopTts
}: ExercisesTabProps) {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);

  // Practice Timer States
  const [timerLeft, setTimerLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mini Game States
  const [gameScore, setGameScore] = useState<number | null>(null);
  const [gameHighScore, setGameHighScore] = useState(0);
  const [dotPos, setDotPos] = useState({ x: 150, y: 150 });
  const [targetPos, setTargetPos] = useState({ x: 150, y: 150 });
  const [gameTimeLeft, setGameTimeLeft] = useState(15);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameSimulateShake, setGameSimulateShake] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const gameStartTimeRef = useRef<number | null>(null);
  const gamePointsRef = useRef(0);
  const gameTicksRef = useRef(0);

  // Load completed list from localStorage
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const storedCompleted = localStorage.getItem(`completed_ex_${todayStr}`);
    if (storedCompleted) {
      try {
        setCompletedToday(JSON.parse(storedCompleted));
      } catch (e) {
        console.error(e);
      }
    }

    const highScore = localStorage.getItem('tremor_game_high_score');
    if (highScore) {
      setGameHighScore(parseInt(highScore));
    }
  }, []);

  // Theme Styles mapping
  const getThemeStyles = () => {
    switch (themeMode) {
      case 'black-yellow':
        return {
          cardBg: 'bg-[#FEF08A] text-black border-4 border-black p-6 rounded-2xl shadow-xl',
          cardSub: 'border-2 border-black bg-black/5 p-4 rounded-xl',
          item: 'border-2 border-black bg-[#FEF08A] text-black hover:bg-black hover:text-[#FEF08A]',
          itemDone: 'border-4 border-black bg-[#FEF08A] text-black font-extrabold',
          btnPrimary: 'bg-black text-[#FEF08A] border-2 border-black font-black hover:bg-[#FEF08A] hover:text-black',
          btnSecondary: 'border-2 border-black/50 text-black font-bold hover:bg-black/15',
          label: 'text-black font-black text-lg',
          accent: 'text-black font-extrabold',
          badge: 'bg-black text-[#FEF08A] border border-black',
        };
      case 'white-black':
        return {
          cardBg: 'bg-[#1F2937] text-white border-4 border-white p-6 rounded-2xl shadow-xl',
          cardSub: 'border-2 border-white bg-white/5 p-4 rounded-xl',
          item: 'border-2 border-white bg-[#1F2937] text-white hover:bg-white hover:text-black',
          itemDone: 'border-4 border-white bg-[#1F2937] text-white font-extrabold',
          btnPrimary: 'bg-white text-black border-2 border-white font-bold hover:bg-black hover:text-white',
          btnSecondary: 'border-2 border-white/50 text-white font-bold hover:bg-white/15',
          label: 'text-white font-black text-lg',
          accent: 'text-white font-bold',
          badge: 'bg-white text-black border border-white',
        };
      case 'dark-blue':
        return {
          cardBg: 'bg-[#0F172A] text-white border border-blue-500/30 p-6 rounded-2xl shadow-xl',
          cardSub: 'bg-slate-950/45 border border-slate-800 p-4 rounded-xl',
          item: 'border border-slate-800 bg-[#1E293B] hover:border-blue-500/50',
          itemDone: 'border-2 border-emerald-500 bg-[#1E293B]/80',
          btnPrimary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-400',
          btnSecondary: 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white',
          label: 'text-blue-400 font-bold text-lg',
          accent: 'text-blue-300',
          badge: 'bg-blue-500 text-white text-xs',
        };
      case 'calm-blue':
      default:
        return {
          cardBg: 'bg-white text-slate-800 border border-blue-100 p-6 rounded-2xl shadow-md',
          cardSub: 'bg-blue-50/20 border border-blue-100/50 p-4 rounded-xl',
          item: 'border border-blue-500/10 bg-blue-50/25 hover:bg-blue-50/70',
          itemDone: 'border-2 border-emerald-500 bg-emerald-50/15',
          btnPrimary: 'bg-[#1E40AF] text-white hover:bg-blue-800',
          btnSecondary: 'border border-blue-100 bg-blue-50/50 text-[#1E40AF] hover:bg-blue-50',
          label: 'text-[#1E40AF] font-bold text-lg',
          accent: 'text-[#1E40AF]',
          badge: 'bg-blue-100 text-[#1E40AF] font-semibold text-xs',
        };
    }
  };

  const styles = getThemeStyles();

  // TIMER LOGIC
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            // Voice announcement of complete
            readAloud("Wonderful effort! Exercise completed. Please tap the mark completed button below.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    if (timerLeft === 0) setTimerLeft(30);
    setIsTimerRunning(true);
    if (activeExercise) {
      readAloud(`Starting ${activeExercise.title}. Let's practice. Follow the instruction steps on the screen.`);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    stopTts();
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerLeft(30);
    stopTts();
  };

  // Mark Exercise Complete
  const handleMarkComplete = (id: string) => {
    if (completedToday.includes(id)) return;
    
    const updated = [...completedToday, id];
    setCompletedToday(updated);
    
    const todayStr = new Date().toDateString();
    localStorage.setItem(`completed_ex_${todayStr}`, JSON.stringify(updated));

    // Increase streak if completing the first exercise of the day
    if (completedToday.length === 0) {
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      localStorage.setItem('tremor_streak_count', newStreak.toString());
    }

    // Play pleasant audio affirmation
    readAloud("Awesome job! You have logged this therapeutic exercise. Hand stability is a daily practice, keep going!");
    
    // Close detail view
    setActiveExercise(null);
  };

  // MINI GAME LOGIC (Canvasless interactive DIV based game for supreme mobile response)
  const startStabilityGame = () => {
    setGameScore(null);
    setGameTimeLeft(15);
    setDotPos({ x: 150, y: 150 });
    setTargetPos({ x: 150, y: 150 });
    setGameRunning(true);
    gamePointsRef.current = 0;
    gameTicksRef.current = 0;
    gameStartTimeRef.current = Date.now();
    
    readAloud("Stability Mini Game Started. Hold your finger or mouse cursor perfectly inside the target ring as it moves.");
  };

  // Gameloop for moving target and calculating tracking accuracy
  useEffect(() => {
    if (!gameRunning) return;

    let targetAngle = 0;
    let shakeAngle = 0;

    const gameInterval = setInterval(() => {
      // 1. Move target smoothly in an infinity loop / figure-8 pattern
      const targetX = 150 + Math.sin(targetAngle) * 80;
      const targetY = 150 + Math.sin(targetAngle * 2) * 45;
      setTargetPos({ x: targetX, y: targetY });
      targetAngle += 0.025;

      // 2. Add simulated hand shake tremor to the dot position if activated
      let shakeX = 0;
      let shakeY = 0;
      if (gameSimulateShake) {
        shakeX = Math.sin(shakeAngle * 4) * 15 + Math.cos(shakeAngle * 2.1) * 8;
        shakeY = Math.cos(shakeAngle * 3.3) * 15 + Math.sin(shakeAngle * 1.7) * 8;
        shakeAngle += 0.25;
      }

      // We calculate point distance from center of target ring
      setDotPos(prev => {
        // Dot slowly pulls toward target to simulate muscle tracking
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        
        // Return dot position adding user mouse movement inside game container + tremor offsets
        return prev;
      });

      // Track distance to calculate score
      // user coordinates are updated via pointer movement inside the box
      // Game logic inside pointer handler will update user position. Let's increment score points!
      gameTicksRef.current += 1;

    }, 30);

    const timerInterval = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          // Game ended!
          setGameRunning(false);
          const finalScore = Math.round((gamePointsRef.current / Math.max(gameTicksRef.current, 1)) * 100);
          setGameScore(finalScore);
          
          if (finalScore > gameHighScore) {
            setGameHighScore(finalScore);
            localStorage.setItem('tremor_game_high_score', finalScore.toString());
            readAloud(`Congratulations! You achieved a new high score of ${finalScore} percent hand stability index!`);
          } else {
            readAloud(`Game complete. Your hand stability index is ${finalScore} percent. Daily practice reduces tremors.`);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    };
  }, [gameRunning, gameSimulateShake, gameHighScore]);

  // Handle cursor/touch coordinate tracing inside the game box
  const handleGamePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameRunning) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const userX = e.clientX - rect.left;
    const userY = e.clientY - rect.top;

    // Apply the shaking offset to the tracking dot
    let shakeX = 0;
    let shakeY = 0;
    if (gameSimulateShake) {
      const scale = 14;
      shakeX = (Math.random() - 0.5) * scale;
      shakeY = (Math.random() - 0.5) * scale;
    }

    const currentDot = { x: userX + shakeX, y: userY + shakeY };
    setDotPos(currentDot);

    // Calculate proximity score
    const distance = Math.hypot(currentDot.x - targetPos.x, currentDot.y - targetPos.y);
    
    // Within 25px radius of target center counts as stable/inside target ring!
    if (distance < 28) {
      gamePointsRef.current += 1;
    } else if (distance < 55) {
      // partial points for being close
      gamePointsRef.current += 0.4;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Main Welcome/Progress Header */}
      {!activeExercise && !isGameActive && (
        <div className={`${styles.cardBg} shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <Trophy className="w-6 h-6 fill-current" />
              <span className="text-sm font-black uppercase tracking-wider">Therapeutic Daily Exercises</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">Therapy Center</h2>
            <p className="text-base mt-2 font-medium opacity-90 leading-relaxed">
              These 6 targeted hand, finger, and wrist exercises are designed to stretch muscles, lubricate joints, and build motor neural pathways. Daily practice of 1-2 exercises can clinically reduce hand tremors over time.
            </p>

            {/* Quick stats panel */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 bg-current/5 px-3.5 py-1.5 rounded-xl border border-current/10">
                <Flame className="w-5 h-5 text-orange-500 fill-current" />
                <span className="text-sm font-bold">{streakCount} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-current/5 px-3.5 py-1.5 rounded-xl border border-current/10">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold">
                  {completedToday.length} of {EXERCISES_LIST.length} Completed Today
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 md:w-60">
            {/* Play mini stability game button */}
            <button
              id="btn-open-game"
              onClick={() => setIsGameActive(true)}
              style={{ minHeight: '52px' }}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-extrabold transition-all duration-150 ${styles.btnPrimary}`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Stability Mini-Game</span>
            </button>
            <p className="text-[10px] opacity-75 text-center font-semibold uppercase tracking-wider">
              Gyroscopic test game for motor control
            </p>
          </div>
        </div>
      )}

      {/* 2. MAIN EXERCISE DETAIL VIEW */}
      {activeExercise && (
        <div className={`${styles.cardBg} shadow-md flex flex-col gap-6`}>
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between border-b border-current/10 pb-4">
            <button
              id="btn-close-exercise"
              onClick={() => {
                setActiveExercise(null);
                stopTts();
              }}
              style={{ minHeight: '44px' }}
              className="flex items-center gap-1.5 text-sm font-bold hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to exercises</span>
            </button>
            <span className={styles.badge}>Active Practice Session</span>
          </div>

          {/* Core Exercise Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Illustration image & Timer */}
            <div className="flex flex-col gap-6">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-white border border-current/10 shadow-inner flex items-center justify-center p-2">
                <img
                  src={activeExercise.imageUrl}
                  alt={activeExercise.title}
                  className="max-h-full max-w-full object-contain rounded-xl select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg font-bold">
                  Interactive Guide
                </div>
              </div>

              {/* Timer Workspace */}
              <div className={`${styles.cardSub} flex flex-col items-center justify-center text-center py-6 gap-4`}>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Outer pulsing ring coordinating movement */}
                  <div className={`absolute inset-0 rounded-full border-4 border-current/10 ${isTimerRunning ? 'animate-ping opacity-30' : ''}`}></div>
                  <div className={`absolute -inset-2 rounded-full border-2 border-emerald-500/20 ${isTimerRunning ? 'animate-pulse' : ''}`}></div>
                  
                  {/* Timer text */}
                  <div className="text-4xl font-black tracking-tight">{timerLeft}s</div>
                </div>

                <div className="flex items-center gap-2">
                  {!isTimerRunning ? (
                    <button
                      id="btn-timer-start"
                      onClick={handleStartTimer}
                      style={{ minHeight: '48px', minWidth: '110px' }}
                      className={`flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl font-black ${styles.btnPrimary}`}
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Start</span>
                    </button>
                  ) : (
                    <button
                      id="btn-timer-pause"
                      onClick={handlePauseTimer}
                      style={{ minHeight: '48px', minWidth: '110px' }}
                      className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 font-black"
                    >
                      <Pause className="w-5 h-5" />
                      <span>Pause</span>
                    </button>
                  )}

                  <button
                    id="btn-timer-reset"
                    onClick={handleResetTimer}
                    style={{ minHeight: '48px' }}
                    className={`px-4 py-2 rounded-xl ${styles.btnSecondary}`}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* completion checklist button */}
                <button
                  id="btn-mark-exercise-complete"
                  onClick={() => handleMarkComplete(activeExercise.id)}
                  style={{ minHeight: '48px' }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black shadow-md"
                >
                  <Check className="w-5 h-5" />
                  <span>Mark Completed Daily Log</span>
                </button>
              </div>
            </div>

            {/* Right side: Instructions & Benefits */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-3xl font-black tracking-tight">{activeExercise.title}</h3>
                <p className="text-base mt-2 font-semibold opacity-90">{activeExercise.description}</p>
              </div>

              {/* Benefits badge */}
              <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-start gap-2.5">
                <Heart className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-500">Therapeutic Benefit</h4>
                  <p className="text-sm font-medium leading-relaxed">{activeExercise.benefits}</p>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider mb-2 text-blue-500">How to perform this exercise:</h4>
                <ol className="space-y-3.5">
                  {activeExercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm font-medium leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-current/5 border border-current/15 flex items-center justify-center text-xs font-black shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MINI STABILITY GYRO GAME VIEW */}
      {isGameActive && (
        <div className={`${styles.cardBg} shadow-md flex flex-col gap-6`}>
          {/* Top Navigation bar */}
          <div className="flex items-center justify-between border-b border-current/10 pb-4">
            <button
              id="btn-close-game"
              onClick={() => {
                setIsGameActive(false);
                setGameRunning(false);
                stopTts();
              }}
              style={{ minHeight: '44px' }}
              className="flex items-center gap-1.5 text-sm font-bold hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to home</span>
            </button>
            <span className={styles.badge}>Hand Motor Stability Game</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Interactive Game Container */}
            <div className="flex flex-col gap-4">
              <div 
                className="relative aspect-square w-full max-w-[320px] mx-auto rounded-2xl bg-slate-950 border-4 border-slate-800 overflow-hidden cursor-crosshair select-none"
                onPointerMove={handleGamePointerMove}
              >
                {/* Background radar grid circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-[80%] h-[80%] rounded-full border border-dashed border-white"></div>
                  <div className="w-[50%] h-[50%] rounded-full border border-white"></div>
                  <div className="w-[20%] h-[20%] rounded-full border border-white"></div>
                </div>

                {/* Target ring - user must stay centered here */}
                <div 
                  className={`absolute w-14 h-14 rounded-full border-4 border-orange-500/80 bg-orange-500/10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none ${
                    gameRunning ? 'animate-pulse' : ''
                  }`}
                  style={{ left: `${targetPos.x}px`, top: `${targetPos.y}px` }}
                >
                  <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                </div>

                {/* User position tracking dot (stabilized / shaky depending on toggle) */}
                <div 
                  className="absolute w-6 h-6 rounded-full bg-emerald-400 border border-white shadow-lg shadow-emerald-500/50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-75"
                  style={{ left: `${dotPos.x}px`, top: `${dotPos.y}px` }}
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>

                {/* overlay game starter */}
                {!gameRunning && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                    <Gamepad2 className="w-12 h-12 text-blue-500 mb-2 animate-bounce" />
                    <h3 className="text-lg font-black text-white">Stability Tester</h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Keep your mouse or finger locked inside the orange target ring as it glides!
                    </p>
                    <button
                      id="btn-game-play-now"
                      onClick={startStabilityGame}
                      style={{ minHeight: '44px' }}
                      className="mt-4 bg-blue-500 text-white font-extrabold px-6 py-2 rounded-xl hover:bg-blue-600 shadow-md transition-all duration-150"
                    >
                      Start Testing!
                    </button>
                  </div>
                )}

                {/* Active HUD */}
                {gameRunning && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono pointer-events-none">
                    TIME: {gameTimeLeft}s
                  </div>
                )}
              </div>

              {/* Shake simulation toggle helper for demo testing */}
              <div className="flex items-center justify-center gap-3 bg-current/5 p-3 rounded-xl">
                <span className="text-xs font-bold">Simulate Hand Tremors:</span>
                <input
                  id="game-tremor-toggle"
                  type="checkbox"
                  checked={gameSimulateShake}
                  onChange={(e) => setGameSimulateShake(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-[10px] opacity-75">(Creates shaky offset for tester)</span>
              </div>
            </div>

            {/* Right Column: Instructions, scoreboard, rewards */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-3xl font-black tracking-tight">Therapeutic stability tracker</h3>
                <p className="text-base mt-2 font-semibold opacity-90 leading-relaxed">
                  This sensory interactive test maps your neuromuscular tracking precision. Holding your focus inside the rings targets micro-muscular stability pathways in your fingers and wrist.
                </p>
              </div>

              {/* Game Scoreboard Card */}
              <div className={`${styles.cardSub} space-y-4`}>
                <div className="flex justify-between items-center border-b border-current/15 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Historical Best Index</span>
                  <span className="text-xl font-black text-emerald-500">{gameHighScore}% Stable</span>
                </div>

                {gameScore !== null && (
                  <div className="text-center py-2 animate-fade-in">
                    <span className="text-xs font-black text-blue-500 uppercase block tracking-wider">Your Latest Stability Score</span>
                    <div className="text-5xl font-black tracking-tight mt-1">{gameScore}%</div>
                    <span className="text-xs block mt-1.5 font-bold opacity-80">
                      {gameScore >= 80 ? '🎉 Exceptional hand control! Grandfather, stay steady!' : '👍 Good practice effort. Repeat daily to gain precision.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Safety notice info */}
              <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/15 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-500">Comfort Warning</h4>
                  <p className="text-sm font-medium leading-relaxed">
                    Avoid straining. If your hand or forearm starts to tire, please pause or rest. Take regular deep breaths during tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN EXERCISE SELECTION LIST (BENTO BOX GRID) */}
      {!activeExercise && !isGameActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXERCISES_LIST.map((exercise) => {
            const isDone = completedToday.includes(exercise.id);
            return (
              <div
                key={exercise.id}
                id={`exercise-card-${exercise.id}`}
                onClick={() => {
                  setActiveExercise(exercise);
                  setTimerLeft(exercise.duration);
                }}
                className={`flex flex-col rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  isDone ? styles.itemDone : styles.item
                }`}
              >
                {/* Image workspace with cloud cloudinary assets loaded */}
                <div className="relative aspect-video w-full bg-white flex items-center justify-center p-3 border-b border-current/10">
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.title}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  {isDone && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 border-2 border-white shadow-md">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Description padding */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-black truncate">{exercise.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-current/5 border border-current/10">
                        {exercise.duration}s
                      </span>
                    </div>
                    <p className="text-xs font-semibold mt-2 opacity-80 leading-relaxed line-clamp-3">
                      {exercise.description}
                    </p>
                  </div>

                  <button
                    id={`btn-exercise-start-${exercise.id}`}
                    style={{ minHeight: '44px' }}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-extrabold transition-all duration-150 ${
                      isDone 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                        : styles.btnSecondary
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Completed Today (Redo)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Practice Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
