import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface BrandIntroProps {
  onComplete: () => void;
}

const INTRO_STORAGE_KEY = 'nowas_place_intro_seen_v1';

export function shouldShowBrandIntro(): boolean {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') {
    return false;
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1';
  } catch {
    return false;
  }
}

export function markBrandIntroSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
  } catch {
    // Ignore storage restriction
  }
}

const BRAND_WORDS = ["NOWA'S", 'PLACE'] as const;

export function BrandIntro({ onComplete }: BrandIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      markBrandIntroSeen();
      onComplete();
      return;
    }

    // 2.5–3.3s: smooth editorial wipe into the storefront
    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, 2650);

    const finishTimer = window.setTimeout(() => {
      markBrandIntroSeen();
      onComplete();
    }, 3250);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  const handleSkip = () => {
    markBrandIntroSeen();
    setExiting(true);
    window.setTimeout(() => onComplete(), 220);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="brand-intro"
          initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF9F6] px-6"
          aria-label="Welcome to Nowa's Place"
        >
          {/* Subtle architectural warm-ivory ambient frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-5 border border-[#171717]/10 sm:inset-8"
            aria-hidden="true"
          />

          <div className="relative flex max-w-2xl flex-col items-center text-center">
            {/* 0.0–0.5s: Delicate animated line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex origin-center items-center gap-2"
              aria-hidden="true"
            >
              <span className="h-px w-10 bg-[#171717]/25 sm:w-16" />
              <span className="h-1 w-6 bg-[#D8F36A]" />
              <span className="h-px w-10 bg-[#171717]/25 sm:w-16" />
            </motion.div>

            {/* 0.5–1.2s: "WELCOME TO" upward masked reveal */}
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-xs font-semibold tracking-[0.42em] text-[#171717]/75 uppercase sm:text-sm"
              >
                WELCOME TO
              </motion.p>
            </div>

            {/* 1.2–2.0s: "NOWA'S PLACE" staggered editorial reveal */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 overflow-hidden sm:gap-x-6">
              {BRAND_WORDS.map((word, wordIdx) => (
                <div key={word} className="flex overflow-hidden">
                  {word.split('').map((char, charIdx) => (
                    <motion.span
                      key={`${word}-${charIdx}`}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 0.55,
                        delay: 1.18 + wordIdx * 0.22 + charIdx * 0.045,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="font-display text-4xl font-bold tracking-[0.12em] text-[#171717] sm:text-6xl md:text-7xl"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>

            {/* 2.0–2.5s: Secondary tagline */}
            <div className="mt-5 overflow-hidden">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.55, delay: 1.98, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-medium tracking-[0.26em] text-neutral-600 uppercase sm:text-sm"
              >
                WHERE YOUR STYLE FINDS ITS PLACE.
              </motion.p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-8 right-6 min-h-10 border border-[#171717]/15 bg-white/80 px-4 py-2 text-xs font-medium tracking-widest text-[#171717]/75 uppercase transition-colors hover:border-[#171717] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
