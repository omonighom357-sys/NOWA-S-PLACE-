import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCartItem,
  updateCartQuantity,
  removeCartItem,
  calculateCartSubtotal,
  calculateCartItemCount,
} from './cartLogic';
import { Product } from '../types/store';

const JEANS: Product = {
  id: 'nwp-01',
  name: 'Vintage Blue Baggy Jeans',
  category: 'Baggy Jeans',
  priceNgn: 28000,
  image: 'jeans.jpg',
  sizes: ['32', '34'],
  colours: [{ name: 'Blue', hex: '#4B6F93' }],
  description: 'Denim',
  fabricNote: '100% cotton',
  fitNote: 'Baggy',
  isNewArrival: true,
  isFeatured: true,
  createdAtOrder: 1,
  occasions: ['Casual Hangout'],
  styles: ['Streetwear'],
  colourGroup: 'Dark',
  slot: 'bottom',
};

test('adds items, merges matching variants, updates quantities, and computes totals', () => {
  let cart = addCartItem([], JEANS, '34', 'Blue', 1);
  assert.equal(cart.length, 1);
  assert.equal(calculateCartItemCount(cart), 1);
  assert.equal(calculateCartSubtotal(cart), 28000);

  // Adding same size & colour merges quantity
  cart = addCartItem(cart, JEANS, '34', 'Blue', 1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);
  assert.equal(calculateCartSubtotal(cart), 56000);

  // Adding different size creates separate line item
  cart = addCartItem(cart, JEANS, '32', 'Blue', 1);
  assert.equal(cart.length, 2);
  assert.equal(calculateCartItemCount(cart), 3);

  // Updating quantity to 0 removes line item
  cart = updateCartQuantity(cart, cart[1].key, 0);
  assert.equal(cart.length, 1);

  // Explicit removal
  cart = removeCartItem(cart, cart[0].key);
  assert.equal(cart.length, 0);
});
