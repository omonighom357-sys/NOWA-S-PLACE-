import { useCallback, useEffect, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useApiLoadingStatus,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Check, Clock, Copy, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

declare const __GMP_ENV_KEY__: string;

function getMapsApiKey(): string {
  const viteKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const fallbackKey = typeof __GMP_ENV_KEY__ !== 'undefined' ? __GMP_ENV_KEY__ : '';
  const globalKey = (globalThis as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY;
  return viteKey || fallbackKey || globalKey || '';
}

interface ResolvedPlace {
  lat: number;
  lng: number;
  placeId?: string;
  formattedAddress?: string;
  displayName?: string;
}

function isQuotaError(err: unknown): boolean {
  const msg = String(err instanceof Error ? err.message : err);
  return /RESOURCE_EXHAUSTED|OVER_QUERY_LIMIT|QuotaExceeded|429/i.test(msg);
}

interface BoutiqueMapCanvasProps {
  apiKey: string;
  onPlaceResolved: (place: ResolvedPlace | null) => void;
}

function BoutiqueMapCanvas({ apiKey, onPlaceResolved }: BoutiqueMapCanvasProps) {
  const loadingStatus = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');

  const [resolvedPlace, setResolvedPlace] = useState<ResolvedPlace | null>(null);
  const [lookupDone, setLookupDone] = useState(false);
  const [infoOpen, setInfoOpen] = useState(true);

  useEffect(() => {
    if (loadingStatus === APILoadingStatus.AUTH_FAILURE || loadingStatus === APILoadingStatus.FAILED) {
      setLookupDone(true);
      onPlaceResolved(null);
    }
  }, [loadingStatus, onPlaceResolved]);

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function resolveBoutiqueLocation() {
      const queries = [
        STORE_CONFIG.mapsSearchQuery,
        'Ekete Road, Udu, Delta State, Nigeria',
      ];

      for (const query of queries) {
        try {
          const { places } = await placesLib!.Place.searchByText({
            textQuery: query,
            fields: ['displayName', 'formattedAddress', 'location', 'id'],
            maxResultCount: 1,
            region: 'NG',
          });

          const match = places?.[0];
          if (match?.location && !cancelled) {
            const loc = match.location;
            const resolved: ResolvedPlace = {
              lat: typeof loc.lat === 'function' ? loc.lat() : Number(loc.lat),
              lng: typeof loc.lng === 'function' ? loc.lng() : Number(loc.lng),
              placeId: match.id,
              formattedAddress: match.formattedAddress ?? STORE_CONFIG.storeAddress,
              displayName: match.displayName ?? "Nowa's Place — Udu Boutique",
            };
            setResolvedPlace(resolved);
            setLookupDone(true);
            onPlaceResolved(resolved);
            return;
          }
        } catch (err) {
          if (isQuotaError(err)) {
            window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
            break;
          }
        }
      }

      if (!cancelled) {
        setLookupDone(true);
        onPlaceResolved(null);
      }
    }

    void resolveBoutiqueLocation();
    return () => {
      cancelled = true;
    };
  }, [placesLib, onPlaceResolved]);

  const handleCloseInfo = useCallback(() => setInfoOpen(false), []);

  if (
    loadingStatus === APILoadingStatus.AUTH_FAILURE ||
    loadingStatus === APILoadingStatus.FAILED
  ) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#F4F4F4] p-6 text-center">
        <MapPin className="h-7 w-7 text-[#171717]" />
        <p className="mt-3 font-display text-base font-semibold text-[#171717]">
          Nowa&apos;s Place Boutique — Udu, Delta State
        </p>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-neutral-600">
          {STORE_CONFIG.storeAddress}
        </p>
      </div>
    );
  }

  if (!lookupDone) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#F4F4F4] p-6 text-center">
        <MapPin className="h-6 w-6 text-neutral-500" />
        <p className="mt-3 text-xs font-medium tracking-wider text-neutral-600 uppercase">
          Loading Udu boutique map...
        </p>
      </div>
    );
  }

  // If Places API New resolved verified coordinates from Google Maps Platform, render interactive JS Map + AdvancedMarker
  if (resolvedPlace) {
    return (
      <GoogleMap
        defaultCenter={{ lat: resolvedPlace.lat, lng: resolvedPlace.lng }}
        defaultZoom={16}
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker
          position={{ lat: resolvedPlace.lat, lng: resolvedPlace.lng }}
          title="Nowa's Place — Opposite Mountain of Fire Ministries, Along Ekete Road, Udu"
          onClick={() => setInfoOpen(true)}
        >
          <Pin background="#D8F36A" borderColor="#171717" glyphColor="#171717" />
        </AdvancedMarker>

        {infoOpen && (
          <InfoWindow
            position={{ lat: resolvedPlace.lat, lng: resolvedPlace.lng }}
            onCloseClick={handleCloseInfo}
          >
            <div className="max-w-[220px] p-1 text-left text-[#171717]">
              <p className="font-display text-xs font-bold tracking-wider uppercase">
                NOWA&apos;S PLACE
              </p>
              <p className="mt-1 text-[11px] leading-snug text-neutral-600">
                {STORE_CONFIG.storeAddress}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  }

  // Fallback to Google Maps Embed API (place mode) so Google resolves Ekete Road, Udu directly without hardcoded lat/lng
  const embedSrc = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
    apiKey
  )}&q=${encodeURIComponent(
    STORE_CONFIG.mapsSearchQuery
  )}&zoom=16&solution_id=gmp_mcp_codeassist_v1_aistudio`;

  return (
    <iframe
      title="Nowa's Place Boutique Location — Ekete Road, Udu, Delta State"
      src={embedSrc}
      className="h-full w-full border-0"
      referrerPolicy="strict-origin-when-cross-origin"
      loading="lazy"
      allowFullScreen
    />
  );
}

export function BoutiqueLocationSection() {
  const apiKey = getMapsApiKey();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [resolvedPlace, setResolvedPlace] = useState<ResolvedPlace | null>(null);
  const [quotaReached, setQuotaReached] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaReached(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(STORE_CONFIG.storeAddress);
      setCopiedAddress(true);
      window.setTimeout(() => setCopiedAddress(false), 2200);
    } catch {
      // Clipboard API unavailable in restricted context
    }
  };

  const directionsHref = resolvedPlace?.placeId
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        STORE_CONFIG.storeAddress
      )}&destination_place_id=${encodeURIComponent(resolvedPlace.placeId)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        STORE_CONFIG.storeAddress
      )}`;

  return (
    <section
      id="boutique-location"
      aria-labelledby="boutique-location-heading"
      className="border-t border-neutral-200 bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Editorial Store Location Card */}
          <div className="flex flex-col justify-between border border-neutral-200 bg-[#FAF9F6] p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] text-[#3E5100] uppercase">
                Visit the Flagship
              </p>
              <h2
                id="boutique-location-heading"
                className="mt-2 font-display text-3xl font-bold leading-[1.08] tracking-tight text-[#171717] text-balance sm:text-4xl"
              >
                FIND YOUR WAY TO NOWA&apos;S PLACE
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                Your next favourite fit is waiting. Visit us in Udu, Delta State.
              </p>

              <div className="mt-7 space-y-4 border-t border-neutral-200 pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#D8F36A] text-[#171717]">
                    <MapPin className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#171717] uppercase">
                      Boutique Address
                    </p>
                    <p
                      data-testid="boutique-address-text"
                      className="mt-1 text-sm font-medium leading-relaxed text-[#171717]"
                    >
                      {STORE_CONFIG.storeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-200 bg-white text-[#171717]">
                    <Clock className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#171717] uppercase">
                      Store Hours
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                      {STORE_CONFIG.openingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-[#171717] px-5 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#D8F36A] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <Navigation className="h-4 w-4" />
                <span>GET DIRECTIONS</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#171717] bg-white px-5 py-3 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:bg-[#F4F4F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                {copiedAddress ? (
                  <>
                    <Check className="h-4 w-4 text-[#3E5100]" />
                    <span>ADDRESS COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>COPY ADDRESS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Google Map Container */}
          <div className="lg:col-span-7">
            <div
              data-testid="boutique-map-container"
              className="h-[340px] w-full overflow-hidden border border-neutral-200 bg-[#F4F4F4] sm:h-[400px] lg:h-[460px]"
            >
              {apiKey && !quotaReached ? (
                <APIProvider apiKey={apiKey} language="en" region="NG">
                  <BoutiqueMapCanvas
                    apiKey={apiKey}
                    onPlaceResolved={setResolvedPlace}
                  />
                </APIProvider>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#FAF9F6] p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#D8F36A] text-[#171717]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[#171717]">
                    Nowa&apos;s Place — Ekete Road, Udu
                  </h3>
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-neutral-600">
                    {STORE_CONFIG.storeAddress}
                  </p>
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-10 items-center gap-2 border border-[#171717] bg-white px-4 py-2 text-xs font-semibold tracking-wider text-[#171717] uppercase transition-colors hover:bg-[#171717] hover:text-white"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
