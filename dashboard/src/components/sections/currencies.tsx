import { Badge, Card, Col, Flex, Grid, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";
import { CurrencyRepository } from "@/repositories/CurrencyRepository";
import { filterEnabledCurrencies, serviceCurrencyToCurrency } from "@/utils/currency_utils";
import CurrenciesTable from "../organisms/CurrenciesTable";
import RateExchange from "../organisms/RateExchange";

export default async function CurrenciesSection() {
  const currencyRepository = new CurrencyRepository("http://localhost:9000/currency");
  const serviceCurrencies = await currencyRepository.getAll();
  const enabledCurrenciesCodes = await currencyRepository.getAllEnabled();

  const currencies = serviceCurrencies.map(serviceCurrencyToCurrency);
  const enabledCurrencies = filterEnabledCurrencies(currencies, enabledCurrenciesCodes);

  const currenciesSorted = currencies.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <Grid numItems={1} className="gap-2">
      <CurrenciesTable currencies={currenciesSorted} />
      <RateExchange
        currencies={currencies}
        enabledCurrencies={enabledCurrencies}
      />
    </Grid>
  );
}
