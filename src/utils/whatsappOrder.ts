import { CartItem, CheckoutErrors, CheckoutFormData } from '../types/store';
import { formatNaira } from './currency';

export function isWhatsAppConfigured(whatsappNumber: string): boolean {
  const digits = whatsappNumber.replace(/\D/g, '');
  return digits.length >= 10;
}

export function validateCheckoutForm(data: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const phoneDigits = data.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = 'Enter a valid WhatsApp phone number (10–15 digits).';
  }

  if (!data.state.trim()) {
    errors.state = 'Please select or enter your state.';
  }

  if (!data.city.trim()) {
    errors.city = 'Please enter your city or town.';
  }

  if (data.fulfillmentOption === 'Delivery' && (!data.address.trim() || data.address.trim().length < 6)) {
    errors.address = 'Please enter your street delivery address.';
  }

  if (!data.preferredDate.trim()) {
    errors.preferredDate = 'Please select a preferred delivery or pickup date.';
  }

  return errors;
}

export function buildWhatsAppOrderMessage(
  items: readonly CartItem[],
  totalNgn: number,
  customer: CheckoutFormData
): string {
  const orderLines = items
    .map((item, index) => {
      const subtotal = item.priceNgn * item.quantity;
      return [
        `${index + 1}. ${item.name}`,
        `   Size: ${item.size}`,
        `   Colour: ${item.colour}`,
        `   Quantity: ${item.quantity}`,
        `   Subtotal: ${formatNaira(subtotal)}`,
      ].join('\n');
    })
    .join('\n');

  const addressValue =
    customer.fulfillmentOption === 'Store Pickup'
      ? 'Store Pickup (no street delivery address needed)'
      : customer.address.trim();

  const notesValue = customer.notes.trim() || 'None';

  return [
    "Hello Nowa's Place! I'd like to place an order.",
    '',
    'ORDER DETAILS:',
    '',
    orderLines,
    '',
    `TOTAL: ${formatNaira(totalNgn)}`,
    '',
    'CUSTOMER DETAILS:',
    `Name: ${customer.fullName.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Location: ${customer.state.trim()}, ${customer.city.trim()}`,
    `Delivery/Pickup: ${customer.fulfillmentOption}`,
    `Address: ${addressValue}`,
    `Preferred Date: ${customer.preferredDate.trim()}`,
    `Additional Notes: ${notesValue}`,
    '',
    'Please confirm availability, delivery fees, and payment instructions. Thank you!',
  ].join('\n');
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string | null {
  const digits = whatsappNumber.replace(/\D/g, '');
  if (digits.length < 10) {
    return null;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
