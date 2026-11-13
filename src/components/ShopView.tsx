import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, Category, Product, SortOption } from '../types/store';
import { PRODUCTS } from '../data/catalogue';
import { filterAndSortProducts } from '../utils/catalogueFilter';
import { STORE_CONFIG } from '../config/storeConfig';
import { ProductCard } from './ProductCard';

interface ShopViewProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  onlyNewArrivals?: boolean;
  wishlistIds: readonly string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, colour: string) => void;
}

export function ShopView({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onlyNewArrivals = false,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}: ShopViewProps) {
  const filteredProducts = filterAndSortProducts(PRODUCTS, {
    category: selectedCategory,
    query: searchQuery,
    sort: sortBy,
    onlyNewArrivals,
  });

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery.trim() !== '';

  const resetFilters = () => {
    onSelectCategory('All');
    onSearchChange('');
    onSortChange('newest');
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      {/* Page Title & Demo Notice */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#3E5100] uppercase">
            {onlyNewArrivals ? 'Latest Drop' : 'Complete Catalogue'}
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
            {onlyNewArrivals ? 'New Arrivals' : 'Shop All Pieces'}
          </h1>
        </div>

        <p className="text-xs text-neutral-500">
          {STORE_CONFIG.demoCatalogueNotice}
        </p>
      </div>

      {/* Discovery Bar: Search + Sort */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            strokeWidth={1.75}
          />
          <label htmlFor="catalogue-search" className="sr-only">
            Search catalogue
          </label>
          <input
            id="catalogue-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search baggy jeans, tees, colour, or fabric..."
            className="h-11 w-full border border-neutral-300 bg-white pl-10 pr-9 text-sm text-[#171717] placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-[#171717]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-neutral-400 hover:text-[#171717]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <label htmlFor="catalogue-sort" className="font-medium text-[#171717]">
              Sort:
            </label>
          </div>
          <select
            id="catalogue-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-11 border border-neutral-300 bg-white px-3.5 text-sm font-medium text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter products by category"
        className="no-scrollbar mt-5 flex items-center gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'All'}
          onClick={() => onSelectCategory('All')}
          className={`min-h-9 shrink-0 border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'All'
              ? 'border-[#171717] bg-[#171717] text-white'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-[#171717] hover:text-[#171717]'
          }`}
        >
          All
        </button>

        {CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectCategory(category)}
              className={`min-h-9 shrink-0 border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'border-[#171717] bg-[#171717] text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-[#171717] hover:text-[#171717]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Active Result Summary */}
      <div className="mt-5 flex items-center justify-between text-xs text-neutral-500">
        <span data-testid="shop-results-count" className="tabular-nums">
          Showing {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'item' : 'items'}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="font-semibold text-[#171717] underline underline-offset-4 hover:text-[#3E5100]"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="mt-12 border border-neutral-200 bg-[#FAF9F6] px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-[#171717]">
            No pieces match your current filter
          </p>
          <p className="mt-1.5 text-sm text-neutral-500">
            Try clearing your search term or switching back to all categories.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 min-h-11 bg-[#171717] px-6 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
          >
            View All Pieces
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {filteredProducts.map((product) => (
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
      )}
    </section>
  );
}
