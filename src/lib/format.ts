/**
 * Format a numeric value as a localized currency string.
 *
 * Locale is derived from the currency code: `'BRL'` uses `'pt-BR'`, everything
 * else uses `'en-US'`.
 *
 * @param value   The numeric amount to format.
 * @param currency  ISO 4217 currency code (default `'USD'`).
 * @param options   Extra `Intl.NumberFormatOptions` forwarded to the formatter
 *                  (e.g. `{ maximumFractionDigits: 0 }` for rounded display).
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
    ...options,
  }).format(value)
}
