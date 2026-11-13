import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortProducts } from './catalogueFilter';
import { Product } from '../types/store';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vintage Blue Baggy Jeans',
    category: 'Baggy Jeans',
    priceNgn: 28000,
    image: 'a.jpg',
    sizes: ['32', '34'],
    colours: [{ name: 'Blue', hex: '#00f' }],
    description: 'Relaxed wide denim',
    fabricNote: 'Cotton denim',
    fitNote: 'Loose',
    isNewArrival: true,
    isFeatured: true,
    createdAtOrder: 10,
    occasions: ['Casual Hangout'],
    styles: ['Streetwear'],
    colourGroup: 'Dark',
    slot: 'bottom',
  },
  {
    id: '2',
    name: 'Premium Plain Oversized Tee',
    category: 'Oversized T-Shirts',
    priceNgn: 10000,
    image: 'b.jpg',
    sizes: ['L', 'XL'],
    colours: [{ name: 'White', hex: '#fff' }],
    description: 'Heavy jersey tee',
    fabricNote: '300gsm cotton',
    fitNote: 'Boxy',
    isNewArrival: false,
    isFeatured: false,
    createdAtOrder: 5,
    occasions: ['Casual Hangout'],
    styles: ['Minimalist'],
    colourGroup: 'Neutral',
    slot: 'top',
  },
  {
    id: '3',
    name: 'Chunky Street Sneakers',
    category: 'Sneakers',
    priceNgn: 38000,
    image: 'c.jpg',
    sizes: ['42', '43'],
    colours: [{ name: 'Bone', hex: '#ddd' }],
    description: 'Sculpted sole',
    fabricNote: 'Suede mesh',
    fitNote: 'True to size',
    isNewArrival: true,
    isFeatured: true,
    createdAtOrder: 20,
    occasions: ['Date Night'],
    styles: ['Streetwear'],
    colourGroup: 'Neutral',
    slot: 'footwear',
  },
];

test('filters by category and search query', () => {
  const byCategory = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'Baggy Jeans',
    query: '',
    sort: 'newest',
  });
  assert.equal(byCategory.length, 1);
  assert.equal(byCategory[0].id, '1');

  const byQuery = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: 'oversized',
    sort: 'newest',
  });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, '2');
});

test('sorts by newest, price-asc, and price-desc', () => {
  const newest = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sort: 'newest',
  });
  assert.deepEqual(
    newest.map((p) => p.id),
    ['3', '1', '2']
  );

  const asc = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sort: 'price-asc',
  });
  assert.deepEqual(
    asc.map((p) => p.id),
    ['2', '1', '3']
  );

  const desc = filterAndSortProducts(MOCK_PRODUCTS, {
    category: 'All',
    query: '',
    sort: 'price-desc',
  });
  assert.deepEqual(
    desc.map((p) => p.id),
    ['3', '1', '2']
  );
});
