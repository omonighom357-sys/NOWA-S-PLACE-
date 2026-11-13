export function formatNaira(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  return `₦${safeAmount.toLocaleString('en-NG')}`;
}
