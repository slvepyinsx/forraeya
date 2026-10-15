"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Anchor,
  Sun,
  HandHeart,
  Wind,
  Check,
  Sparkles,
  RotateCcw,
  X,
} from "lucide-react";

const TOTAL_STEPS = 7;

const LETTER_TEXT = `Dearest Raeya,

Happy birthday, my love. ❤️ I'm really grateful to have you in my life, and I hope you know how special you are to me. Through all the happy moments, the misunderstandings, and the times we've struggled to understand each other, I'm thankful that we're still here, learning and growing together.

Thank you for being you, for all the little things you do, and for still choosing to fight for us even when things aren't easy. I know we still have a lot to learn about each other, but I hope we can keep becoming better, not just for our relationship, but for ourselves too.

I hope this new chapter brings you more happiness, peace, and reasons to smile. You deserve so many beautiful things, sayang.

I'm happy I get to be part of your story. I love you, always. ❤️`;

const CARDS_DATA = [
  {
    id: 1,
    title: "Your Sweet Little Heart",
    icon: <Heart className="w-5 h-5 text-warm-gold fill-warm-gold mb-2" />,
    backText:
      "I love how sweet you can be, even in the smallest things. You probably don't realize it, but those little things mean a lot to me.",
    backBg: "bg-warm-champagne",
  },
  {
    id: 2,
    title: "The Way You Make Me Feel",
    icon: <Anchor className="w-5 h-5 text-warm-sage mb-2" />,
    backText:
      "There's something about being with you that makes things feel a little better. Even on days when my mind is all over the place, I'm glad I have you.",
    backBg: "bg-warm-softSage/60",
  },
  {
    id: 3,
    title: "Your Beautiful Smile",
    icon: <Sun className="w-5 h-5 text-warm-gold mb-2" />,
    backText:
      "I don't think you realize how much I love seeing you smile. It makes me happy knowing you're happy, and honestly, I could never get tired of seeing it.",
    backBg: "bg-warm-softSage/60",
  },
  {
    id: 4,
    title: "The Way You Care",
    icon: <HandHeart className="w-5 h-5 text-warm-sage mb-2" />,
    backText:
      "I appreciate how you try to understand me, listen to me, and stay by my side even when things aren't easy. I know we're both still learning, and it means a lot to me that we're trying together.",
    backBg: "bg-warm-champagne",
  },
];

export default function BirthdayPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [typedLetter, setTypedLetter] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const typewriterStartedRef = useRef(false);
  const letterBoxRef = useRef<HTMLDivElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Confetti helper
  const triggerGoldConfetti = () => {
    if (typeof window === "undefined") return;
    const count = 70;
    const defaults = { origin: { y: 0.65 } };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.25),
      spread: 35,
      startVelocity: 38,
      colors: ["#D1B894", "#6B7A6E", "#F7F4EF"],
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.35),
      spread: 75,
      colors: ["#E3E8E4", "#D1B894", "#FFFFFF"],
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.2),
      spread: 110,
      decay: 0.92,
      scalar: 0.75,
      colors: ["#6B7A6E", "#2B2F2E"],
    });
  };

  // Step changes effects
  useEffect(() => {
    // Step 6: Start typewriter if not started
    if (currentStep === 6 && !typewriterStartedRef.current) {
      typewriterStartedRef.current = true;
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        setTypedLetter(LETTER_TEXT.slice(0, idx));
        if (idx >= LETTER_TEXT.length) {
          clearInterval(interval);
        }
      }, 32);
      return () => clearInterval(interval);
    }

    // Step 7: Trigger celebratory confetti
    if (currentStep === 7) {
      triggerGoldConfetti();
    }
  }, [currentStep]);

  // Keep letter scrolled into view as it types
  useEffect(() => {
    if (letterBoxRef.current) {
      letterBoxRef.current.scrollTop = letterBoxRef.current.scrollHeight;
    }
  }, [typedLetter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowRight") {
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      } else if (e.key === "ArrowLeft") {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startJourney = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
    nextStep();
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= TOTAL_STEPS) {
      setCurrentStep(stepNumber);
    }
  };

  const restartJourney = () => {
    setCurrentStep(1);
    setIsCandleBlown(false);
    setFlippedCards([]);
    setTypedLetter("");
    typewriterStartedRef.current = false;
  };

  const toggleCardFlip = (cardId: number) => {
    setFlippedCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const blowCandle = () => {
    if (isCandleBlown) return;
    setIsCandleBlown(true);
    triggerGoldConfetti();
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio playback blocked by browser:", err);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-warm-softSage selection:text-warm-text bg-warm-bg text-warm-text">
      {/* Background Music Audio */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/audio/music.mp3"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Header & Step Indicator */}
      <header className="w-full max-w-2xl mx-auto pt-7 px-6 flex flex-col items-center gap-4 relative z-20">
        <div className="flex items-center justify-between w-full">
          <span className="font-serif-title italic text-lg tracking-wider text-warm-text/90">
            For Diadra Amrita R.
          </span>

          {/* Music Audio Toggle Button */}
          <button
            onClick={toggleAudio}
            type="button"
            className="text-xs tracking-widest uppercase flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-warm-border bg-white/80 hover:bg-white transition-all text-warm-muted hover:text-warm-text shadow-sm cursor-pointer"
            title="Toggle Music"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-warm-sage" />
                <span className="text-warm-text font-medium">Music On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-warm-muted" />
                <span>Music Off</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Steps Bar */}
        <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-warm-border/60">
          <div className="flex gap-2 w-full justify-between items-center">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => goToStep(stepNum)}
                type="button"
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  stepNum === currentStep
                    ? "w-7 bg-warm-sage"
                    : stepNum < currentStep
                    ? "w-2.5 bg-warm-text/40 hover:bg-warm-text/60"
                    : "w-2.5 bg-warm-border hover:bg-warm-muted/40"
                }`}
                title={`Go to step ${stepNum}`}
                aria-label={`Go to step ${stepNum}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Container for Step Panels */}
      <main className="w-full max-w-xl mx-auto px-6 py-6 my-auto relative min-h-[500px] flex items-center justify-center">
        {/* ================= STEP 1: WELCOME COVER ================= */}
        <div
          className={`step-panel text-center space-y-7 w-full ${
            currentStep === 1 ? "step-active" : "step-hidden"
          }`}
        >
          {/* Candlelight Ambient Glow */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative flex flex-col items-center">
              <div className="candle-flame mb-1.5" />
              <div className="w-2.5 h-7 bg-gradient-to-b from-white to-warm-champagne rounded-t-sm border border-warm-border/60 shadow-inner relative">
                <div className="w-0.5 h-1.5 bg-warm-text/50 absolute -top-1.5 left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-warm-sage font-medium">
              A Little World For You
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif-title font-normal tracking-tight text-warm-text leading-tight">
              Happy Birthday,
              <br />
              <span className="italic font-light">My Dearest Raeya ❤️</span>
            </h1>
            <p className="text-xs sm:text-sm text-warm-muted max-w-md mx-auto font-light leading-relaxed pt-1">
              a little corner of the internet, made with love, just for you.
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={startJourney}
              type="button"
              className="inline-flex items-center gap-3 bg-warm-sage text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-warm-sageHover transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Journey</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ================= STEP 2: CHAPTER I - HOW FAR WE'VE COME ================= */}
        <div
          className={`step-panel w-full space-y-6 ${
            currentStep === 2 ? "step-active" : "step-hidden"
          }`}
        >
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-warm-sage font-medium">
              Chapter I
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title text-warm-text">
              How Far We&apos;ve Come
            </h2>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 border border-warm-border">
            <p className="font-serif-title text-xl text-warm-text italic leading-snug">
              &ldquo;happy birthday, raeya. ur still the sweetest soul i&apos;ve ever known. ❤️&rdquo;
            </p>

            <div className="space-y-3.5 text-xs sm:text-sm text-warm-muted font-light leading-relaxed max-h-[46vh] sm:max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              <p>
                looking back at everything we&apos;ve been through, it&apos;s kinda beautiful how far we&apos;ve come. from our late night talks, random laughs, little misunderstandings, and all those small moments that mean so much to me.
              </p>
              <p>
                i know we&apos;re not perfect, and sometimes we overthink or struggle to understand each other. but i&apos;m glad we&apos;re still learning and growing together. i hope we can keep choosing each other, understanding each other better, and building a love where we both feel safe, loved, and understood.
              </p>
              <p>
                thankyou for being part of my life, sayang. i hope u never forget how precious u are and how much happiness u deserve. i hope this new chapter brings u closer to everything u&apos;ve been dreaming of.
              </p>
              <p>
                i&apos;m grateful for every moment with u, and i look forward to all the little memories we&apos;re yet to make together.
              </p>
            </div>

            <div className="pt-3 border-t border-warm-border/60">
              <p className="font-serif-title italic text-sm sm:text-base text-warm-text leading-snug">
                happy birthday, my love. i love you, always. ❤️
              </p>
            </div>
          </div>
        </div>

        {/* ================= STEP 3: CHAPTER II - THINGS I CHERISH ABOUT YOU ================= */}
        <div
          className={`step-panel w-full space-y-6 ${
            currentStep === 3 ? "step-active" : "step-hidden"
          }`}
        >
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-warm-sage font-medium">
              Chapter II
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title text-warm-text">
              Little Things I Love About You
            </h2>
            <p className="text-xs text-warm-muted font-light">
              Tap each card to see what makes you special to me.
            </p>
          </div>

          {/* Flip Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
            {CARDS_DATA.map((card) => {
              const isFlipped = flippedCards.includes(card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => toggleCardFlip(card.id)}
                  className={`flip-card perspective-1000 h-36 sm:h-38 cursor-pointer ${
                    isFlipped ? "flipped" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleCardFlip(card.id);
                    }
                  }}
                >
                  <div className="flip-card-inner relative w-full h-full rounded-xl shadow-sm border border-warm-border/80 bg-white">
                    <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center p-3 text-center rounded-xl bg-white">
                      {card.icon}
                      <span className="text-xs font-medium text-warm-text">
                        {card.title}
                      </span>
                      <span className="text-[10px] text-warm-muted mt-1">
                        (Tap to flip)
                      </span>
                    </div>
                    <div
                      className={`flip-card-back absolute inset-0 flex items-center justify-center p-3 text-center rounded-xl ${card.backBg} text-warm-text overflow-y-auto custom-scrollbar`}
                    >
                      <p className="text-[10px] sm:text-[11px] leading-relaxed font-light">
                        {card.backText}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= STEP 4: CHAPTER III - PRECIOUS MOMENTS ================= */}
        <div
          className={`step-panel w-full space-y-6 ${
            currentStep === 4 ? "step-active" : "step-hidden"
          }`}
        >
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-warm-sage font-medium">
              Chapter III
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title text-warm-text">
              Little Moments With You
            </h2>
            <p className="text-xs text-warm-muted font-light">
              A little collection of memories we&apos;ve made together (tap to zoom)
            </p>
          </div>

          {/* Polaroid Grid with Washi Tape Accents */}
          <div className="grid grid-cols-2 gap-4 pt-3">
            {/* POLAROID 1 */}
            <div
              onClick={() => setSelectedImage("/photos/memory-together.jpg")}
              className="polaroid-frame bg-white p-3 rounded-lg border border-warm-border/90 shadow-sm space-y-2.5 -rotate-2 relative transition-all duration-300 hover:rotate-0 hover:scale-[1.03] hover:shadow-md cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedImage("/photos/memory-together.jpg");
                }
              }}
              title="Click to view full photo"
            >
              <div className="washi-tape h-3.5 w-14 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-1 z-10 rounded-sm" />
              <div className="aspect-square rounded overflow-hidden bg-warm-softSage/30 relative">
                <Image
                  src="/photos/memory-together.jpg"
                  alt="You and Raeya"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="text-center px-1">
                <span className="font-serif-title italic text-xs text-warm-text block">
                  You & Me
                </span>
                <span className="text-[10px] text-warm-muted font-light block mt-0.5">
                  Little moments, happy memories
                </span>
              </div>
            </div>

            {/* POLAROID 2 */}
            <div
              onClick={() => setSelectedImage("/photos/memory-raeya.jpg")}
              className="polaroid-frame bg-white p-3 rounded-lg border border-warm-border/90 shadow-sm space-y-2.5 rotate-2 relative transition-all duration-300 hover:rotate-0 hover:scale-[1.03] hover:shadow-md cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedImage("/photos/memory-raeya.jpg");
                }
              }}
              title="Click to view full photo"
            >
              <div className="washi-tape h-3.5 w-14 absolute -top-1.5 left-1/2 -translate-x-1/2 -rotate-2 z-10 rounded-sm" />
              <div className="aspect-square rounded overflow-hidden bg-warm-softSage/30 relative">
                <Image
                  src="/photos/memory-raeya.jpg"
                  alt="My Pretty Girl"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="text-center px-1">
                <span className="font-serif-title italic text-xs text-warm-text block">
                  My Pretty Girl
                </span>
                <span className="text-[10px] text-warm-muted font-light block mt-0.5">
                  Always beautiful to me
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-warm-muted font-serif-title italic pt-2">
            &ldquo;Little moments with you become memories I&apos;ll always keep.&rdquo;
          </p>
        </div>

        {/* ================= STEP 5: CHAPTER IV - MAKE A WISH ================= */}
        <div
          className={`step-panel text-center space-y-8 w-full ${
            currentStep === 5 ? "step-active" : "step-hidden"
          }`}
        >
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-warm-sage font-medium">
              Chapter IV
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title text-warm-text">
              Make a Wish, Raeya! ✨
            </h2>
            <p className="text-xs sm:text-sm text-warm-muted font-light max-w-sm mx-auto">
              close ur eyes, make a little wish, and blow out the candle, sayang. 🤍
            </p>
          </div>

          {/* Minimalist Candle Interaction */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={blowCandle}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") blowCandle();
              }}
              title="Click to blow candle"
            >
              {/* Flame */}
              <div
                className={`candle-flame mb-1 ${
                  isCandleBlown ? "flame-extinguished" : ""
                }`}
              />

              {/* Candle Wick & Body */}
              <div className="w-3.5 h-16 bg-gradient-to-b from-[#FAF8F5] to-warm-champagne rounded-t-sm border border-warm-border/80 shadow-inner relative">
                <div className="w-0.5 h-2.5 bg-warm-text/60 absolute -top-2.5 left-1/2 -translate-x-1/2" />
              </div>

              {/* Cake Tier Top */}
              <div className="w-28 h-8 bg-gradient-to-b from-white to-[#F5F0E8] rounded-t-lg border border-warm-border border-b-0 shadow-sm flex items-end justify-center pb-1">
                <div className="w-24 h-1 bg-warm-gold/40 rounded-full" />
              </div>

              {/* Cake Tier Base */}
              <div className="w-40 h-12 bg-gradient-to-b from-white to-warm-champagne rounded-b-lg border border-warm-border shadow-md flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-1 h-0.5 bg-warm-sage/30" />
                <span className="font-serif-title italic text-xs text-warm-muted">
                  Diadra Amrita R.
                </span>
              </div>

              {/* Stand */}
              <div className="w-48 h-2 bg-warm-border/80 rounded-full mt-1 shadow-sm" />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={blowCandle}
              type="button"
              className={`inline-flex items-center gap-2 border border-warm-border text-warm-text px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all shadow-sm cursor-pointer ${
                isCandleBlown
                  ? "bg-warm-softSage/40"
                  : "bg-white hover:bg-warm-softSage/30"
              }`}
            >
              {isCandleBlown ? (
                <>
                  <Check className="w-3.5 h-3.5 text-warm-sage" />
                  <span>Wish Made ✨</span>
                </>
              ) : (
                <>
                  <Wind className="w-3.5 h-3.5 text-warm-sage" />
                  <span>Blow Out Candle</span>
                </>
              )}
            </button>

            {/* Hidden Wish Message */}
            <div
              className={`transition-all duration-700 pt-1 ${
                isCandleBlown
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-2 pointer-events-none"
              }`}
            >
              <div className="glass-panel p-4 rounded-xl border border-warm-border max-w-sm mx-auto space-y-1.5">
                <p className="font-serif-title text-base sm:text-lg text-warm-text italic leading-snug">
                  &ldquo;i hope all the little things ur heart wishes for find their way to u, sayang.&rdquo;
                </p>
                <p className="text-xs text-warm-sage font-medium font-serif-title italic">
                  happy birthday, my love. ❤️
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= STEP 6: CHAPTER V - A LETTER FOR YOU ================= */}
        <div
          className={`step-panel w-full space-y-5 ${
            currentStep === 6 ? "step-active" : "step-hidden"
          }`}
        >
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-warm-sage font-medium">
              Chapter V
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title text-warm-text">
              A Letter For You
            </h2>
          </div>

          {/* Letter Container */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-warm-border space-y-4">
            <div className="flex items-center justify-between border-b border-warm-border/60 pb-3">
              <span className="font-serif-title italic text-lg text-warm-text">
                To: Diadra Amrita R. (Raeya)
              </span>
              <Heart className="w-4 h-4 text-warm-sage" />
            </div>

            {/* Typewriter Target */}
            <div
              ref={letterBoxRef}
              className="text-xs sm:text-sm text-warm-text/90 leading-relaxed font-light min-h-[160px] max-h-72 sm:max-h-80 overflow-y-auto pr-1 custom-scrollbar whitespace-pre-line"
            >
              <p className="typewriter-cursor">{typedLetter}</p>
            </div>

            <div className="border-t border-warm-border/60 pt-3 flex justify-between items-center text-xs text-warm-muted">
              <span className="font-serif-title italic text-sm">
                With all my love & gratitude,
              </span>
              <span className="font-medium uppercase tracking-wider text-[11px] text-warm-text">
                Forever Yours
              </span>
            </div>
          </div>
        </div>

        {/* ================= STEP 7: CHAPTER VI - FINAL WISHES & CELEBRATION ================= */}
        <div
          className={`step-panel text-center space-y-8 w-full ${
            currentStep === 7 ? "step-active" : "step-hidden"
          }`}
        >
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-warm-sage font-medium">
              Chapter VI
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-title text-warm-text">
              Happy Birthday, My Love! ❤️
            </h2>
            <p className="text-xs sm:text-sm text-warm-muted font-light max-w-md mx-auto leading-relaxed">
              Happy birthday, Raeya. I hope this new chapter of your life brings you more happiness, peace, and little moments that make you smile. You deserve so many beautiful things, and I hope you never forget how special you are to me.
            </p>
          </div>

          {/* Final Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-warm-border text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-warm-softSage/70 flex items-center justify-center text-warm-sage mx-auto">
              <Sparkles className="w-5 h-5 text-warm-sage" />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-serif-title italic text-warm-text leading-snug">
                &ldquo;No matter how much we grow, I hope we never stop choosing to understand and love each other better.&rdquo;
              </h4>
              <p className="text-xs text-warm-text/80 font-light leading-relaxed">
                Thank you for being part of my story, sayang. I&apos;m glad I get to be part of yours, too. Here&apos;s to more memories, more laughter, and more chapters together.
              </p>
              <p className="text-xs font-medium text-warm-sage font-serif-title italic pt-1">
                I love you, always. ❤️
              </p>
            </div>
            <button
              onClick={triggerGoldConfetti}
              type="button"
              className="w-full bg-warm-sage text-white py-2.5 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-warm-sageHover transition-all shadow-sm cursor-pointer"
            >
              Celebrate Again ✨
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={restartJourney}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-warm-muted hover:text-warm-text transition-all underline underline-offset-4 cursor-pointer"
            >
              <span>Replay Journey</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="w-full max-w-xl mx-auto pb-7 px-6 relative z-20">
        <div className="flex items-center justify-between border-t border-warm-border/80 pt-5">
          {/* Back Button */}
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            type="button"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-warm-muted hover:text-warm-text transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Step Count Indicator Text */}
          <span className="text-xs text-warm-muted font-light tracking-widest uppercase">
            Step {currentStep} of {TOTAL_STEPS}
          </span>

          {/* Next Button */}
          <button
            onClick={nextStep}
            disabled={currentStep === TOTAL_STEPS}
            type="button"
            className="inline-flex items-center gap-2 bg-warm-sage text-white px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-warm-sageHover transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* Lightbox / Full-size photo viewer */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-sm sm:max-w-md w-full bg-white p-3 rounded-2xl shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs uppercase tracking-widest text-warm-sage font-medium font-serif-title italic">
                {selectedImage.includes("together") ? "You & Me" : "My Pretty Girl"}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="w-7 h-7 rounded-full bg-warm-softSage/60 hover:bg-warm-softSage text-warm-text flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden bg-warm-softSage/20">
              <Image
                src={selectedImage}
                alt="Memory preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 500px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
