import { useEffect } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types/store';
import { formatNaira } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotalNgn: number;
  onUpdateQuantity: (key: string, nextQty: number) => void;
  onRemoveItem: (key: string) => void;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  subtotalNgn,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onProceedToCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-lg font-bold tracking-tight text-[#171717]">
                  Your Bag
                </h2>
                <span className="font-mono text-xs text-neutral-500 tabular-nums">
                  ({totalCount})
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shopping bag"
                className="flex h-10 w-10 items-center justify-center text-[#171717] transition-colors hover:bg-[#F4F4F4]"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center bg-[#F4F4F4] text-neutral-500">
                    <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold text-[#171717]">
                    Your bag is empty
                  </p>
                  <p className="mt-1.5 max-w-xs text-sm text-neutral-500">
                    Explore baggy denim, oversized essentials, and footwear curated for everyday rotation.
                  </p>
                  <button
                    type="button"
                    onClick={onContinueShopping}
                    className="mt-6 min-h-11 bg-[#171717] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Shop the Collection
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-200">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-5 first:pt-0">
                      <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#F4F4F4]">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-sm font-semibold text-[#171717]">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-neutral-500">
                              Size {item.size} · {item.colour}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Remove ${item.name} (${item.size}, ${item.colour})`}
                            className="flex h-8 w-8 items-center justify-center text-neutral-400 transition-colors hover:text-[#171717]"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-neutral-200">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="flex h-8 w-8 items-center justify-center text-[#171717] hover:bg-[#F4F4F4]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-mono text-xs font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="flex h-8 w-8 items-center justify-center text-[#171717] hover:bg-[#F4F4F4]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-mono text-sm font-medium text-[#171717] tabular-nums">
                            {formatNaira(item.priceNgn * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 bg-[#FAF9F6] px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span
                    data-testid="cart-subtotal-value"
                    className="font-mono text-lg font-semibold text-[#171717] tabular-nums"
                  >
                    {formatNaira(subtotalNgn)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Delivery fees: To be confirmed by store on WhatsApp.
                </p>

                <div className="mt-4 space-y-2.5">
                  <button
                    type="button"
                    onClick={onProceedToCheckout}
                    className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#171717] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    <span>Proceed to WhatsApp Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onContinueShopping}
                    className="flex min-h-10 w-full items-center justify-center border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-[#171717] transition-colors hover:bg-[#F4F4F4]"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
