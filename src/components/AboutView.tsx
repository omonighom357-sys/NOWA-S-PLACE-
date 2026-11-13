import { ArrowRight, Clock, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import { PageView } from '../types/store';
import { STORE_CONFIG } from '../config/storeConfig';
import { EDITORIAL_ASSETS } from '../data/catalogue';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
            About Nowa&apos;s Place
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-[#171717] text-balance sm:text-4xl lg:text-5xl">
            A Contemporary Fashion Experience Built for Modern Streetwear.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-600">
            Nowa&apos;s Place brings together relaxed everyday essentials, statement wide-leg denim,
            coordinated sets, and clean footwear in a calm, thoughtfully curated retail space.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            This storefront is a working demonstration experience designed to preview online
            discovery and direct WhatsApp concierge ordering. All brand copy, pricing, and
            contact details below are configurable placeholders ready for final owner approval.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="inline-flex min-h-12 items-center gap-2 bg-[#171717] px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
            >
              <span>Browse Demo Catalogue</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('style-finder')}
              className="inline-flex min-h-12 items-center gap-2 border border-[#171717] bg-white px-6 py-3 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:bg-[#D8F36A]"
            >
              <span>Try Style Finder</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden bg-[#F4F4F4] lg:col-span-6">
          <img
            src={EDITORIAL_ASSETS.artOfDressing}
            alt="Nowa's Place contemporary menswear lookbook"
            referrerPolicy="no-referrer"
            className="h-full min-h-[340px] w-full object-cover object-center"
          />
        </div>
      </div>

      {/* Configurable Store & Contact Placeholders */}
      <div className="mt-16 border-t border-neutral-200 pt-12">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#171717]">
              Store &amp; Contact Details
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Configurable business placeholders — replace in store configuration prior to launch.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="border border-neutral-200 bg-[#FAF9F6] p-5">
            <MessageCircle className="h-4 w-4 text-[#3E5100]" />
            <h3 className="mt-3 font-display text-sm font-semibold text-[#171717]">WhatsApp</h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              {STORE_CONFIG.whatsappNumber
                ? `+${STORE_CONFIG.whatsappNumber}`
                : 'WhatsApp number — To be configured by store'}
            </p>
          </div>

          <div className="border border-neutral-200 bg-[#FAF9F6] p-5">
            <Instagram className="h-4 w-4 text-[#3E5100]" />
            <h3 className="mt-3 font-display text-sm font-semibold text-[#171717]">Instagram</h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              {STORE_CONFIG.instagramHandle}
            </p>
          </div>

          <div className="border border-neutral-200 bg-[#FAF9F6] p-5">
            <MapPin className="h-4 w-4 text-[#3E5100]" />
            <h3 className="mt-3 font-display text-sm font-semibold text-[#171717]">
              Store Address
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              {STORE_CONFIG.storeAddress}
            </p>
          </div>

          <div className="border border-neutral-200 bg-[#FAF9F6] p-5">
            <Clock className="h-4 w-4 text-[#3E5100]" />
            <h3 className="mt-3 font-display text-sm font-semibold text-[#171717]">
              Opening Hours
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              {STORE_CONFIG.openingHours}
            </p>
          </div>

          <div className="border border-neutral-200 bg-[#FAF9F6] p-5">
            <Mail className="h-4 w-4 text-[#3E5100]" />
            <h3 className="mt-3 font-display text-sm font-semibold text-[#171717]">
              Customer Service
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              {STORE_CONFIG.customerServiceEmail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
