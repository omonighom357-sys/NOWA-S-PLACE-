import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, CheckoutErrors, CheckoutFormData } from '../types/store';
import { formatNaira } from '../utils/currency';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  isWhatsAppConfigured,
  validateCheckoutForm,
} from '../utils/whatsappOrder';
import { STORE_CONFIG } from '../config/storeConfig';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotalNgn: number;
}

const NIGERIAN_STATES = [
  'Lagos',
  'FCT Abuja',
  'Rivers',
  'Oyo',
  'Ogun',
  'Enugu',
  'Anambra',
  'Delta',
  'Edo',
  'Kano',
  'Kaduna',
  'Abia',
  'Akwa Ibom',
  'Cross River',
  'Kwara',
  'Ondo',
  'Osun',
  'Ekiti',
  'Imo',
  'Other State',
];

function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CheckoutModal({ isOpen, onClose, items, subtotalNgn }: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'summary'>('form');
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    state: 'Lagos',
    city: '',
    fulfillmentOption: 'Delivery',
    address: '',
    preferredDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep('form');
    setErrors({});
    setCopied(false);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const generatedMessage = useMemo(
    () => buildWhatsAppOrderMessage(items, subtotalNgn, formData),
    [items, subtotalNgn, formData]
  );

  const whatsappConfigured = isWhatsAppConfigured(STORE_CONFIG.whatsappNumber);
  const whatsappUrl = buildWhatsAppUrl(STORE_CONFIG.whatsappNumber, generatedMessage);

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setStep('summary');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy unavailable in restricted browser context
    }
  };

  const updateField = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof CheckoutErrors];
        return next;
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="WhatsApp Order Checkout"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center gap-3">
                {step === 'summary' && (
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    aria-label="Back to delivery details"
                    className="flex h-9 w-9 items-center justify-center text-[#171717] hover:bg-[#F4F4F4]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-[#171717]">
                    {step === 'form' ? 'WhatsApp Checkout' : 'Review & Send Order'}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    No account or card details required · Direct store confirmation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close checkout"
                className="flex h-10 w-10 items-center justify-center text-[#171717] hover:bg-[#F4F4F4]"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {step === 'form' ? (
                <form onSubmit={handleSubmitForm} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-name" className="block text-xs font-medium text-[#171717]">
                        Full Name <span className="text-[#3E5100]">*</span>
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="e.g. Chinedu Okafor"
                        className={`mt-1.5 w-full border px-3.5 py-2.5 text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717] ${
                          errors.fullName ? 'border-red-600 bg-red-50/40' : 'border-neutral-300 bg-white'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-700" role="alert">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="checkout-phone" className="block text-xs font-medium text-[#171717]">
                        WhatsApp Phone Number <span className="text-[#3E5100]">*</span>
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="e.g. 0803 000 0000"
                        className={`mt-1.5 w-full border px-3.5 py-2.5 text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717] ${
                          errors.phone ? 'border-red-600 bg-red-50/40' : 'border-neutral-300 bg-white'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-700" role="alert">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-state" className="block text-xs font-medium text-[#171717]">
                        State <span className="text-[#3E5100]">*</span>
                      </label>
                      <select
                        id="checkout-state"
                        value={formData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        className={`mt-1.5 w-full border px-3.5 py-2.5 text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717] ${
                          errors.state ? 'border-red-600 bg-red-50/40' : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-700" role="alert">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.state}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="checkout-city" className="block text-xs font-medium text-[#171717]">
                        City or Town <span className="text-[#3E5100]">*</span>
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="e.g. Lekki, Yaba, Wuse II"
                        className={`mt-1.5 w-full border px-3.5 py-2.5 text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717] ${
                          errors.city ? 'border-red-600 bg-red-50/40' : 'border-neutral-300 bg-white'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-700" role="alert">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.city}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fulfillment Toggle */}
                  <div>
                    <span className="block text-xs font-medium text-[#171717]">
                      Fulfillment Option
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {(['Delivery', 'Store Pickup'] as const).map((option) => {
                        const active = formData.fulfillmentOption === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField('fulfillmentOption', option)}
                            aria-pressed={active}
                            className={`min-h-11 border px-4 py-2.5 text-sm font-medium transition-colors ${
                              active
                                ? 'border-[#171717] bg-[#171717] text-white'
                                : 'border-neutral-300 bg-white text-[#171717] hover:border-[#171717]'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {formData.fulfillmentOption === 'Delivery' && (
                    <div>
                      <label htmlFor="checkout-address" className="block text-xs font-medium text-[#171717]">
                        Delivery Address <span className="text-[#3E5100]">*</span>
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="House number, street name, nearest landmark"
                        className={`mt-1.5 w-full border px-3.5 py-2.5 text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717] ${
                          errors.address ? 'border-red-600 bg-red-50/40' : 'border-neutral-300 bg-white'
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-700" role="alert">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.address}</span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-date" className="block text-xs font-medium text-[#171717]">
                        Preferred {formData.fulfillmentOption === 'Delivery' ? 'Delivery' : 'Pickup'} Date{' '}
                        <span className="text-[#3E5100]">*</span>
                      </label>
                      <input
                        id="checkout-date"
                        type="date"
                        min={getTodayDateString()}
                        value={formData.preferredDate}
                        onChange={(e) => updateField('preferredDate', e.target.value)}
                        className={`mt-1.5 w-full border px-3.5 py-2.5 text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717] ${
                          errors.preferredDate ? 'border-red-600 bg-red-50/40' : 'border-neutral-300 bg-white'
                        }`}
                      />
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Preferred date only — confirmed by the store on WhatsApp.
                      </p>
                      {errors.preferredDate && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-700" role="alert">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.preferredDate}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="checkout-notes" className="block text-xs font-medium text-[#171717]">
                        Additional Order Instructions
                      </label>
                      <textarea
                        id="checkout-notes"
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        placeholder="Preferred dispatch time, alternative contact, etc."
                        className="mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-2 text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-[#171717]"
                      />
                    </div>
                  </div>

                  {/* Mini Subtotal Bar */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Items Subtotal</span>
                      <span className="block text-xs text-neutral-500">
                        Delivery fee: To be confirmed by store
                      </span>
                    </div>
                    <span className="font-mono text-lg font-semibold text-[#171717] tabular-nums">
                      {formatNaira(subtotalNgn)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="flex min-h-12 w-full items-center justify-center bg-[#171717] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                  >
                    Generate Order Summary
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Itemized Summary */}
                  <div className="border border-neutral-200 bg-[#FAF9F6] p-5">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#171717]">
                      Order Summary
                    </h3>
                    <ul className="mt-3 divide-y divide-neutral-200 text-sm">
                      {items.map((item) => (
                        <li key={item.key} className="flex items-center justify-between gap-4 py-2.5">
                          <div>
                            <p className="font-medium text-[#171717]">{item.name}</p>
                            <p className="text-xs text-neutral-500">
                              Size: {item.size} · Colour: {item.colour} · Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono text-sm font-medium text-[#171717] tabular-nums">
                            {formatNaira(item.priceNgn * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 space-y-1.5 border-t border-neutral-200 pt-3 text-sm">
                      <div className="flex justify-between text-neutral-600">
                        <span>Delivery Fee</span>
                        <span>To be confirmed by store</span>
                      </div>
                      <div className="flex justify-between font-semibold text-[#171717]">
                        <span>Order Total</span>
                        <span className="font-mono text-base tabular-nums">
                          {formatNaira(subtotalNgn)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Summary */}
                  <div className="grid grid-cols-1 gap-3 border border-neutral-200 p-5 text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-neutral-500">Customer</span>
                      <p className="mt-0.5 font-medium text-[#171717]">{formData.fullName}</p>
                      <p className="text-neutral-600">{formData.phone}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Fulfillment ({formData.fulfillmentOption})</span>
                      <p className="mt-0.5 font-medium text-[#171717]">
                        {formData.city}, {formData.state}
                      </p>
                      {formData.fulfillmentOption === 'Delivery' && (
                        <p className="text-neutral-600">{formData.address}</p>
                      )}
                      <p className="mt-1 text-neutral-500">
                        Preferred Date: <span className="text-[#171717]">{formData.preferredDate}</span>
                      </p>
                    </div>
                  </div>

                  {/* Formatted WhatsApp Message Preview */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#171717]">
                        WhatsApp Message Preview
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#171717] underline-offset-4 hover:underline"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-700" />
                            <span>Copied message</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy message</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre
                      data-testid="whatsapp-message-preview"
                      className="mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap border border-neutral-200 bg-[#F4F4F4] p-3.5 font-mono text-xs leading-relaxed text-[#171717]"
                    >
                      {generatedMessage}
                    </pre>
                  </div>

                  {!whatsappConfigured && (
                    <div className="border border-neutral-300 bg-[#FAF9F6] p-3.5">
                      <p className="text-xs leading-relaxed text-neutral-700">
                        <strong className="font-semibold text-[#171717]">Demo Preview Mode:</strong>{' '}
                        The official Nowa&apos;s Place WhatsApp number is not configured yet, so an external
                        WhatsApp link is disabled. Copy the generated order message or configure the
                        store number to activate live dispatch.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {step === 'summary' && (
              <div className="border-t border-neutral-200 bg-white px-6 py-4 sm:px-8">
                {!whatsappConfigured ? (
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                  >
                    <Copy className="h-4 w-4" />
                    <span>
                      {copied
                        ? 'Order Message Copied'
                        : 'PLACE ORDER VIA WHATSAPP (Copy Demo Message)'}
                    </span>
                  </button>
                ) : (
                  <a
                    href={whatsappUrl ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#171717] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>PLACE ORDER VIA WHATSAPP</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                )}

                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Availability, delivery fees, and payment instructions are confirmed directly by
                  Nowa&apos;s Place on WhatsApp.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
