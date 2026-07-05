import { useState, useEffect, useRef } from 'react';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [spokenWordIndex, setSpokenWordIndex] = useState<number | null>(null);
  const [spokenCharIndex, setSpokenCharIndex] = useState<number | null>(null);
  const [wordsList, setWordsList] = useState<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setSpokenWordIndex(null);
    setSpokenCharIndex(null);
  };

  const pause = () => {
    if (!window.speechSynthesis || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!window.speechSynthesis || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const play = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Text to speech is not supported in this browser.");
      return;
    }

    stop();

    if (!text || text.trim() === '') return;

    // Break down text into list of words to allow visual highlighting
    const words = text.split(/(\s+)/); // keep whitespace too for reconstruction
    setWordsList(words);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Try to find a friendly, clear English voice (e.g., Google US English or similar)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.includes('en-US') && (v.name.includes('Natural') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9; // Slightly slower for elderly reading comprehension

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setSpokenWordIndex(null);
      setSpokenCharIndex(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Calculate which word is currently being spoken
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        setSpokenCharIndex(charIndex);

        // Find the index of the word matching the charIndex
        let currentLen = 0;
        let wordIdx = 0;
        for (let i = 0; i < words.length; i++) {
          if (currentLen >= charIndex) {
            wordIdx = i;
            break;
          }
          currentLen += words[i].length;
        }
        setSpokenWordIndex(wordIdx);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  return {
    isPlaying,
    isPaused,
    spokenWordIndex,
    spokenCharIndex,
    wordsList,
    play,
    pause,
    resume,
    stop,
  };
}
