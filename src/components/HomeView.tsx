import { ArrowRight, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES, Category, PageView, Product } from '../types/store';
import { CATEGORY_HIGHLIGHTS, EDITORIAL_ASSETS, PRODUCTS } from '../data/catalogue';
import { STORE_CONFIG } from '../config/storeConfig';
import { ProductCard } from './ProductCard';
import { BoutiqueLocationSection } from './BoutiqueLocationSection';

interface HomeViewProps {
  wishlistIds: readonly string[];
  onToggleWishlist: (productId: string) => void;
  onNavigate: (page: PageView, category?: Category | 'All') => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, colour: string) => void;
}

export function HomeView({
  wishlistIds,
  onToggleWishlist,
  onNavigate,
  onQuickView,
  onQuickAdd,
}: HomeViewProps) {
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);
  const featuredStyles = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div>
      {/* 1. Elevated Editorial Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF9F6]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch lg:grid-cols-12">
          {/* Left Copy Column */}
          <div className="flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-16 lg:col-span-5 lg:px-10 lg:py-24">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-semibold tracking-[0.22em] text-[#3E5100] uppercase"
            >
              Nowa&apos;s Place · Contemporary Streetwear
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.03] tracking-tight text-[#171717] text-balance sm:text-5xl lg:text-6xl"
            >
              NOT JUST CLOTHES.
              <br />
              IT&apos;S YOUR STATEMENT.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-md text-base leading-relaxed text-neutral-600"
            >
              Discover the fits, essentials, and statement pieces that bring your style to life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <button
                type="button"
                onClick={() => onNavigate('shop', 'All')}
                className="inline-flex min-h-12 items-center gap-2 bg-[#171717] px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase whitespace-nowrap transition-colors hover:bg-[#D8F36A] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <span>SHOP THE COLLECTION</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('style-finder')}
                className="inline-flex min-h-12 items-center gap-2 border border-[#171717] bg-[#D8F36A] px-6 py-3 text-xs font-semibold tracking-wider text-[#171717] uppercase whitespace-nowrap transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>LET NOWA&apos;S PLACE STYLE ME</span>
              </button>
            </motion.div>

            <p className="mt-5 text-xs text-neutral-500 sm:mt-8">
              {STORE_CONFIG.demoCatalogueNotice}
            </p>
          </div>

          {/* Right Editorial Photography */}
          <motion.div
            initial={{ opacity: 0.85, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[280px] overflow-hidden bg-[#F4F4F4] sm:min-h-[480px] lg:col-span-7 lg:min-h-[600px]"
          >
            <img
              src={EDITORIAL_ASSETS.hero}
              alt="Two models wearing relaxed vintage blue baggy denim and heavyweight ivory tees in sunlit courtyard"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Animated Category Navigation Strip */}
      <section
        aria-label="Category quick navigation"
        className="border-y border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-3 lg:justify-between">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onNavigate('shop', category)}
                className="min-h-9 shrink-0 px-2.5 py-1.5 text-xs font-medium text-neutral-600 whitespace-nowrap transition-colors hover:bg-[#D8F36A]/45 hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717]"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. New Arrivals Product Grid */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#3E5100] uppercase">
              Latest Rotation
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              New Arrivals
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('new-arrivals', 'All')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:underline"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4"
        >
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </motion.div>
      </section>

      {/* 4. Nowa's Place Digital Stylist Feature Callout */}
      <section className="border-y border-neutral-200 bg-[#171717] py-14 text-white lg:py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.22em] text-[#D8F36A] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nowa&apos;s Place Style Finder</span>
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white text-balance sm:text-3xl lg:text-4xl">
              DON&apos;T KNOW WHAT TO WEAR? LET NOWA&apos;S PLACE STYLE YOU.
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-neutral-300">
              Answer 5 quick questions about your occasion, aesthetic, budget, colours, and sizes to
              build a complete editorial outfit board from real in-stock pieces.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('style-finder')}
            className="inline-flex min-h-12 shrink-0 items-center gap-2 bg-[#D8F36A] px-7 py-3 text-xs font-bold tracking-wider text-[#171717] uppercase transition-colors hover:bg-white"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start Style Finder</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 5. Large Editorial Feature: THE ART OF DRESSING DIFFERENT. */}
      <section className="bg-[#FAF9F6] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
          <div className="overflow-hidden bg-[#F4F4F4] lg:col-span-6">
            <img
              src={EDITORIAL_ASSETS.artOfDressing}
              alt="Model in oversized charcoal knit sweater and wide-leg pleated trousers in bright studio"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full min-h-[380px] w-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col justify-center lg:col-span-6 lg:pl-6">
            <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
              Editorial Direction
            </p>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-bold leading-[1.08] tracking-tight text-[#171717] text-balance sm:text-4xl lg:text-5xl">
              THE ART OF DRESSING DIFFERENT.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-600">
              Built around relaxed proportions, heavyweight cottons, and unhurried silhouettes.
              Each piece pairs cleanly across denim, cargos, tailored trousers, and everyday footwear.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-neutral-200 pt-6 sm:max-w-md">
              <div>
                <p className="font-display text-sm font-semibold text-[#171717]">
                  Relaxed Architecture
                </p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  Wide-leg cuts, dropped shoulders, and boxy silhouettes engineered to drape naturally.
                </p>
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-[#171717]">
                  Direct Concierge
                </p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  Curate your bag online and finalize size, delivery, and payment directly on WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className="inline-flex min-h-11 items-center gap-2 border border-[#171717] bg-white px-6 py-2.5 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:bg-[#171717] hover:text-white"
              >
                <span>Explore Curated Capsules</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Shop by Category */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
              Browse Departments
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              Shop by Category
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('shop', 'All')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:underline"
          >
            <span>Browse Full Catalogue (25)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {CATEGORY_HIGHLIGHTS.slice(0, 6).map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => onNavigate('shop', cat.name)}
              className="group flex flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-[#F4F4F4]">
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <span className="mt-3 font-display text-sm font-semibold text-[#171717] group-hover:underline">
                {cat.name}
              </span>
              <span className="mt-0.5 text-xs text-neutral-500">{cat.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Remaining Categories Clean Index Row */}
        <div className="mt-8 grid grid-cols-1 gap-3 border-t border-neutral-200 pt-6 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_HIGHLIGHTS.slice(6).map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => onNavigate('shop', cat.name)}
              className="flex items-center justify-between border border-neutral-200 bg-[#FAF9F6] px-4 py-3 text-left transition-colors hover:border-[#171717] hover:bg-white"
            >
              <div>
                <span className="block font-display text-sm font-semibold text-[#171717]">
                  {cat.name}
                </span>
                <span className="text-[11px] text-neutral-500">{cat.subtitle}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
            </button>
          ))}
        </div>
      </section>

      {/* 7. Best Picks / Featured Styles */}
      <section className="border-t border-neutral-200 bg-[#FAF9F6] py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
                Curated Edit
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
                Best Picks &amp; Featured Styles
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('shop', 'All')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:underline"
            >
              <span>Shop All Styles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {featuredStyles.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Full-Width Fashion Campaign Imagery */}
      <section className="relative h-[420px] w-full overflow-hidden bg-[#171717] sm:h-[520px]">
        <img
          src={EDITORIAL_ASSETS.campaignWide}
          alt="Nowa's Place campaign models walking in relaxed denim, layered shirts, and minimalist white sneakers"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10">
          <p className="text-xs font-medium tracking-[0.22em] text-[#D8F36A] uppercase">
            Season Demonstration Lookbook
          </p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Clean Cuts. Easy Layering. Built for Everyday Movement.
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('shop', 'All')}
            className="mt-6 inline-flex min-h-11 items-center gap-2 bg-white px-6 py-2.5 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:bg-[#D8F36A]"
          >
            <span>Explore Full Catalogue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* 9. HOW TO SHOP — Three-Step Explanation */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
            Seamless Ordering
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
            How to Shop Nowa&apos;s Place
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 border-t border-neutral-200 pt-8 md:grid-cols-3">
          <div>
            <span className="inline-block bg-[#D8F36A] px-2 py-0.5 font-mono text-xs font-bold text-[#171717]">
              01.
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#171717]">
              Browse or Get Styled
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Filter across baggy denim, oversized tees, cargos, two-piece sets, and footwear—or
              let the Nowa&apos;s Place Style Finder build your look.
            </p>
          </div>

          <div>
            <span className="inline-block bg-[#D8F36A] px-2 py-0.5 font-mono text-xs font-bold text-[#171717]">
              02.
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#171717]">
              Review Your Bag &amp; Delivery Info
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Your bag stays saved as you browse. Enter your name, WhatsApp contact, location,
              and preferred delivery or pickup date—no account required.
            </p>
          </div>

          <div>
            <span className="inline-block bg-[#D8F36A] px-2 py-0.5 font-mono text-xs font-bold text-[#171717]">
              03.
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#171717]">
              Send Order via WhatsApp
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Generate a clean itemized order message in one click. Our team confirms stock
              availability, delivery fee, and payment details directly with you.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Phase 7: Google Maps & Boutique Location in Udu, Delta State */}
      <BoutiqueLocationSection />

      {/* 11. WhatsApp Shopping Call-to-Action */}
      <section className="border-t border-neutral-200 bg-[#FAF9F6] py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-10">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              Ready to build your rotation?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Add pieces to your bag and check out directly via WhatsApp with zero checkout friction.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('shop', 'All')}
              className="inline-flex min-h-12 items-center gap-2 bg-[#171717] px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Start Shopping</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex min-h-12 items-center gap-2 border border-neutral-300 bg-white px-6 py-3 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:border-[#171717]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Store &amp; Contact Info</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
