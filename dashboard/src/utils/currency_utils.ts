import { Currency, Rate } from "@/types/currency";

export function filterEnabledCurrencies(currencies: Currency[]): Currency[] {
  return currencies.filter((currency) => currency.enabled);
}

// These are largely redundant now as the repository handles mapping, 
// but kept for compatibility if needed elsewhere.
export function sortCurrenciesByCode(currencies: Currency[]): Currency[] {
  return [...currencies].sort((a, b) => a.code.localeCompare(b.code));
}
