import { useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types/store';
import { formatNaira } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, colour: string) => void;
  onBrowseShop: () => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  products,
  onRemoveWishlist,
  onQuickView,
  onQuickAdd,
  onBrowseShop,
}: WishlistDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Saved Wishlist"
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
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-lg font-bold tracking-tight text-[#171717]">
                  Saved Fits
                </h2>
                <span className="font-mono text-xs text-neutral-500 tabular-nums">
                  ({products.length})
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close wishlist"
                className="flex h-10 w-10 items-center justify-center text-[#171717] transition-colors hover:bg-[#F4F4F4]"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {products.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center bg-[#F4F4F4] text-neutral-500">
                    <Heart className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold text-[#171717]">
                    No saved pieces yet
                  </p>
                  <p className="mt-1.5 max-w-xs text-sm text-neutral-500">
                    Tap the heart icon on any piece to build your shortlist before checking out.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBrowseShop();
                    }}
                    className="mt-6 min-h-11 bg-[#171717] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                  >
                    Explore Catalogue
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-200">
                  {products.map((product) => (
                    <li key={product.id} className="flex gap-4 py-5 first:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onQuickView(product);
                        }}
                        className="h-24 w-20 shrink-0 overflow-hidden bg-[#F4F4F4]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-center"
                        />
                      </button>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] text-neutral-500">{product.category}</p>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onQuickView(product);
                              }}
                              className="mt-0.5 text-left font-display text-sm font-semibold text-[#171717] hover:underline"
                            >
                              {product.name}
                            </button>
                            <p className="mt-1 font-mono text-xs font-medium text-[#171717] tabular-nums">
                              {formatNaira(product.priceNgn)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveWishlist(product.id)}
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="flex h-8 w-8 items-center justify-center text-neutral-400 transition-colors hover:text-[#171717]"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onQuickAdd(
                                product,
                                product.sizes[0] ?? 'One Size',
                                product.colours[0]?.name ?? 'Default'
                              )
                            }
                            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 bg-[#171717] px-3 text-xs font-medium text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
