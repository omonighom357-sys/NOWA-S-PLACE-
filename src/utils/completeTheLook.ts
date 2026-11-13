import { GarmentSlot, Product } from '../types/store';

function compatibilityScore(anchor: Product, candidate: Product): number {
  let score = 0;
  for (const style of anchor.styles) {
    if (candidate.styles.includes(style)) score += 4;
  }
  for (const occ of anchor.occasions) {
    if (candidate.occasions.includes(occ)) score += 2;
  }
  if (candidate.colourGroup === 'Neutral' || candidate.colourGroup === anchor.colourGroup) {
    score += 2;
  }
  if (candidate.isFeatured) score += 1;
  return score;
}

const COMPLEMENT_SLOTS: Record<GarmentSlot, GarmentSlot[]> = {
  bottom: ['top', 'footwear', 'accessory'],
  top: ['bottom', 'footwear', 'accessory'],
  set: ['footwear', 'accessory', 'top'],
  footwear: ['top', 'bottom', 'accessory'],
  accessory: ['top', 'bottom', 'footwear'],
};

export function getCompleteTheLookRecommendations(
  products: readonly Product[],
  anchorProduct: Product,
  overrides: Partial<Record<GarmentSlot, string>> = {}
): Product[] {
  const desiredSlots = COMPLEMENT_SLOTS[anchorProduct.slot] ?? ['top', 'footwear', 'accessory'];
  const result: Product[] = [];

  for (const slot of desiredSlots) {
    const overrideId = overrides[slot];
    if (overrideId) {
      const explicit = products.find((p) => p.id === overrideId && p.id !== anchorProduct.id);
      if (explicit) {
        result.push(explicit);
        continue;
      }
    }

    const candidates = products
      .filter((p) => p.slot === slot && p.id !== anchorProduct.id)
      .sort((a, b) => compatibilityScore(anchorProduct, b) - compatibilityScore(anchorProduct, a));

    if (candidates[0]) {
      result.push(candidates[0]);
    }
  }

  return result;
}

export function getAlternativeForLookSlot(
  products: readonly Product[],
  anchorProduct: Product,
  slot: GarmentSlot,
  currentId: string
): Product[] {
  return products
    .filter((p) => p.slot === slot && p.id !== anchorProduct.id && p.id !== currentId)
    .sort((a, b) => compatibilityScore(anchorProduct, b) - compatibilityScore(anchorProduct, a));
}
