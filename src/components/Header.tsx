import { useEffect, useState } from 'react';
import { Heart, Menu, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageView } from '../types/store';
import { STORE_CONFIG } from '../config/storeConfig';

interface HeaderProps {
  activePage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

const NAV_ITEMS: { id: PageView; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'collections', label: 'Collections' },
  { id: 'style-finder', label: 'Style Finder' },
  { id: 'about', label: 'About' },
];

export function Header({
  activePage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageView) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
          isScrolled
            ? 'h-14 border-neutral-200/90 bg-white/95 backdrop-blur-md'
            : 'h-16 border-neutral-200/70 bg-white'
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-6 lg:gap-8 lg:px-10">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-10 items-center justify-center text-[#171717] transition-colors hover:bg-[#F4F4F4] focus-visible:outline-2 focus-visible:outline-[#171717]"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="font-display text-sm font-bold tracking-[0.16em] text-[#171717] whitespace-nowrap shrink-0 transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] sm:text-lg sm:tracking-[0.18em]"
          >
            {STORE_CONFIG.brandName}
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-5 md:flex lg:gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] ${
                    isActive ? 'text-[#171717] font-semibold' : 'text-neutral-500 hover:text-[#171717]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-[3px] bg-[#D8F36A]"
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Wishlist & Shopping Bag */}
          <div className="flex items-center gap-1 shrink-0 sm:gap-2">
            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Open saved wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
              className="relative flex min-h-11 items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-[#171717] whitespace-nowrap shrink-0 transition-colors hover:bg-[#F4F4F4] focus-visible:outline-2 focus-visible:outline-[#171717]"
            >
              <Heart className={`h-[18px] w-[18px] ${wishlistCount > 0 ? 'fill-[#171717]' : ''}`} strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span
                  data-testid="wishlist-badge-count"
                  className="inline-flex h-4 min-w-4 items-center justify-center bg-[#D8F36A] px-1 font-mono text-[10px] font-bold text-[#171717] tabular-nums"
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
              className="relative flex min-h-11 items-center gap-2 px-2.5 py-2 text-sm font-medium text-[#171717] whitespace-nowrap shrink-0 transition-colors hover:bg-[#F4F4F4] focus-visible:outline-2 focus-visible:outline-[#171717] sm:px-3"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="hidden sm:inline">Bag</span>
              <motion.span
                key={cartCount}
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.18 }}
                data-testid="cart-badge-count"
                className={`inline-flex h-5 min-w-5 items-center justify-center px-1.5 font-mono text-xs font-medium tabular-nums ${
                  cartCount > 0
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#F4F4F4] text-neutral-700'
                }`}
              >
                {cartCount}
              </motion.span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/35 backdrop-blur-[2px]"
            />

            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 flex w-[82%] max-w-xs flex-col justify-between bg-white px-6 py-6 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <span className="font-display text-base font-bold tracking-[0.18em] text-[#171717]">
                    {STORE_CONFIG.brandName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className="flex h-11 w-11 items-center justify-center text-[#171717] hover:bg-[#F4F4F4]"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`flex min-h-12 items-center justify-between border-b border-neutral-100 py-3 text-left font-display text-lg font-medium transition-colors ${
                          isActive ? 'font-bold text-[#171717]' : 'text-neutral-600 hover:text-[#171717]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="h-2 w-4 bg-[#D8F36A]" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-5 text-xs leading-relaxed text-neutral-500">
                <p className="font-medium text-[#171717]">Nowa&apos;s Place · Udu, Delta State</p>
                <p className="mt-1">{STORE_CONFIG.demoCatalogueNotice}</p>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
