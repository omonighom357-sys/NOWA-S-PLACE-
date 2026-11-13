import {
  BudgetTierId,
  CuratedOutfit,
  GarmentSlot,
  OutfitPiece,
  Product,
  StyleFinderInput,
} from '../types/store';
import { formatNaira } from './currency';

export function resolveBudgetMaxNgn(
  tier?: BudgetTierId,
  customBudgetNgn?: number
): number | null {
  if (tier === 'under-30k') return 30000;
  if (tier === '30k-50k') return 50000;
  if (tier === '50k-100k') return 100000;
  if (tier === 'above-100k') return null;
  if (tier === 'custom') {
    if (typeof customBudgetNgn === 'number' && Number.isFinite(customBudgetNgn) && customBudgetNgn > 0) {
      return customBudgetNgn;
    }
    return null;
  }
  return null;
}

function pickBestSize(product: Product, input: StyleFinderInput): string {
  if (product.slot === 'top' || product.slot === 'set') {
    if (input.topSize && product.sizes.includes(input.topSize)) {
      return input.topSize;
    }
  }
  if (product.slot === 'bottom') {
    if (input.trouserSize && product.sizes.includes(input.trouserSize)) {
      return input.trouserSize;
    }
  }
  if (product.slot === 'footwear') {
    if (input.footwearSize && product.sizes.includes(input.footwearSize)) {
      return input.footwearSize;
    }
  }
  return product.sizes[0] ?? 'One Size';
}

function pickBestColour(product: Product, input: StyleFinderInput): string {
  if (!input.colourPreference || input.colourPreference === 'No Preference') {
    return product.colours[0]?.name ?? 'Default';
  }
  if (input.colourPreference === 'Dark') {
    const darkMatch = product.colours.find((c) =>
      /black|charcoal|slate|dark|onyx/i.test(c.name)
    );
    if (darkMatch) return darkMatch.name;
  }
  if (input.colourPreference === 'Neutral') {
    const neutralMatch = product.colours.find((c) =>
      /white|ivory|cream|grey|ash|stone|sand|putty/i.test(c.name)
    );
    if (neutralMatch) return neutralMatch.name;
  }
  if (input.colourPreference === 'Earth Tones') {
    const earthMatch = product.colours.find((c) =>
      /olive|sand|khaki|brown|espresso|sage|ochre/i.test(c.name)
    );
    if (earthMatch) return earthMatch.name;
  }
  return product.colours[0]?.name ?? 'Default';
}

function scoreProduct(product: Product, input: StyleFinderInput): number {
  let score = 0;

  if (input.occasion && product.occasions.includes(input.occasion)) {
    score += 12;
  }
  if (input.style && product.styles.includes(input.style)) {
    score += 10;
  }
  if (
    input.colourPreference &&
    input.colourPreference !== 'No Preference' &&
    product.colourGroup === input.colourPreference
  ) {
    score += 6;
  }

  // Size preference bonus
  if (product.slot === 'top' || product.slot === 'set') {
    if (input.topSize && product.sizes.includes(input.topSize)) score += 3;
  } else if (product.slot === 'bottom') {
    if (input.trouserSize && product.sizes.includes(input.trouserSize)) score += 3;
  } else if (product.slot === 'footwear') {
    if (input.footwearSize && product.sizes.includes(input.footwearSize)) score += 3;
  }

  if (product.isFeatured) score += 2;
  if (product.isNewArrival) score += 1;

  return score;
}

function buildOutfitTitle(input: StyleFinderInput, usesSet: boolean): string {
  const occasionLabel = input.occasion ?? 'Everyday Edit';
  const styleLabel = input.style ?? "Nowa's Place Signature";
  if (usesSet) {
    return `${styleLabel} ${occasionLabel} Set`;
  }
  return `${styleLabel} ${occasionLabel} Look`;
}

function buildStylingNote(input: StyleFinderInput, pieces: OutfitPiece[]): string {
  const names = pieces.map((p) => p.product.name).join(' paired with ');
  const parts: string[] = [];
  if (input.occasion) {
    parts.push(`Tailored for ${input.occasion}`);
  } else {
    parts.push('Balanced everyday proportions');
  }
  if (input.style) {
    parts.push(`channeling a ${input.style.toLowerCase()} silhouette`);
  }
  if (input.colourPreference && input.colourPreference !== 'No Preference') {
    parts.push(`anchored in ${input.colourPreference.toLowerCase()} tones`);
  }
  return `${parts.join(', ')}: ${names}.`;
}

interface CandidateCombo {
  pieces: Product[];
  score: number;
  totalPriceNgn: number;
  usesSet: boolean;
}

export function generateStyledOutfit(
  products: readonly Product[],
  input: StyleFinderInput,
  variationIndex = 0
): CuratedOutfit {
  const budgetMaxNgn = resolveBudgetMaxNgn(input.budgetTier, input.customBudgetNgn);

  const tops = [...products]
    .filter((p) => p.slot === 'top')
    .sort((a, b) => scoreProduct(b, input) - scoreProduct(a, input));
  const bottoms = [...products]
    .filter((p) => p.slot === 'bottom')
    .sort((a, b) => scoreProduct(b, input) - scoreProduct(a, input));
  const sets = [...products]
    .filter((p) => p.slot === 'set')
    .sort((a, b) => scoreProduct(b, input) - scoreProduct(a, input));
  const footwears = [...products]
    .filter((p) => p.slot === 'footwear')
    .sort((a, b) => scoreProduct(b, input) - scoreProduct(a, input));
  const accessories = [...products]
    .filter((p) => p.slot === 'accessory')
    .sort((a, b) => scoreProduct(b, input) - scoreProduct(a, input));

  const combos: CandidateCombo[] = [];

  // Build coordinated Top + Bottom (+ optional Footwear / Accessory) combinations
  const topPool = tops.slice(0, 5);
  const bottomPool = bottoms.slice(0, 5);
  const footPool = footwears.slice(0, 4);
  const accPool = accessories.slice(0, 2);

  for (const top of topPool) {
    for (const bottom of bottomPool) {
      const baseScore = scoreProduct(top, input) + scoreProduct(bottom, input);
      const baseCost = top.priceNgn + bottom.priceNgn;

      // 2-piece core look (top + bottom)
      combos.push({
        pieces: [top, bottom],
        score: baseScore,
        totalPriceNgn: baseCost,
        usesSet: false,
      });

      // 3-piece (top + bottom + footwear)
      for (const foot of footPool.slice(0, 2)) {
        combos.push({
          pieces: [top, bottom, foot],
          score: baseScore + scoreProduct(foot, input) + 3,
          totalPriceNgn: baseCost + foot.priceNgn,
          usesSet: false,
        });

        // 4-piece complete look (top + bottom + footwear + accessory)
        for (const acc of accPool.slice(0, 1)) {
          combos.push({
            pieces: [top, bottom, foot, acc],
            score: baseScore + scoreProduct(foot, input) + scoreProduct(acc, input) + 5,
            totalPriceNgn: baseCost + foot.priceNgn + acc.priceNgn,
            usesSet: false,
          });
        }
      }

      // 3-piece (top + bottom + accessory)
      for (const acc of accPool.slice(0, 1)) {
        combos.push({
          pieces: [top, bottom, acc],
          score: baseScore + scoreProduct(acc, input) + 2,
          totalPriceNgn: baseCost + acc.priceNgn,
          usesSet: false,
        });
      }
    }
  }

  // Build coordinated Two-Piece Set (+ optional Footwear / Accessory) combinations
  for (const setItem of sets) {
    const setScore = scoreProduct(setItem, input) * 2 + 2;
    combos.push({
      pieces: [setItem],
      score: setScore - 2,
      totalPriceNgn: setItem.priceNgn,
      usesSet: true,
    });

    for (const foot of footPool.slice(0, 2)) {
      combos.push({
        pieces: [setItem, foot],
        score: setScore + scoreProduct(foot, input) + 3,
        totalPriceNgn: setItem.priceNgn + foot.priceNgn,
        usesSet: true,
      });

      for (const acc of accPool.slice(0, 1)) {
        combos.push({
          pieces: [setItem, foot, acc],
          score: setScore + scoreProduct(foot, input) + scoreProduct(acc, input) + 4,
          totalPriceNgn: setItem.priceNgn + foot.priceNgn + acc.priceNgn,
          usesSet: true,
        });
      }
    }

    for (const acc of accPool.slice(0, 1)) {
      combos.push({
        pieces: [setItem, acc],
        score: setScore + scoreProduct(acc, input) + 1,
        totalPriceNgn: setItem.priceNgn + acc.priceNgn,
        usesSet: true,
      });
    }
  }

  // Filter by budget if budget cap is specified
  const withinBudgetCombos =
    budgetMaxNgn !== null
      ? combos.filter((c) => c.totalPriceNgn <= budgetMaxNgn)
      : combos;

  // Prefer multi-piece outfits within budget when available
  const multiPieceWithinBudget = withinBudgetCombos.filter((c) => c.pieces.length >= 2);
  const preferredWithinBudget =
    multiPieceWithinBudget.length > 0 ? multiPieceWithinBudget : withinBudgetCombos;

  let chosenPool: CandidateCombo[];
  let withinBudget = true;
  let budgetMessage: string | null = null;

  if (preferredWithinBudget.length > 0) {
    // Sort by score desc, then prefer fuller outfits (more pieces) and higher score
    chosenPool = [...preferredWithinBudget].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.pieces.length - a.pieces.length;
    });
  } else {
    // No multi-piece or set fits inside the strict budget (e.g. under ₦25k full outfit)
    withinBudget = false;
    // Check if any single piece fits under budget, otherwise sort multi-piece closest to budget
    const sortedClosest = [...combos]
      .filter((c) => c.pieces.length >= 2)
      .sort((a, b) => {
        const diff = a.totalPriceNgn - b.totalPriceNgn;
        if (Math.abs(diff) > 4000) return diff;
        return b.score - a.score;
      });

    chosenPool = sortedClosest.length > 0 ? sortedClosest : combos;
    const lowestMulti = chosenPool[0];
    if (budgetMaxNgn !== null && lowestMulti) {
      budgetMessage = `A full coordinated outfit starts at ${formatNaira(
        lowestMulti.totalPriceNgn
      )}, which is slightly above your ${formatNaira(
        budgetMaxNgn
      )} target. Here is our closest value-focused look—you can also swap or remove any piece below.`;
    }
  }

  // Deduplicate top looks by piece ID signature so variationIndex rotates distinct outfits
  const seenSignatures = new Set<string>();
  const distinctLooks: CandidateCombo[] = [];
  for (const combo of chosenPool) {
    const sig = combo.pieces
      .map((p) => p.id)
      .sort()
      .join('|');
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      distinctLooks.push(combo);
    }
  }

  const safeIndex =
    distinctLooks.length > 0 ? Math.abs(variationIndex) % distinctLooks.length : 0;
  const picked = distinctLooks[safeIndex] ?? combos[0];

  const outfitPieces: OutfitPiece[] = picked.pieces.map((product) => ({
    slot: product.slot,
    product,
    selectedSize: pickBestSize(product, input),
    selectedColour: pickBestColour(product, input),
  }));

  const totalPriceNgn = outfitPieces.reduce((sum, p) => sum + p.product.priceNgn, 0);

  return {
    title: buildOutfitTitle(input, picked.usesSet),
    stylingNote: buildStylingNote(input, outfitPieces),
    pieces: outfitPieces,
    totalPriceNgn,
    withinBudget,
    budgetMaxNgn,
    budgetMessage,
  };
}

export function getSwapCandidatesForSlot(
  products: readonly Product[],
  outfit: CuratedOutfit,
  pieceIndex: number
): Product[] {
  const targetPiece = outfit.pieces[pieceIndex];
  if (!targetPiece) return [];
  const usedIds = new Set(outfit.pieces.map((p) => p.product.id));

  return products.filter(
    (p) => p.slot === targetPiece.slot && !usedIds.has(p.id)
  );
}

export function swapOutfitPiece(
  outfit: CuratedOutfit,
  pieceIndex: number,
  replacement: Product,
  input: StyleFinderInput
): CuratedOutfit {
  const nextPieces = outfit.pieces.map((piece, idx) => {
    if (idx !== pieceIndex) return piece;
    return {
      slot: replacement.slot as GarmentSlot,
      product: replacement,
      selectedSize: pickBestSize(replacement, input),
      selectedColour: pickBestColour(replacement, input),
    };
  });

  const totalPriceNgn = nextPieces.reduce((sum, p) => sum + p.product.priceNgn, 0);
  const withinBudget =
    outfit.budgetMaxNgn === null ? true : totalPriceNgn <= outfit.budgetMaxNgn;

  return {
    ...outfit,
    pieces: nextPieces,
    totalPriceNgn,
    withinBudget,
    budgetMessage:
      !withinBudget && outfit.budgetMaxNgn !== null
        ? `Updated look total (${formatNaira(totalPriceNgn)}) exceeds your ${formatNaira(
            outfit.budgetMaxNgn
          )} target. Swap to a lighter option or remove a piece anytime.`
        : null,
    stylingNote: buildStylingNote(input, nextPieces),
  };
}
