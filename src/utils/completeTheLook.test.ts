import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGUE_SEED_PRODUCTS as PRODUCTS } from '../data/catalogueData.ts';
import {
  getAlternativeForLookSlot,
  getCompleteTheLookRecommendations,
} from './completeTheLook.ts';

test('getCompleteTheLookRecommendations pairs baggy jeans with top, footwear, and accessory', () => {
  const jeans = PRODUCTS.find((p) => p.id === 'nwp-01')!;
  const recs = getCompleteTheLookRecommendations(PRODUCTS, jeans);

  assert.equal(recs.length, 3);
  assert.deepEqual(
    recs.map((r) => r.slot),
    ['top', 'footwear', 'accessory']
  );
  assert.ok(recs.every((r) => r.id !== jeans.id));
});

test('getAlternativeForLookSlot excludes anchor product and current item', () => {
  const jeans = PRODUCTS.find((p) => p.id === 'nwp-01')!;
  const recs = getCompleteTheLookRecommendations(PRODUCTS, jeans);
  const firstTop = recs[0];

  const alternatives = getAlternativeForLookSlot(PRODUCTS, jeans, 'top', firstTop.id);
  assert.ok(alternatives.length > 0);
  assert.ok(alternatives.every((p) => p.slot === 'top' && p.id !== firstTop.id && p.id !== jeans.id));
});
