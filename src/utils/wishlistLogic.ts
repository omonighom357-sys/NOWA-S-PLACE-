const WISHLIST_STORAGE_KEY = 'nowas_place_wishlist_v1';

export function isWishlisted(wishlistIds: readonly string[], productId: string): boolean {
  return wishlistIds.includes(productId);
}

export function toggleWishlistId(wishlistIds: readonly string[], productId: string): string[] {
  if (wishlistIds.includes(productId)) {
    return wishlistIds.filter((id) => id !== productId);
  }
  return [productId, ...wishlistIds];
}

export function loadWishlistFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

export function saveWishlistToStorage(wishlistIds: readonly string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  } catch {
    // Ignore storage quota errors
  }
}
