import { ArrowRight } from 'lucide-react';
import { Category, PageView } from '../types/store';
import { CATEGORY_HIGHLIGHTS, PRODUCTS } from '../data/catalogue';

interface CollectionsViewProps {
  onNavigate: (page: PageView, category?: Category | 'All') => void;
}

const CAPSULES: {
  title: string;
  description: string;
  categories: Category[];
}[] = [
  {
    title: 'Wide Silhouettes & Denim',
    description:
      'Relaxed wide-leg jeans, pleated trousers, cargo utility pants, and below-knee jorts built for volume and structure.',
    categories: ['Baggy Jeans', 'Baggy Trousers', 'Cargo Pants', 'Baggy Knickers / Jorts'],
  },
  {
    title: 'Tops, Knits & Heavyweight Layers',
    description:
      '300gsm boxy tees, camp-collar vintage shirts, loopback fleece hoodies, and textured fisherman knits.',
    categories: ['Oversized T-Shirts', 'Vintage Shirts', 'Hoodies and Sweaters'],
  },
  {
    title: 'Two-Piece Sets, Footwear & Finishing',
    description:
      'Coordinated two-piece outfits paired with minimalist court sneakers, molded slides, and canvas utility accessories.',
    categories: ['Two-Piece Outfits', 'Sneakers', 'Slides', 'Caps and Accessories'],
  },
];

export function CollectionsView({ onNavigate }: CollectionsViewProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="max-w-2xl border-b border-neutral-200 pb-6">
        <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
          Curated Capsules
        </p>
        <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
          Collections
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Explore all 11 Nowa&apos;s Place streetwear departments organized into cohesive wardrobe capsules.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {CAPSULES.map((capsule, idx) => (
          <div key={capsule.title} className="space-y-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <span className="inline-block bg-[#D8F36A] px-2 py-0.5 font-mono text-xs font-bold text-[#171717]">0{idx + 1}.</span>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#171717]">
                  {capsule.title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-neutral-600">{capsule.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {capsule.categories.map((catName) => {
                const meta = CATEGORY_HIGHLIGHTS.find((c) => c.name === catName);
                const count = PRODUCTS.filter((p) => p.category === catName).length;
                if (!meta) return null;

                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => onNavigate('shop', catName)}
                    className="group flex flex-col border border-neutral-200 bg-white text-left transition-colors hover:border-[#171717]"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-[#F4F4F4]">
                      <img
                        src={meta.coverImage}
                        alt={meta.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-3 p-4">
                      <div>
                        <h3 className="font-display text-base font-semibold text-[#171717] group-hover:underline">
                          {meta.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {meta.subtitle} · {count} pieces
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#171717]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
