import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGUE_SEED_PRODUCTS as PRODUCTS } from '../data/catalogueData.ts';
import { STORE_CONFIG } from '../config/storeConfig.ts';
import { queryAskNowasAssistant } from './askNowasEngine.ts';

test("Ask Nowa's Place responds with matching affordable products for date night under 50k", () => {
  const res = queryAskNowasAssistant(
    'Suggest a date night outfit under ₦50,000',
    PRODUCTS
  );

  assert.ok(res.recommendedProducts.length >= 1);
  assert.ok(res.recommendedProducts.every((p) => p.priceNgn <= 50000));
  assert.ok(res.quickActions.some((a) => a.type === 'open-style-finder'));
});

test("Ask Nowa's Place answers boutique address questions with the exact Udu Delta State address", () => {
  const res = queryAskNowasAssistant("Where is Nowa's Place located in Udu?", PRODUCTS);

  assert.ok(res.replyText.includes(STORE_CONFIG.storeAddress));
  assert.ok(res.quickActions.some((a) => a.type === 'view-location'));
});

test("Ask Nowa's Place supports category combination queries like baggy jeans + oversized tee", () => {
  const res = queryAskNowasAssistant('Show me baggy jeans and oversized tee', PRODUCTS);

  const cats = res.recommendedProducts.map((p) => p.category);
  assert.ok(cats.includes('Baggy Jeans'));
  assert.ok(cats.includes('Oversized T-Shirts'));
});
