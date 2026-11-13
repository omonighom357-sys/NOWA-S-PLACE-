import { useState } from 'react';
import { Check, Eye, Heart, Plus } from 'lucide-react';
import { Product } from '../types/store';
import { formatNaira } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, colour: string) => void;
}

export function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? 'One Size');
  const [selectedColour, setSelectedColour] = useState(product.colours[0]?.name ?? 'Default');
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleQuickAdd = () => {
    onQuickAdd(product, selectedSize, selectedColour);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="group flex flex-col bg-white transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Studio Image Surface */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F4F4]">
        <button
          type="button"
          onClick={() => onQuickView(product)}
          aria-label={`View details for ${product.name}`}
          className="block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
        >
          {!imgError ? (
            <img
              src={product.image}
              alt={`${product.name} — ${product.category}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#F4F4F4] p-6 text-center">
              <span className="font-display text-sm font-semibold tracking-wide text-[#171717]">
                {product.name}
              </span>
              <span className="mt-1 text-xs text-neutral-500">{product.category}</span>
            </div>
          )}
        </button>

        {/* Wishlist Toggle */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
            className="absolute left-2.5 top-2.5 flex h-9 w-9 items-center justify-center bg-white/95 text-[#171717] shadow-sm transition-colors hover:bg-[#D8F36A] focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? 'fill-[#171717]' : ''}`}
              strokeWidth={1.75}
            />
          </button>
        )}

        {/* Quick View button */}
        <button
          type="button"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.name}`}
          className="absolute right-2.5 top-2.5 flex min-h-9 items-center gap-1.5 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-[#171717] opacity-90 shadow-sm transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#171717]"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Quick View</span>
        </button>
      </div>

      {/* Product Metadata & Controls */}
      <div className="flex flex-1 flex-col pt-3.5">
        <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
          <span className="truncate">{product.category}</span>
          {product.isNewArrival && (
            <span className="shrink-0 font-semibold text-[#3E5100]">New Arrival</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="mt-1 text-left font-display text-base font-semibold leading-snug text-[#171717] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-[#171717]"
        >
          {product.name}
        </button>

        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span className="font-mono text-[15px] font-medium text-[#171717] tabular-nums">
            {formatNaira(product.priceNgn)}
          </span>

          {/* Interactive Colour Swatches */}
          <div className="flex items-center gap-1.5" role="group" aria-label={`Colours for ${product.name}`}>
            {product.colours.map((c) => {
              const isSelected = selectedColour === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColour(c.name)}
                  aria-label={`Select colour ${c.name} for ${product.name}`}
                  aria-pressed={isSelected}
                  title={c.name}
                  className={`h-4 w-4 rounded-full border transition-transform ${
                    isSelected
                      ? 'scale-110 border-[#171717] ring-1 ring-[#171717] ring-offset-1'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* Compact Size Strip + Direct Add to Cart */}
        <div className="mt-3 flex flex-col gap-2 border-t border-neutral-100 pt-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor={`size-${product.id}`}>
            Size for {product.name}
          </label>
          <select
            id={`size-${product.id}`}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            aria-label={`Select size for ${product.name}`}
            className="h-9 w-full border border-neutral-200 bg-[#FAF9F6] px-2 text-xs font-medium text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717] sm:w-auto sm:min-w-[74px]"
          >
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s === 'One Size' ? 'One Size' : `Size ${s}`}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex min-h-9 w-full flex-1 items-center justify-center gap-1.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
              justAdded
                ? 'bg-[#D8F36A] text-[#171717]'
                : 'bg-[#171717] text-white hover:bg-[#D8F36A] hover:text-[#171717]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
