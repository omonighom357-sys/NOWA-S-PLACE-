/**
 * Nowa's Place — Configurable Business & Demo Settings
 *
 * Replace the placeholder values below with the store owner's confirmed details
 * before publishing live.
 */
export interface StoreConfig {
  brandName: string;
  whatsappNumber: string; // International format without '+' e.g. '2348012345678'. Leave empty in demo mode.
  instagramHandle: string;
  storeAddress: string;
  mapsSearchQuery: string;
  openingHours: string;
  customerServiceEmail: string;
  demoCatalogueNotice: string;
  isDemoMode: boolean;
}

export const STORE_CONFIG: StoreConfig = {
  brandName: "NOWA'S PLACE",
  // Intentionally left unconfigured in demo mode so no fake phone number is published.
  // Replace with verified digits (e.g. '23480XXXXXXXX') to enable direct wa.me launch.
  whatsappNumber: '',
  instagramHandle: '@nowasplace (placeholder)',
  storeAddress: 'Opposite Mountain of Fire Ministries, Along Ekete Road, Udu, Delta State, Nigeria',
  mapsSearchQuery: 'Mountain of Fire Ministries, Ekete Road, Udu, Delta State, Nigeria',
  openingHours: 'Mon – Sat: 9:00 AM – 7:00 PM (To be confirmed by owner)',
  customerServiceEmail: 'Customer Service — To be confirmed by owner',
  demoCatalogueNotice: 'Demo catalogue — prices and availability subject to confirmation',
  isDemoMode: true,
};
