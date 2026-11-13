import { PageView } from '../types/store';
import { STORE_CONFIG } from '../config/storeConfig';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-lg font-bold tracking-[0.18em] text-[#171717]"
            >
              {STORE_CONFIG.brandName}
            </button>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-neutral-500">
              Contemporary menswear &amp; unisex streetwear storefront demonstration. Curated
              everyday silhouettes with direct WhatsApp order coordination.
            </p>
            <p className="mt-4 text-xs font-medium text-neutral-700">
              {STORE_CONFIG.demoCatalogueNotice}
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#171717] uppercase">
              Storefront
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#171717]"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="hover:text-[#171717]"
                >
                  Shop Catalogue
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('new-arrivals')}
                  className="hover:text-[#171717]"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#171717]"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('style-finder')}
                  className="hover:text-[#171717]"
                >
                  Style Finder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#171717]"
                >
                  About &amp; Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold tracking-wider text-[#171717] uppercase">
              Configurable Contact
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-neutral-600">
              <li>
                WhatsApp:{' '}
                {STORE_CONFIG.whatsappNumber
                  ? `+${STORE_CONFIG.whatsappNumber}`
                  : 'Pending store configuration'}
              </li>
              <li>Instagram: {STORE_CONFIG.instagramHandle}</li>
              <li>Location: {STORE_CONFIG.storeAddress}</li>
              <li>Hours: {STORE_CONFIG.openingHours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Nowa&apos;s Place. Storefront Concept Preview.</p>
          <p>WhatsApp Checkout · No online card collection in demo</p>
        </div>
      </div>
    </footer>
  );
}
