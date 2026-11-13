import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCheckoutForm,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  isWhatsAppConfigured,
} from './whatsappOrder';
import { CartItem, CheckoutFormData } from '../types/store';

const VALID_FORM: CheckoutFormData = {
  fullName: 'Tunde Adeyemi',
  phone: '08012345678',
  state: 'Lagos',
  city: 'Lekki',
  fulfillmentOption: 'Delivery',
  address: '14 Admiralty Way, Lekki Phase 1',
  preferredDate: '2026-11-20',
  notes: 'Call on arrival',
};

const SAMPLE_ITEMS: CartItem[] = [
  {
    key: 'nwp-01__34__Blue',
    productId: 'nwp-01',
    name: 'Vintage Blue Baggy Jeans',
    category: 'Baggy Jeans',
    priceNgn: 28000,
    image: 'jeans.jpg',
    size: '34',
    colour: 'Blue',
    quantity: 2,
  },
  {
    key: 'nwp-10__XL__Black',
    productId: 'nwp-10',
    name: 'Oversized Graphic T-Shirt',
    category: 'Oversized T-Shirts',
    priceNgn: 12500,
    image: 'tee.jpg',
    size: 'XL',
    colour: 'Black',
    quantity: 1,
  },
];

test('validates required checkout fields and delivery address conditional logic', () => {
  const emptyErrors = validateCheckoutForm({
    fullName: '',
    phone: '123',
    state: '',
    city: '',
    fulfillmentOption: 'Delivery',
    address: '',
    preferredDate: '',
    notes: '',
  });
  assert.ok(emptyErrors.fullName);
  assert.ok(emptyErrors.phone);
  assert.ok(emptyErrors.state);
  assert.ok(emptyErrors.city);
  assert.ok(emptyErrors.address);
  assert.ok(emptyErrors.preferredDate);

  // Store Pickup does not require a street address
  const pickupValid = validateCheckoutForm({
    ...VALID_FORM,
    fulfillmentOption: 'Store Pickup',
    address: '',
  });
  assert.equal(Object.keys(pickupValid).length, 0);
});

test('formats WhatsApp order message and URL encoding accurately', () => {
  const message = buildWhatsAppOrderMessage(SAMPLE_ITEMS, 68500, VALID_FORM);
  assert.match(message, /Hello Nowa's Place! I'd like to place an order\./);
  assert.match(message, /1\. Vintage Blue Baggy Jeans/);
  assert.match(message, /Subtotal: ₦56,000/);
  assert.match(message, /TOTAL: ₦68,500/);
  assert.match(message, /Name: Tunde Adeyemi/);
  assert.match(message, /Location: Lagos, Lekki/);

  assert.equal(isWhatsAppConfigured(''), false);
  assert.equal(buildWhatsAppUrl('', message), null);

  const liveUrl = buildWhatsAppUrl('+234 801 234 5678', message);
  assert.ok(liveUrl?.startsWith('https://wa.me/2348012345678?text='));
});
