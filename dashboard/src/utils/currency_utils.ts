import { ServiceCurrency, ServiceEnabledCurrency, ServiceRate } from "@/repositories/CurrencyRepository";
import { Currency, EnabledCurrency, Rate } from "@/types/currency";

export function serviceCurrencyToCurrency(service_currency: ServiceCurrency): Currency {
  return {
    id: service_currency.id,
    code: service_currency.code,
    name: service_currency.name,
    minorUnitDivisor: service_currency.minor_unit_divisor,
    symbol: service_currency.symbol ?? undefined,
    enabled: service_currency.enabled,
    createdAt: new Date(service_currency.created_at),
    updatedAt: new Date(service_currency.updated_at),
  };
}

export function serviceEnabledCurrencyToEnabledCurrency(service_enabled_currency: ServiceEnabledCurrency): EnabledCurrency {
  return {
    code: service_enabled_currency.code,
    name: service_enabled_currency.name,
  };
}

export function serviceRateToRate(service_rate: ServiceRate): Rate {
  return {
    from: service_rate.from,
    to: service_rate.to,
    rate: service_rate.rate,
    updatedAt: new Date(service_rate.updated_at),
  };
}

export function filterEnabledCurrencies(currencies: Currency[], enabledCurrencies: EnabledCurrency[]): Currency[] {
  const enabledCurrencyCodes = enabledCurrencies.map(enabledCurrency => enabledCurrency.code);
  return currencies.filter((currency) => enabledCurrencyCodes.includes(currency.code));
}
