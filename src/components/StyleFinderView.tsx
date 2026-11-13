import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BudgetTierId,
  COLOUR_GROUPS,
  CartItem,
  CuratedOutfit,
  Product,
  STYLE_OCCASIONS,
  STYLE_PREFERENCES,
  StyleFinderInput,
} from '../types/store';
import { PRODUCTS } from '../data/catalogue';
import { formatNaira } from '../utils/currency';
import {
  generateStyledOutfit,
  getSwapCandidatesForSlot,
  swapOutfitPiece,
} from '../utils/styleFinder';

interface StyleFinderViewProps {
  onQuickView: (product: Product) => void;
  onAddLookToCart: (items: { product: Product; size: string; colour: string }[]) => void;
  onSendLookToWhatsApp: (items: { product: Product; size: string; colour: string }[]) => void;
  onBrowseShop: () => void;
}

const BUDGET_TIERS: { id: BudgetTierId; label: string; hint: string }[] = [
  { id: 'under-30k', label: 'Under ₦30,000', hint: 'Smart essential pairing' },
  { id: '30k-50k', label: '₦30,000 – ₦50,000', hint: 'Complete top + bottom rotation' },
  { id: '50k-100k', label: '₦50,000 – ₦100,000', hint: 'Full outfit with footwear' },
  { id: 'above-100k', label: 'Above ₦100,000', hint: 'Unconstrained statement look' },
  { id: 'custom', label: 'Custom Amount', hint: 'Enter your target budget in ₦' },
];

const TOP_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const TROUSER_SIZES = ['30', '32', '34', '36', '38'];
const FOOTWEAR_SIZES = ['40', '41', '42', '43', '44', '45'];

export function StyleFinderView({
  onQuickView,
  onAddLookToCart,
  onSendLookToWhatsApp,
  onBrowseShop,
}: StyleFinderViewProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 'results'>(1);
  const [input, setInput] = useState<StyleFinderInput>({
    budgetTier: '30k-50k',
    colourPreference: 'No Preference',
  });
  const [customBudgetText, setCustomBudgetText] = useState('');
  const [variationIndex, setVariationIndex] = useState(0);
  const [overrideOutfit, setOverrideOutfit] = useState<CuratedOutfit | null>(null);
  const [swapPieceIndex, setSwapPieceIndex] = useState<number | null>(null);
  const [addedCompleteFeedback, setAddedCompleteFeedback] = useState(false);

  const generatedOutfit = useMemo(
    () => generateStyledOutfit(PRODUCTS, input, variationIndex),
    [input, variationIndex]
  );

  const activeOutfit = overrideOutfit ?? generatedOutfit;

  const swapCandidates = useMemo(() => {
    if (swapPieceIndex === null) return [];
    return getSwapCandidatesForSlot(PRODUCTS, activeOutfit, swapPieceIndex);
  }, [activeOutfit, swapPieceIndex]);

  const goToResults = (nextInput: StyleFinderInput = input) => {
    setInput(nextInput);
    setOverrideOutfit(null);
    setSwapPieceIndex(null);
    setAddedCompleteFeedback(false);
    setStep('results');
  };

  const handlePieceVariantChange = (
    pieceIdx: number,
    field: 'selectedSize' | 'selectedColour',
    value: string
  ) => {
    const nextPieces = activeOutfit.pieces.map((p, idx) =>
      idx === pieceIdx ? { ...p, [field]: value } : p
    );
    setOverrideOutfit({ ...activeOutfit, pieces: nextPieces });
    setAddedCompleteFeedback(false);
  };

  const handleSwapConfirm = (replacement: Product) => {
    if (swapPieceIndex === null) return;
    const updated = swapOutfitPiece(activeOutfit, swapPieceIndex, replacement, input);
    setOverrideOutfit(updated);
    setSwapPieceIndex(null);
    setAddedCompleteFeedback(false);
  };

  const handleTryAnotherLook = () => {
    setOverrideOutfit(null);
    setSwapPieceIndex(null);
    setAddedCompleteFeedback(false);
    setVariationIndex((v) => v + 1);
  };

  const handleAddCompleteLook = () => {
    onAddLookToCart(
      activeOutfit.pieces.map((p) => ({
        product: p.product,
        size: p.selectedSize,
        colour: p.selectedColour,
      }))
    );
    setAddedCompleteFeedback(true);
  };

  const handleSendLookWhatsApp = () => {
    onSendLookToWhatsApp(
      activeOutfit.pieces.map((p) => ({
        product: p.product,
        size: p.selectedSize,
        colour: p.selectedColour,
      }))
    );
  };

  const numericStep = step === 'results' ? 5 : step;

  return (
    <section
      aria-labelledby="style-finder-heading"
      className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16"
    >
      {/* Top Editorial Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.22em] text-[#3E5100] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nowa&apos;s Place Digital Stylist</span>
          </p>
          <h1
            id="style-finder-heading"
            className="mt-2 max-w-2xl font-display text-3xl font-bold leading-[1.06] tracking-tight text-[#171717] text-balance sm:text-4xl lg:text-5xl"
          >
            DON&apos;T KNOW WHAT TO WEAR? LET NOWA&apos;S PLACE STYLE YOU.
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {step !== 'results' ? (
            <button
              type="button"
              onClick={() => goToResults()}
              className="min-h-10 border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:border-[#171717]"
            >
              Skip to Curated Look
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSwapPieceIndex(null);
                setStep(1);
              }}
              className="inline-flex min-h-10 items-center gap-1.5 border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:border-[#171717]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Edit Preferences</span>
            </button>
          )}
        </div>
      </div>

      {step !== 'results' ? (
        <div className="mx-auto mt-10 max-w-3xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
              <span>Step 0{numericStep} of 05</span>
              <span className="tabular-nums">{Math.round((numericStep / 5) * 100)}% Complete</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden bg-[#F4F4F4]">
              <motion.div
                className="h-full bg-[#D8F36A]"
                initial={false}
                animate={{ width: `${(numericStep / 5) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="border border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8"
              >
                <p className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
                  Question 01
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717]">
                  What&apos;s the occasion?
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Pick where you&apos;re headed so we balance structure, comfort, and statement energy.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {STYLE_OCCASIONS.map((occ) => {
                    const active = input.occasion === occ;
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => {
                          setInput((prev) => ({ ...prev, occasion: occ }));
                          setStep(2);
                        }}
                        aria-pressed={active}
                        className={`min-h-12 border px-4 py-3 text-left text-sm font-medium transition-colors ${
                          active
                            ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                            : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-5">
                  <span className="text-xs text-neutral-500">Optional — skip anytime</span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex min-h-10 items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider text-[#171717] uppercase hover:underline"
                  >
                    <span>Skip Occasion</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="border border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8"
              >
                <p className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
                  Question 02
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717]">
                  Which aesthetic fits your mood?
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Choose a silhouette direction or skip for a balanced Nowa&apos;s Place mix.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {STYLE_PREFERENCES.map((st) => {
                    const active = input.style === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setInput((prev) => ({ ...prev, style: st }));
                          setStep(3);
                        }}
                        aria-pressed={active}
                        className={`min-h-12 border px-4 py-3 text-left text-sm font-medium transition-colors ${
                          active
                            ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                            : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-600 uppercase hover:text-[#171717]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex min-h-10 items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider text-[#171717] uppercase hover:underline"
                  >
                    <span>Skip Style</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="border border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8"
              >
                <p className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
                  Question 03
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717]">
                  What is your target outfit budget?
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  We match real catalogue prices to build the strongest possible look inside your range.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {BUDGET_TIERS.map((tier) => {
                    const active = input.budgetTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          if (tier.id === 'custom') {
                            setInput((prev) => ({ ...prev, budgetTier: 'custom' }));
                          } else {
                            setInput((prev) => ({
                              ...prev,
                              budgetTier: tier.id,
                              customBudgetNgn: undefined,
                            }));
                            setStep(4);
                          }
                        }}
                        aria-pressed={active}
                        className={`flex min-h-14 flex-col justify-center border px-4 py-3 text-left transition-colors ${
                          active
                            ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                            : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        <span className="text-sm font-semibold">{tier.label}</span>
                        <span className="mt-0.5 text-xs text-neutral-700">{tier.hint}</span>
                      </button>
                    );
                  })}
                </div>

                {input.budgetTier === 'custom' && (
                  <div className="mt-4 flex flex-col gap-3 border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label htmlFor="custom-budget-input" className="block text-xs font-medium text-[#171717]">
                        Custom Budget (₦ NGN)
                      </label>
                      <input
                        id="custom-budget-input"
                        type="number"
                        min={5000}
                        step={1000}
                        value={customBudgetText}
                        onChange={(e) => {
                          setCustomBudgetText(e.target.value);
                          const parsed = Number.parseInt(e.target.value, 10);
                          setInput((prev) => ({
                            ...prev,
                            budgetTier: 'custom',
                            customBudgetNgn: Number.isFinite(parsed) && parsed > 0 ? parsed : undefined,
                          }));
                        }}
                        placeholder="e.g. 45000"
                        className="mt-1.5 h-11 w-full border border-neutral-300 px-3.5 font-mono text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="min-h-11 bg-[#171717] px-6 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                    >
                      Continue
                    </button>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-600 uppercase hover:text-[#171717]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex min-h-10 items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider text-[#171717] uppercase hover:underline"
                  >
                    <span>Skip Budget</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="border border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8"
              >
                <p className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
                  Question 04
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717]">
                  Preferred colour palette?
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Select a tonal direction or keep it open for our stylists to mix.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {COLOUR_GROUPS.map((col) => {
                    const active = input.colourPreference === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => {
                          setInput((prev) => ({ ...prev, colourPreference: col }));
                          setStep(5);
                        }}
                        aria-pressed={active}
                        className={`min-h-12 border px-4 py-3 text-left text-sm font-medium transition-colors ${
                          active
                            ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                            : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-600 uppercase hover:text-[#171717]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="inline-flex min-h-10 items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider text-[#171717] uppercase hover:underline"
                  >
                    <span>Skip Colours</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="border border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8"
              >
                <p className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
                  Question 05
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717]">
                  Your preferred sizes (Optional)
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Pre-select your top, trouser, and footwear sizes so your outfit board is ready to bag.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <span className="block text-xs font-semibold tracking-wider text-[#171717] uppercase">
                      Top / Two-Piece Size
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {TOP_SIZES.map((sz) => {
                        const active = input.topSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() =>
                              setInput((prev) => ({
                                ...prev,
                                topSize: prev.topSize === sz ? undefined : sz,
                              }))
                            }
                            aria-pressed={active}
                            className={`min-h-10 min-w-12 border px-3.5 text-xs font-medium transition-colors ${
                              active
                                ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                                : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold tracking-wider text-[#171717] uppercase">
                      Trouser / Denim Waist
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {TROUSER_SIZES.map((sz) => {
                        const active = input.trouserSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() =>
                              setInput((prev) => ({
                                ...prev,
                                trouserSize: prev.trouserSize === sz ? undefined : sz,
                              }))
                            }
                            aria-pressed={active}
                            className={`min-h-10 min-w-12 border px-3.5 text-xs font-medium transition-colors ${
                              active
                                ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                                : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold tracking-wider text-[#171717] uppercase">
                      Footwear Size (EU)
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {FOOTWEAR_SIZES.map((sz) => {
                        const active = input.footwearSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() =>
                              setInput((prev) => ({
                                ...prev,
                                footwearSize: prev.footwearSize === sz ? undefined : sz,
                              }))
                            }
                            aria-pressed={active}
                            className={`min-h-10 min-w-12 border px-3.5 text-xs font-medium transition-colors ${
                              active
                                ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                                : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-600 uppercase hover:text-[#171717]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToResults()}
                    className="inline-flex min-h-12 items-center gap-2 bg-[#171717] px-7 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Reveal My Nowa&apos;s Place Look</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Editorial Outfit Board Results */
        <div className="mt-10">
          {/* Active Preference Summary + Budget Alert */}
          <div className="border border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-[#3E5100] uppercase">
                  Editorial Outfit Board
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
                  {activeOutfit.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  {activeOutfit.stylingNote}
                </p>
              </div>

              <div className="shrink-0 border border-neutral-200 bg-white px-5 py-4">
                <span className="block text-[11px] font-medium tracking-wider text-neutral-500 uppercase">
                  Complete Look Total ({activeOutfit.pieces.length} pieces)
                </span>
                <span
                  data-testid="outfit-board-total"
                  className="mt-1 block font-mono text-2xl font-bold text-[#171717] tabular-nums"
                >
                  {formatNaira(activeOutfit.totalPriceNgn)}
                </span>
                {activeOutfit.budgetMaxNgn !== null && (
                  <span className="mt-0.5 block text-xs text-neutral-600">
                    Target: {formatNaira(activeOutfit.budgetMaxNgn)}
                  </span>
                )}
              </div>
            </div>

            {activeOutfit.budgetMessage && (
              <div
                role="note"
                className="mt-5 border border-neutral-300 bg-white px-4 py-3 text-xs leading-relaxed text-neutral-700"
              >
                <strong className="font-semibold text-[#171717]">Budget Note:</strong>{' '}
                {activeOutfit.budgetMessage}
              </div>
            )}
          </div>

          {/* Coordinated Piece Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activeOutfit.pieces.map((piece, idx) => (
              <div
                key={`${piece.product.id}-${idx}`}
                data-testid={`outfit-piece-${idx}`}
                className="flex flex-col border border-neutral-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => onQuickView(piece.product)}
                  className="aspect-[3/4] w-full overflow-hidden bg-[#F4F4F4] text-left"
                >
                  <img
                    src={piece.product.image}
                    alt={piece.product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                  />
                </button>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-500">
                      <span className="uppercase tracking-wider">{piece.slot}</span>
                      <span>{piece.product.category}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onQuickView(piece.product)}
                      className="mt-1 text-left font-display text-base font-semibold text-[#171717] hover:underline"
                    >
                      {piece.product.name}
                    </button>
                    <p className="mt-1 font-mono text-sm font-medium text-[#171717] tabular-nums">
                      {formatNaira(piece.product.priceNgn)}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2.5 border-t border-neutral-100 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        aria-label={`Size for ${piece.product.name}`}
                        value={piece.selectedSize}
                        onChange={(e) =>
                          handlePieceVariantChange(idx, 'selectedSize', e.target.value)
                        }
                        className="h-9 border border-neutral-200 bg-[#FAF9F6] px-2 text-xs font-medium text-[#171717]"
                      >
                        {piece.product.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <select
                        aria-label={`Colour for ${piece.product.name}`}
                        value={piece.selectedColour}
                        onChange={(e) =>
                          handlePieceVariantChange(idx, 'selectedColour', e.target.value)
                        }
                        className="h-9 border border-neutral-200 bg-[#FAF9F6] px-2 text-xs font-medium text-[#171717]"
                      >
                        {piece.product.colours.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSwapPieceIndex(swapPieceIndex === idx ? null : idx)
                        }
                        className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 border px-3 text-xs font-semibold tracking-wider uppercase transition-colors ${
                          swapPieceIndex === idx
                            ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                            : 'border-neutral-300 bg-white text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>SWAP AN ITEM</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inline Swap Picker Panel */}
          <AnimatePresence>
            {swapPieceIndex !== null && activeOutfit.pieces[swapPieceIndex] && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-6 border border-[#171717] bg-[#FAF9F6] p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#171717] uppercase">
                      Swap {activeOutfit.pieces[swapPieceIndex].product.name}
                    </p>
                    <p className="text-xs text-neutral-600">
                      Choose another {activeOutfit.pieces[swapPieceIndex].slot} piece from the Nowa&apos;s Place catalogue
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSwapPieceIndex(null)}
                    aria-label="Close swap options"
                    className="flex h-9 w-9 items-center justify-center bg-white text-[#171717] hover:bg-neutral-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {swapCandidates.length === 0 ? (
                  <p className="mt-4 text-xs text-neutral-600">
                    No alternative items in this slot right now. Try &ldquo;Try Another Look&rdquo; to remix the whole outfit.
                  </p>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {swapCandidates.map((cand) => (
                      <button
                        key={cand.id}
                        type="button"
                        onClick={() => handleSwapConfirm(cand)}
                        className="flex items-center gap-3 border border-neutral-200 bg-white p-2.5 text-left transition-colors hover:border-[#171717]"
                      >
                        <img
                          src={cand.image}
                          alt={cand.name}
                          referrerPolicy="no-referrer"
                          className="h-16 w-14 shrink-0 bg-[#F4F4F4] object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-display text-xs font-semibold text-[#171717]">
                            {cand.name}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-neutral-600 tabular-nums">
                            {formatNaira(cand.priceNgn)}
                          </p>
                          <span className="mt-1 inline-block text-[11px] font-semibold text-[#3E5100]">
                            Select replacement →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Outfit Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-6">
            <button
              type="button"
              onClick={handleAddCompleteLook}
              className={`inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-colors ${
                addedCompleteFeedback
                  ? 'bg-[#D8F36A] text-[#171717]'
                  : 'bg-[#171717] text-white hover:bg-[#D8F36A] hover:text-[#171717]'
              }`}
            >
              {addedCompleteFeedback ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>COMPLETE LOOK ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    ADD COMPLETE LOOK TO CART · {formatNaira(activeOutfit.totalPriceNgn)}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTryAnotherLook}
              className="inline-flex min-h-12 items-center gap-2 border border-[#171717] bg-white px-5 py-3 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:bg-[#F4F4F4]"
            >
              <RefreshCw className="h-4 w-4" />
              <span>TRY ANOTHER LOOK</span>
            </button>

            <button
              type="button"
              onClick={handleSendLookWhatsApp}
              className="inline-flex min-h-12 items-center gap-2 border border-[#171717] bg-[#FAF9F6] px-5 py-3 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:bg-[#D8F36A]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>SEND LOOK TO WHATSAPP</span>
            </button>

            <button
              type="button"
              onClick={onBrowseShop}
              className="inline-flex min-h-12 items-center gap-2 px-4 py-3 text-xs font-semibold tracking-wider text-neutral-600 uppercase hover:text-[#171717]"
            >
              <span>SHOP INDIVIDUAL ITEMS</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
