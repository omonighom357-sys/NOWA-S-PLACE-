import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GarmentSlot, Product } from '../types/store';
import { PRODUCTS } from '../data/catalogue';
import { formatNaira } from '../utils/currency';
import { STORE_CONFIG } from '../config/storeConfig';
import {
  getAlternativeForLookSlot,
  getCompleteTheLookRecommendations,
} from '../utils/completeTheLook';

interface ProductModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, colour: string, quantity: number) => void;
  onAddLookBundleToCart: (
    items: { product: Product; size: string; colour: string; quantity: number }[]
  ) => void;
  onOpenCart: () => void;
}

export function ProductModal({
  product,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onAddLookBundleToCart,
  onOpenCart,
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Complete the Look customization state
  const [slotOverrides, setSlotOverrides] = useState<Partial<Record<GarmentSlot, string>>>({});
  const [excludedLookIds, setExcludedLookIds] = useState<string[]>([]);
  const [lookSizes, setLookSizes] = useState<Record<string, string>>({});
  const [customizeMode, setCustomizeMode] = useState(false);
  const [bundleAddedFeedback, setBundleAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? 'One Size');
      setSelectedColour(product.colours[0]?.name ?? 'Default');
      setQuantity(1);
      setAddedFeedback(false);
      setSlotOverrides({});
      setExcludedLookIds([]);
      setLookSizes({});
      setCustomizeMode(false);
      setBundleAddedFeedback(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [product, onClose]);

  const complementaryItems = useMemo(() => {
    if (!product) return [];
    return getCompleteTheLookRecommendations(PRODUCTS, product, slotOverrides);
  }, [product, slotOverrides]);

  const activeComplements = useMemo(
    () => complementaryItems.filter((item) => !excludedLookIds.includes(item.id)),
    [complementaryItems, excludedLookIds]
  );

  const combinedLookTotal = useMemo(() => {
    if (!product) return 0;
    const complementsSum = activeComplements.reduce((s, p) => s + p.priceNgn, 0);
    return product.priceNgn * quantity + complementsSum;
  }, [product, quantity, activeComplements]);

  const handleAdd = () => {
    if (!product) return;
    onAddToCart(product, selectedSize, selectedColour, quantity);
    setAddedFeedback(true);
  };

  const handleSwapComplement = (item: Product) => {
    if (!product) return;
    const alts = getAlternativeForLookSlot(PRODUCTS, product, item.slot, item.id);
    if (alts.length > 0) {
      setSlotOverrides((prev) => ({ ...prev, [item.slot]: alts[0].id }));
      setBundleAddedFeedback(false);
    }
  };

  const handleToggleIncludeComplement = (itemId: string) => {
    setExcludedLookIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
    setBundleAddedFeedback(false);
  };

  const handleAddAllToCart = () => {
    if (!product) return;
    const bundle = [
      {
        product,
        size: selectedSize,
        colour: selectedColour,
        quantity,
      },
      ...activeComplements.map((item) => ({
        product: item,
        size: lookSizes[item.id] ?? item.sizes[0] ?? 'One Size',
        colour: item.colours[0]?.name ?? 'Default',
        quantity: 1,
      })),
    ];
    onAddLookBundleToCart(bundle);
    setBundleAddedFeedback(true);
  };

  return (
    <AnimatePresence>
      {product && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Product details for ${product.name}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center bg-white/90 text-[#171717] transition-colors hover:bg-[#F4F4F4] focus-visible:outline-2 focus-visible:outline-[#171717]"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Studio Image */}
              <div className="aspect-[3/4] w-full bg-[#F4F4F4] md:aspect-auto md:h-full">
                <img
                  src={product.image}
                  alt={`${product.name} studio view`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Contiguous Purchase Module */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="flex items-center justify-between gap-2 pr-10">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{product.category}</span>
                      {product.isNewArrival && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#3E5100]">New Arrival</span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      aria-pressed={isWishlisted}
                      className="inline-flex min-h-8 items-center gap-1.5 border border-neutral-200 px-2.5 py-1 text-xs font-medium text-[#171717] transition-colors hover:border-[#171717]"
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-[#171717]' : ''}`}
                        strokeWidth={1.75}
                      />
                      <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
                    {product.name}
                  </h2>

                  <p className="mt-2 font-mono text-xl font-medium text-[#171717] tabular-nums">
                    {formatNaira(product.priceNgn)}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                    {product.description}
                  </p>

                  <dl className="mt-5 space-y-2 border-y border-neutral-200 py-4 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">Fabric</dt>
                      <dd className="text-right font-medium text-[#171717]">{product.fabricNote}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">Fit</dt>
                      <dd className="text-right font-medium text-[#171717]">{product.fitNote}</dd>
                    </div>
                  </dl>

                  {/* Colour Selection */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#171717]">Colour</span>
                      <span className="text-neutral-500">{selectedColour}</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2.5">
                      {product.colours.map((c) => {
                        const active = selectedColour === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setSelectedColour(c.name)}
                            aria-pressed={active}
                            className={`flex min-h-10 items-center gap-2 border px-3 py-1.5 text-xs font-medium transition-colors ${
                              active
                                ? 'border-[#171717] bg-[#FAF9F6] text-[#171717]'
                                : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                            }`}
                          >
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-neutral-300"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#171717]">Select Size</span>
                      <span className="text-neutral-500">Demo sizing</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {product.sizes.map((size) => {
                        const active = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            aria-pressed={active}
                            className={`min-h-10 min-w-12 border px-3.5 py-2 text-xs font-medium transition-colors ${
                              active
                                ? 'border-[#171717] bg-[#171717] text-white'
                                : 'border-neutral-200 bg-white text-[#171717] hover:border-[#171717]'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#171717]">Quantity</span>
                    <div className="flex items-center border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                        className="flex h-10 w-10 items-center justify-center text-[#171717] hover:bg-[#F4F4F4]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span
                        data-testid="modal-quantity-value"
                        className="w-10 text-center font-mono text-sm font-medium tabular-nums"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                        aria-label="Increase quantity"
                        className="flex h-10 w-10 items-center justify-center text-[#171717] hover:bg-[#F4F4F4]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 space-y-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className={`flex min-h-12 flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                        addedFeedback
                          ? 'bg-[#D8F36A] text-[#171717]'
                          : 'bg-[#171717] text-white hover:bg-[#D8F36A] hover:text-[#171717]'
                      }`}
                    >
                      {addedFeedback ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Cart · {formatNaira(product.priceNgn * quantity)}</span>
                        </>
                      )}
                    </button>

                    {addedFeedback && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCart();
                        }}
                        className="min-h-12 border border-[#171717] px-5 py-3 text-sm font-medium text-[#171717] transition-colors hover:bg-[#F4F4F4]"
                      >
                        View Bag
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-500">
                    {STORE_CONFIG.demoCatalogueNotice}
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 6: Complete the Look Editorial Pairing Module */}
            {complementaryItems.length > 0 && (
              <div
                data-testid="complete-the-look-section"
                className="border-t border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-[#3E5100] uppercase">
                      Stylist Pairing
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-[#171717] sm:text-xl">
                      COMPLETE THE LOOK
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomizeMode((c) => !c)}
                    className={`inline-flex min-h-9 items-center gap-1.5 border px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
                      customizeMode
                        ? 'border-[#171717] bg-[#D8F36A] text-[#171717]'
                        : 'border-neutral-300 bg-white text-[#171717] hover:border-[#171717]'
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>{customizeMode ? 'Done Customizing' : 'Customize Outfit'}</span>
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {complementaryItems.map((item) => {
                    const included = !excludedLookIds.includes(item.id);
                    const chosenSize = lookSizes[item.id] ?? item.sizes[0] ?? 'One Size';
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col justify-between border p-3 transition-opacity ${
                          included
                            ? 'border-neutral-200 bg-white'
                            : 'border-neutral-200 bg-neutral-100/70 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="h-16 w-14 shrink-0 bg-[#F4F4F4] object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10px] font-medium tracking-wider text-neutral-500 uppercase">
                              {item.category}
                            </span>
                            <p className="truncate font-display text-xs font-semibold text-[#171717]">
                              {item.name}
                            </p>
                            <p className="mt-0.5 font-mono text-xs font-medium text-[#171717] tabular-nums">
                              {formatNaira(item.priceNgn)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-2.5">
                          <select
                            aria-label={`Size for ${item.name}`}
                            value={chosenSize}
                            onChange={(e) =>
                              setLookSizes((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            className="h-8 border border-neutral-200 bg-[#FAF9F6] px-2 text-[11px] font-medium text-[#171717]"
                          >
                            {item.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSwapComplement(item)}
                              className="inline-flex h-8 items-center gap-1 border border-neutral-300 bg-white px-2.5 text-[11px] font-medium text-[#171717] hover:border-[#171717]"
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Swap Item</span>
                            </button>

                            {customizeMode && (
                              <button
                                type="button"
                                onClick={() => handleToggleIncludeComplement(item.id)}
                                className="inline-flex h-8 items-center border border-neutral-300 bg-white px-2 text-[11px] font-medium text-[#171717] hover:border-[#171717]"
                              >
                                {included ? 'Skip' : 'Include'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="text-xs text-neutral-600">
                      Combined Look ({1 + activeComplements.length} items)
                    </span>
                    <span
                      data-testid="complete-the-look-total"
                      className="ml-2 font-mono text-base font-bold text-[#171717] tabular-nums"
                    >
                      {formatNaira(combinedLookTotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAllToCart}
                    className={`inline-flex min-h-11 w-full items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors sm:w-auto ${
                      bundleAddedFeedback
                        ? 'bg-[#D8F36A] text-[#171717]'
                        : 'bg-[#171717] text-white hover:bg-[#D8F36A] hover:text-[#171717]'
                    }`}
                  >
                    {bundleAddedFeedback ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>All Items Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add All to Cart · {formatNaira(combinedLookTotal)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
