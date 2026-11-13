import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGUE_SEED_PRODUCTS as PRODUCTS } from '../data/catalogueData.ts';
import {
  generateStyledOutfit,
  getSwapCandidatesForSlot,
  resolveBudgetMaxNgn,
  swapOutfitPiece,
} from './styleFinder.ts';

test('resolveBudgetMaxNgn maps all preset and custom tiers cleanly', () => {
  assert.equal(resolveBudgetMaxNgn('under-30k'), 30000);
  assert.equal(resolveBudgetMaxNgn('30k-50k'), 50000);
  assert.equal(resolveBudgetMaxNgn('50k-100k'), 100000);
  assert.equal(resolveBudgetMaxNgn('above-100k'), null);
  assert.equal(resolveBudgetMaxNgn('custom', 42000), 42000);
});

test('generateStyledOutfit produces a coordinated multi-piece look within 50k budget and matches sizes', () => {
  const look = generateStyledOutfit(PRODUCTS, {
    occasion: 'Date Night',
    style: 'Smart Casual',
    budgetTier: '30k-50k',
    colourPreference: 'Earth Tones',
    topSize: 'L',
    trouserSize: '32',
    footwearSize: '42',
  });

  assert.ok(look.pieces.length >= 2);
  assert.equal(look.withinBudget, true);
  assert.ok(look.totalPriceNgn <= 50000);
  assert.equal(look.budgetMessage, null);

  for (const piece of look.pieces) {
    assert.ok(PRODUCTS.some((p) => p.id === piece.product.id));
    if (piece.slot === 'top' || piece.slot === 'set') {
      assert.equal(piece.selectedSize, 'L');
    }
    if (piece.slot === 'bottom') {
      assert.equal(piece.selectedSize, '32');
    }
  }
});

test('generateStyledOutfit explains when strict budget cannot fit a full look and still suggests closest alternative', () => {
  const look = generateStyledOutfit(PRODUCTS, {
    occasion: 'Wedding',
    style: 'Classic',
    budgetTier: 'custom',
    customBudgetNgn: 15000,
  });

  assert.equal(look.withinBudget, false);
  assert.ok(look.pieces.length >= 2);
  assert.ok(look.budgetMessage && look.budgetMessage.includes('₦15,000'));
});

test('swapOutfitPiece swaps a piece in-place and updates totalPriceNgn', () => {
  const baseLook = generateStyledOutfit(PRODUCTS, {
    occasion: 'Casual Hangout',
    style: 'Streetwear',
    budgetTier: '50k-100k',
  });

  const candidates = getSwapCandidatesForSlot(PRODUCTS, baseLook, 0);
  assert.ok(candidates.length > 0);

  const swapped = swapOutfitPiece(baseLook, 0, candidates[0], {
    occasion: 'Casual Hangout',
    style: 'Streetwear',
    budgetTier: '50k-100k',
  });

  assert.equal(swapped.pieces[0].product.id, candidates[0].id);
  const expectedSum = swapped.pieces.reduce((s, p) => s + p.product.priceNgn, 0);
  assert.equal(swapped.totalPriceNgn, expectedSum);
});

test('tryAnotherLook variationIndex produces distinct outfit combinations', () => {
  const input = {
    occasion: 'Birthday Party' as const,
    style: 'Streetwear' as const,
    budgetTier: '50k-100k' as const,
  };
  const lookA = generateStyledOutfit(PRODUCTS, input, 0);
  const lookB = generateStyledOutfit(PRODUCTS, input, 1);

  const sigA = lookA.pieces.map((p) => p.product.id).sort().join(',');
  const sigB = lookB.pieces.map((p) => p.product.id).sort().join(',');
  assert.notEqual(sigA, sigB);
});
