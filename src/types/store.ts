export const CATEGORIES = [
  'Baggy Jeans',
  'Baggy Trousers',
  'Baggy Knickers / Jorts',
  'Vintage Shirts',
  'Oversized T-Shirts',
  'Hoodies and Sweaters',
  'Cargo Pants',
  'Sneakers',
  'Slides',
  'Two-Piece Outfits',
  'Caps and Accessories',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const STYLE_OCCASIONS = [
  'Date Night',
  'Wedding',
  'Birthday Party',
  'Church',
  'Casual Hangout',
  'Dinner',
  'Office',
  'Campus',
  'Special Event',
] as const;

export type StyleOccasion = (typeof STYLE_OCCASIONS)[number];

export const STYLE_PREFERENCES = [
  'Streetwear',
  'Smart Casual',
  'Minimalist',
  'Vintage',
  'Classic',
  'Bold',
  'Relaxed',
] as const;

export type StylePreference = (typeof STYLE_PREFERENCES)[number];

export const COLOUR_GROUPS = [
  'Neutral',
  'Dark',
  'Bright',
  'Earth Tones',
  'No Preference',
] as const;

export type ColourGroup = (typeof COLOUR_GROUPS)[number];
export type ProductColourGroup = Exclude<ColourGroup, 'No Preference'>;

export type GarmentSlot = 'top' | 'bottom' | 'set' | 'footwear' | 'accessory';

export type BudgetTierId =
  | 'under-30k'
  | '30k-50k'
  | '50k-100k'
  | 'above-100k'
  | 'custom';

export interface ProductColour {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  priceNgn: number;
  image: string;
  sizes: string[];
  colours: ProductColour[];
  description: string;
  fabricNote: string;
  fitNote: string;
  isNewArrival: boolean;
  isFeatured: boolean;
  createdAtOrder: number;
  occasions: StyleOccasion[];
  styles: StylePreference[];
  colourGroup: ProductColourGroup;
  slot: GarmentSlot;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  category: Category;
  priceNgn: number;
  image: string;
  size: string;
  colour: string;
  quantity: number;
}

export interface WishlistEntry {
  productId: string;
  addedAt: number;
}

export interface StyleFinderInput {
  occasion?: StyleOccasion;
  style?: StylePreference;
  budgetTier?: BudgetTierId;
  customBudgetNgn?: number;
  colourPreference?: ColourGroup;
  topSize?: string;
  trouserSize?: string;
  footwearSize?: string;
}

export interface OutfitPiece {
  slot: GarmentSlot;
  product: Product;
  selectedSize: string;
  selectedColour: string;
}

export interface CuratedOutfit {
  title: string;
  stylingNote: string;
  pieces: OutfitPiece[];
  totalPriceNgn: number;
  withinBudget: boolean;
  budgetMaxNgn: number | null;
  budgetMessage: string | null;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

export type PageView =
  | 'home'
  | 'shop'
  | 'new-arrivals'
  | 'collections'
  | 'style-finder'
  | 'about';

export type FulfillmentOption = 'Delivery' | 'Store Pickup';

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  state: string;
  city: string;
  fulfillmentOption: FulfillmentOption;
  address: string;
  preferredDate: string;
  notes: string;
}

export interface CheckoutErrors {
  fullName?: string;
  phone?: string;
  state?: string;
  city?: string;
  address?: string;
  preferredDate?: string;
}
