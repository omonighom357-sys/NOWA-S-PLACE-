import test from 'node:test';
import assert from 'node:assert/strict';
import { isWishlisted, toggleWishlistId } from './wishlistLogic.ts';

test('toggleWishlistId adds missing id and removes existing id without duplicates', () => {
  const step1 = toggleWishlistId([], 'nwp-01');
  assert.deepEqual(step1, ['nwp-01']);
  assert.equal(isWishlisted(step1, 'nwp-01'), true);

  const step2 = toggleWishlistId(step1, 'nwp-08');
  assert.deepEqual(step2, ['nwp-08', 'nwp-01']);

  const step3 = toggleWishlistId(step2, 'nwp-01');
  assert.deepEqual(step3, ['nwp-08']);
  assert.equal(isWishlisted(step3, 'nwp-01'), false);
});
