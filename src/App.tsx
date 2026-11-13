import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Category, PageView, Product, SortOption } from './types/store';
import { PRODUCTS } from './data/catalogue';
import {
  addCartItem,
  calculateCartItemCount,
  calculateCartSubtotal,
  loadCartFromStorage,
  removeCartItem,
  saveCartToStorage,
  updateCartQuantity,
} from './utils/cartLogic';
import {
  loadWishlistFromStorage,
  saveWishlistToStorage,
  toggleWishlistId,
} from './utils/wishlistLogic';
import { AssistantQuickAction } from './utils/askNowasEngine';
import { BrandIntro, shouldShowBrandIntro } from './components/BrandIntro';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { CollectionsView } from './components/CollectionsView';
import { StyleFinderView } from './components/StyleFinderView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AskNowasWidget } from './components/AskNowasWidget';

interface BundleCartEntry {
  product: Product;
  size: string;
  colour: string;
  quantity?: number;
}

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => shouldShowBrandIntro());
  const [activePage, setActivePage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadWishlistFromStorage());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveWishlistToStorage(wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const cartCount = useMemo(() => calculateCartItemCount(cartItems), [cartItems]);
  const cartSubtotal = useMemo(() => calculateCartSubtotal(cartItems), [cartItems]);

  const wishlistProducts = useMemo(
    () =>
      wishlistIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [wishlistIds]
  );

  const triggerToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2600);
  }, []);

  const handleNavigate = useCallback(
    (page: PageView, category?: Category | 'All') => {
      setActivePage(page);
      if (category !== undefined) {
        setSelectedCategory(category);
      } else if (page === 'new-arrivals') {
        setSelectedCategory('All');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const handleToggleWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => {
        const next = toggleWishlistId(prev, productId);
        const product = PRODUCTS.find((p) => p.id === productId);
        if (product) {
          const added = next.includes(productId);
          triggerToast(added ? `Saved ${product.name}` : `Removed ${product.name} from saved`);
        }
        return next;
      });
    },
    [triggerToast]
  );

  const handleAddToCart = useCallback(
    (product: Product, size: string, colour: string, quantity = 1) => {
      setCartItems((prev) => addCartItem(prev, product, size, colour, quantity));
      triggerToast(`Added ${product.name} (${size}) to bag`);
    },
    [triggerToast]
  );

  const handleAddLookBundleToCart = useCallback(
    (entries: BundleCartEntry[]) => {
      if (entries.length === 0) return;
      setCartItems((prev) =>
        entries.reduce(
          (acc, entry) =>
            addCartItem(acc, entry.product, entry.size, entry.colour, entry.quantity ?? 1),
          prev
        )
      );
      triggerToast(`Added ${entries.length}-piece complete look to bag`);
    },
    [triggerToast]
  );

  const handleSendLookToWhatsApp = useCallback((entries: BundleCartEntry[]) => {
    if (entries.length === 0) return;
    setCartItems((prev) =>
      entries.reduce(
        (acc, entry) =>
          addCartItem(acc, entry.product, entry.size, entry.colour, entry.quantity ?? 1),
        prev
      )
    );
    setIsCheckoutOpen(true);
  }, []);

  const handleUpdateCartQty = useCallback((key: string, nextQty: number) => {
    setCartItems((prev) => updateCartQuantity(prev, key, nextQty));
  }, []);

  const handleRemoveCartItem = useCallback((key: string) => {
    setCartItems((prev) => removeCartItem(prev, key));
  }, []);

  const handleAssistantAction = useCallback(
    (action: AssistantQuickAction['type']) => {
      if (action === 'open-style-finder') {
        handleNavigate('style-finder');
      } else if (action === 'browse-shop') {
        handleNavigate('shop', 'All');
      } else if (action === 'open-cart') {
        setIsCartOpen(true);
      } else if (action === 'view-location') {
        setActivePage('home');
        window.setTimeout(() => {
          document.getElementById('boutique-location')?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    },
    [handleNavigate]
  );

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#171717]">
      {showIntro && <BrandIntro onComplete={() => setShowIntro(false)} />}

      {quotaExceeded && (
        <div
          role="alert"
          data-testid="gmp-quota-banner"
          className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs font-medium text-amber-900"
        >
          Google Maps Platform demo quota exceeded (100 requests/day limit reached).{' '}
          <a
            href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            View quota &amp; billing options
          </a>
          .
        </div>
      )}

      <Header
        activePage={activePage}
        onNavigate={(page) => handleNavigate(page)}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={handleNavigate}
            onQuickView={setQuickViewProduct}
            onQuickAdd={(product, size, colour) => handleAddToCart(product, size, colour, 1)}
          />
        )}

        {(activePage === 'shop' || activePage === 'new-arrivals') && (
          <ShopView
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onlyNewArrivals={activePage === 'new-arrivals'}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={setQuickViewProduct}
            onQuickAdd={(product, size, colour) => handleAddToCart(product, size, colour, 1)}
          />
        )}

        {activePage === 'collections' && <CollectionsView onNavigate={handleNavigate} />}

        {activePage === 'style-finder' && (
          <StyleFinderView
            onQuickView={setQuickViewProduct}
            onAddLookToCart={handleAddLookBundleToCart}
            onSendLookToWhatsApp={handleSendLookToWhatsApp}
            onBrowseShop={() => handleNavigate('shop', 'All')}
          />
        )}

        {activePage === 'about' && <AboutView onNavigate={(page) => handleNavigate(page)} />}
      </main>

      <Footer onNavigate={(page) => handleNavigate(page)} />

      {/* Product Detail / Quick View Modal + Complete the Look */}
      <ProductModal
        product={quickViewProduct}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddLookBundleToCart={handleAddLookBundleToCart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Slide-Over Saved Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onQuickView={setQuickViewProduct}
        onQuickAdd={(product, size, colour) => handleAddToCart(product, size, colour, 1)}
        onBrowseShop={() => handleNavigate('shop', 'All')}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotalNgn={cartSubtotal}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onContinueShopping={() => {
          setIsCartOpen(false);
          if (activePage === 'home' || activePage === 'about' || activePage === 'style-finder') {
            handleNavigate('shop', 'All');
          }
        }}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotalNgn={cartSubtotal}
      />

      {/* Floating Ask Nowa's Place Personal Shopping Assistant */}
      <AskNowasWidget
        hideLauncher={
          showIntro || isCartOpen || isCheckoutOpen || Boolean(quickViewProduct) || isWishlistOpen
        }
        onQuickAdd={(product, size, colour) => handleAddToCart(product, size, colour, 1)}
        onQuickView={setQuickViewProduct}
        onAction={handleAssistantAction}
      />

      {/* Subtle Add-to-Bag Feedback Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
            className="fixed top-20 right-4 z-50 flex items-center gap-2.5 border border-neutral-200 bg-[#171717] px-4 py-3 text-xs font-medium text-white shadow-lg sm:right-6"
          >
            <CheckCircle2 className="h-4 w-4 text-[#D8F36A]" />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="ml-2 border-l border-white/20 pl-2.5 font-semibold text-white underline-offset-4 hover:underline"
            >
              View Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
