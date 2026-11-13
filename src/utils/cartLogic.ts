import { CartItem, Product } from '../types/store';

export const CART_STORAGE_KEY = 'nowas_place_cart_v1';

export function getCartItemKey(productId: string, size: string, colour: string): string {
  return `${productId}__${size.trim()}__${colour.trim()}`;
}

export function addCartItem(
  items: readonly CartItem[],
  product: Product,
  size: string,
  colour: string,
  quantity: number
): CartItem[] {
  const safeQty = Math.max(1, Math.min(99, Math.floor(quantity)));
  const key = getCartItemKey(product.id, size, colour);
  const existingIndex = items.findIndex((item) => item.key === key);

  if (existingIndex === -1) {
    return [
      ...items,
      {
        key,
        productId: product.id,
        name: product.name,
        category: product.category,
        priceNgn: product.priceNgn,
        image: product.image,
        size,
        colour,
        quantity: safeQty,
      },
    ];
  }

  return items.map((item, idx) =>
    idx === existingIndex
      ? { ...item, quantity: Math.min(99, item.quantity + safeQty) }
      : item
  );
}

export function updateCartQuantity(
  items: readonly CartItem[],
  key: string,
  nextQuantity: number
): CartItem[] {
  if (nextQuantity <= 0) {
    return items.filter((item) => item.key !== key);
  }

  const clamped = Math.min(99, Math.floor(nextQuantity));
  return items.map((item) => (item.key === key ? { ...item, quantity: clamped } : item));
}

export function removeCartItem(items: readonly CartItem[], key: string): CartItem[] {
  return items.filter((item) => item.key !== key);
}

export function calculateCartSubtotal(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceNgn * item.quantity, 0);
}

export function calculateCartItemCount(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item.key === 'string' &&
        typeof item.productId === 'string' &&
        typeof item.name === 'string' &&
        typeof item.priceNgn === 'number' &&
        typeof item.size === 'string' &&
        typeof item.colour === 'string' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: readonly CartItem[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors cleanly
  }
}
