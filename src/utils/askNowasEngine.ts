import { STORE_CONFIG } from '../config/storeConfig';
import {
  ColourGroup,
  Product,
  StyleOccasion,
  StylePreference,
  STYLE_OCCASIONS,
  STYLE_PREFERENCES,
} from '../types/store';
import { formatNaira } from './currency';

export type AssistantQuickActionType =
  | 'open-style-finder'
  | 'view-location'
  | 'open-cart'
  | 'browse-shop';

export interface AssistantQuickAction {
  type: AssistantQuickActionType;
  label: string;
}

export interface AssistantContext {
  lastOccasion?: StyleOccasion;
  lastStyle?: StylePreference;
  lastBudgetNgn?: number;
  lastColour?: ColourGroup;
  lastRecommendedIds?: string[];
}

export interface AssistantReply {
  replyText: string;
  recommendedProducts: Product[];
  quickActions: AssistantQuickAction[];
  nextContext: AssistantContext;
}

export const ASK_NOWAS_GREETING =
  "Hey! Welcome to Nowa's Place. Need help finding the perfect fit? Tell me what you're shopping for.";

export const ASK_NOWAS_SUGGESTIONS: string[] = [
  'Outfit for a date night under ₦50,000',
  'Baggy jeans and oversized tees',
  'Smart casual look for dinner',
  "Where is Nowa's Place located?",
];

function extractBudgetFromText(text: string): number | undefined {
  const normalized = text.toLowerCase().replace(/,/g, '');
  // Match e.g. "50k", "30k", "₦50000", "under 50000", "50,000"
  const kMatch = normalized.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (kMatch) {
    const val = Number.parseFloat(kMatch[1]) * 1000;
    if (Number.isFinite(val) && val > 0) return val;
  }

  const numMatch = normalized.match(/(?:₦|ngn|under|below|around|budget|max)?\s*(\d{4,7})\b/);
  if (numMatch) {
    const val = Number.parseInt(numMatch[1], 10);
    if (Number.isFinite(val) && val >= 5000) return val;
  }

  if (/\b(cheap|cheaper|affordable|budget|less expensive|lower price)\b/.test(normalized)) {
    return 25000;
  }

  return undefined;
}

function extractOccasion(text: string): StyleOccasion | undefined {
  const lower = text.toLowerCase();
  const explicit = STYLE_OCCASIONS.find((occ) => lower.includes(occ.toLowerCase()));
  if (explicit) return explicit;
  if (/\b(date|romantic)\b/.test(lower)) return 'Date Night';
  if (/\b(wedding|owambe|reception)\b/.test(lower)) return 'Wedding';
  if (/\b(birthday|party|club|turnup|night out)\b/.test(lower)) return 'Birthday Party';
  if (/\b(church|sunday|service)\b/.test(lower)) return 'Church';
  if (/\b(hangout|chill|weekend|linkup)\b/.test(lower)) return 'Casual Hangout';
  if (/\b(dinner|restaurant|evening)\b/.test(lower)) return 'Dinner';
  if (/\b(office|work|corporate|meeting)\b/.test(lower)) return 'Office';
  if (/\b(campus|school|lecture|uni)\b/.test(lower)) return 'Campus';
  if (/\b(event|gala|launch|occasion)\b/.test(lower)) return 'Special Event';
  return undefined;
}

function extractStyle(text: string): StylePreference | undefined {
  const lower = text.toLowerCase();
  const explicit = STYLE_PREFERENCES.find((st) => lower.includes(st.toLowerCase()));
  if (explicit) return explicit;
  if (/\b(street|urban|skate|baggy)\b/.test(lower)) return 'Streetwear';
  if (/\b(smart|clean|sharp|tailored)\b/.test(lower)) return 'Smart Casual';
  if (/\b(minimal|simple|plain)\b/.test(lower)) return 'Minimalist';
  if (/\b(retro|archival|old school)\b/.test(lower)) return 'Vintage';
  return undefined;
}

function extractColour(text: string): ColourGroup | undefined {
  const lower = text.toLowerCase();
  if (/\b(dark|black|charcoal|slate)\b/.test(lower)) return 'Dark';
  if (/\b(neutral|white|ivory|cream|grey|gray)\b/.test(lower)) return 'Neutral';
  if (/\b(earth|olive|sand|khaki|brown|espresso|sage)\b/.test(lower)) return 'Earth Tones';
  if (/\b(bright|blue|ice|sky)\b/.test(lower)) return 'Bright';
  return undefined;
}

const CATEGORY_KEYWORDS: { pattern: RegExp; category: Product['category'] }[] = [
  { pattern: /\b(jean|jeans|denim)\b/i, category: 'Baggy Jeans' },
  { pattern: /\b(trouser|trousers|pants|pleated)\b/i, category: 'Baggy Trousers' },
  { pattern: /\b(jort|jorts|knicker|knickers|short|shorts)\b/i, category: 'Baggy Knickers / Jorts' },
  { pattern: /\b(vintage shirt|camp shirt|striped shirt|button|shirt)\b/i, category: 'Vintage Shirts' },
  { pattern: /\b(tee|tees|t-shirt|tshirt|graphic tee)\b/i, category: 'Oversized T-Shirts' },
  { pattern: /\b(hoodie|hoodies|sweater|sweaters|knit|fleece)\b/i, category: 'Hoodies and Sweaters' },
  { pattern: /\b(cargo|cargos|utility pant)\b/i, category: 'Cargo Pants' },
  { pattern: /\b(sneaker|sneakers|shoe|shoes|footwear|kick|kicks)\b/i, category: 'Sneakers' },
  { pattern: /\b(slide|slides|slipper|mule)\b/i, category: 'Slides' },
  { pattern: /\b(two-piece|two piece|set|sets|outfit set|coord)\b/i, category: 'Two-Piece Outfits' },
  { pattern: /\b(cap|caps|bag|crossbody|accessory|accessories)\b/i, category: 'Caps and Accessories' },
];

export function queryAskNowasAssistant(
  rawQuery: string,
  products: readonly Product[],
  context: AssistantContext = {}
): AssistantReply {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  // 1. Location / Boutique / Maps inquiry
  if (
    /\b(where|location|address|located|find you|udu|ekete|delta|directions|map|visit|store|shop address)\b/i.test(
      lower
    )
  ) {
    return {
      replyText: `Our boutique is located at ${STORE_CONFIG.storeAddress}. ${STORE_CONFIG.openingHours}. You can open our interactive map below to get turn-by-turn directions or copy the address directly.`,
      recommendedProducts: [],
      quickActions: [
        { type: 'view-location', label: 'View Boutique Map & Directions' },
        { type: 'open-style-finder', label: 'Try Style Finder' },
      ],
      nextContext: context,
    };
  }

  // 2. WhatsApp / Order / Delivery inquiry
  if (/\b(whatsapp|checkout|how to buy|how do i order|delivery|pickup|shipping|pay)\b/i.test(lower)) {
    return {
      replyText:
        "Ordering at Nowa's Place takes seconds: add pieces (or a complete styled look) to your bag, click Proceed to WhatsApp Checkout, enter your name and delivery/pickup preference, and your itemized order message is ready for direct store confirmation.",
      recommendedProducts: [],
      quickActions: [
        { type: 'open-cart', label: 'Open Shopping Bag' },
        { type: 'open-style-finder', label: "Let Nowa's Place Style Me" },
      ],
      nextContext: context,
    };
  }

  const matchedCategories = CATEGORY_KEYWORDS.filter((entry) =>
    entry.pattern.test(lower)
  ).map((entry) => entry.category);

  // 3. Sizing & Fit help
  if (
    /\b(what size|which size|size guide|size chart|sizing|fit guide|how does it fit|measurements|true to size)\b/i.test(
      lower
    ) ||
    (/\b(size|fit)\b/i.test(lower) && matchedCategories.length === 0)
  ) {
    return {
      replyText:
        'Our tees, shirts, hoodies, and two-piece sets use relaxed boxy fits (M–XXL, with select tees in S), while baggy jeans, cargos, and trousers come in waist sizes 30–38. Sneakers and slides run in EU 40–45 (size up in slides if between sizes). Want me to match an outfit in your exact sizes?',
      recommendedProducts: products.filter((p) => p.isFeatured).slice(0, 3),
      quickActions: [
        { type: 'open-style-finder', label: 'Pick Sizes in Style Finder' },
      ],
      nextContext: context,
    };
  }

  // 4. Explicit Style Finder / Complete Outfit request
  const isFollowUpMore = /\b(another|more|different|else|cheaper|lighter|darker)\b/i.test(lower);
  const extractedOccasion = extractOccasion(lower) ?? (isFollowUpMore ? context.lastOccasion : undefined);
  const extractedStyle = extractStyle(lower) ?? (isFollowUpMore ? context.lastStyle : undefined);
  const extractedBudget = extractBudgetFromText(lower) ?? (isFollowUpMore ? context.lastBudgetNgn : undefined);
  const extractedColour = extractColour(lower) ?? (isFollowUpMore ? context.lastColour : undefined);

  // Score catalogue items
  const scored = products.map((product) => {
    let score = 0;

    if (matchedCategories.length > 0 && matchedCategories.includes(product.category)) {
      score += 18;
    }
    if (extractedOccasion && product.occasions.includes(extractedOccasion)) {
      score += 10;
    }
    if (extractedStyle && product.styles.includes(extractedStyle)) {
      score += 8;
    }
    if (extractedColour && extractedColour !== 'No Preference' && product.colourGroup === extractedColour) {
      score += 6;
    }
    if (extractedBudget !== undefined) {
      if (product.priceNgn <= extractedBudget) {
        score += 5;
      } else {
        score -= 10;
      }
    }
    if (
      product.name.toLowerCase().includes(lower) ||
      product.description.toLowerCase().includes(lower)
    ) {
      score += 12;
    }

    // Penalize previously shown products on follow-up requests so user sees fresh picks
    if (isFollowUpMore && context.lastRecommendedIds?.includes(product.id)) {
      score -= 8;
    }

    if (product.isNewArrival) score += 1;
    if (product.isFeatured) score += 1;

    return { product, score };
  });

  // Sort by highest score, then price asc if budget query
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (extractedBudget !== undefined) return a.product.priceNgn - b.product.priceNgn;
    return b.product.createdAtOrder - a.product.createdAtOrder;
  });

  // Build curated response
  let picks: Product[] = [];
  if (matchedCategories.length >= 2) {
    // Pick top item from each requested category
    for (const cat of matchedCategories) {
      const bestForCat = scored.find((s) => s.product.category === cat)?.product;
      if (bestForCat) picks.push(bestForCat);
    }
  }

  if (picks.length === 0) {
    // If budget is specified, try to keep individual items or a coordinated pair within budget
    const positive = scored.filter((s) => s.score > 0).map((s) => s.product);
    const pool = positive.length > 0 ? positive : scored.map((s) => s.product);

    if (extractedBudget !== undefined) {
      const affordable = pool.filter((p) => p.priceNgn <= extractedBudget);
      if (affordable.length > 0) {
        // Try finding a top + bottom (or set) whose sum <= budget
        const top = affordable.find((p) => p.slot === 'top');
        const bottom = affordable.find((p) => p.slot === 'bottom');
        if (top && bottom && top.priceNgn + bottom.priceNgn <= extractedBudget) {
          picks = [top, bottom];
          const acc = affordable.find(
            (p) =>
              (p.slot === 'footwear' || p.slot === 'accessory') &&
              top.priceNgn + bottom.priceNgn + p.priceNgn <= extractedBudget
          );
          if (acc) picks.push(acc);
        } else {
          picks = affordable.slice(0, 3);
        }
      } else {
        picks = [...pool].sort((a, b) => a.priceNgn - b.priceNgn).slice(0, 3);
      }
    } else {
      picks = pool.slice(0, 3);
    }
  }

  const combinedTotal = picks.reduce((sum, p) => sum + p.priceNgn, 0);
  const contextParts: string[] = [];
  if (extractedOccasion) contextParts.push(extractedOccasion.toLowerCase());
  if (extractedStyle) contextParts.push(extractedStyle.toLowerCase());
  if (extractedColour && extractedColour !== 'No Preference') {
    contextParts.push(`${extractedColour.toLowerCase()} palette`);
  }

  let replyText: string;
  if (picks.length === 0) {
    replyText =
      "I couldn't find an exact match for that phrase yet, but our Style Finder can build a complete outfit tailored to your occasion and budget.";
  } else if (extractedBudget !== undefined && picks.every((p) => p.priceNgn > extractedBudget)) {
    replyText = `Our pieces start from ${formatNaira(
      Math.min(...products.map((p) => p.priceNgn))
    )}, so these are our closest budget-friendly options just above ${formatNaira(
      extractedBudget
    )}:`;
  } else if (contextParts.length > 0) {
    replyText = `Here are curated Nowa's Place picks for a ${contextParts.join(', ')} rotation${
      extractedBudget ? ` within your ${formatNaira(extractedBudget)} budget` : ''
    }${picks.length >= 2 ? ` (${picks.length} pieces shown · ${formatNaira(combinedTotal)} together)` : ''}:`;
  } else if (matchedCategories.length > 0) {
    replyText = `Here are our top ${matchedCategories.join(' & ')} picks in the current drop:`;
  } else {
    replyText =
      "Here are standout Nowa's Place pieces from our current collection. Tell me an occasion, style, or budget to narrow it down further:";
  }

  return {
    replyText,
    recommendedProducts: picks,
    quickActions: [
      { type: 'open-style-finder', label: 'Build Full Outfit in Style Finder' },
      ...(picks.length > 0 ? [{ type: 'browse-shop' as const, label: 'Browse All 25 Pieces' }] : []),
    ],
    nextContext: {
      lastOccasion: extractedOccasion,
      lastStyle: extractedStyle,
      lastBudgetNgn: extractedBudget,
      lastColour: extractedColour,
      lastRecommendedIds: picks.map((p) => p.id),
    },
  };
}
