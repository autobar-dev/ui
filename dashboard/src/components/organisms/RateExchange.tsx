"use client";

import { CurrencyRepository } from "@/repositories/CurrencyRepository";
import { Currency, Rate } from "@/types/currency";
import { serviceRateToRate } from "@/utils/currency_utils";
import { formatDate } from "@/utils/misc";
import { formatFloat } from "@/utils/misc";
import { Button, Card, Flex, SearchSelect, Select, SelectItem, Subtitle, Title, Text, Metric, Table, TableBody, TableRow, TableCell } from "@tremor/react";
import { useState } from "react";

export default function RateExchange({ enabledCurrencies, currencies }: {
  enabledCurrencies: Currency[],
  currencies: Currency[],
}) {
  const currencyRepository = new CurrencyRepository("http://localhost:9000/currency");

  const [onlyUseEnabled, setOnlyUseEnabled] = useState<boolean>(true);

  const [fromCurrency, setFromCurrency] = useState<string>(enabledCurrencies[0].code);
  const [toCurrency, setToCurrency] = useState<string>(enabledCurrencies[0].code);

  const [isRateLoading, setIsRateLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<Rate | undefined>(undefined);

  const currenciesSorted = currencies.sort((a, b) => a.code.localeCompare(b.code));
  const enabledCurrenciesSorted = enabledCurrencies.sort((a, b) => a.code.localeCompare(b.code));

  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Title>Rate exchange</Title>
      </Flex>

      <label className="block mt-6 ml-2">
        <input
          type="checkbox"
          checked={onlyUseEnabled}
          onChange={() => setOnlyUseEnabled(!onlyUseEnabled)}
          className="accent-tremor-brand"
        />
        <Text className="inline-block ml-2">Only use enabled currencies</Text>
      </label>

      <div className="flex flex-row mt-6">
        <Select value={fromCurrency} onValueChange={setFromCurrency}>
          {(onlyUseEnabled ? enabledCurrenciesSorted : currenciesSorted).map(currency => (
            <SelectItem
              key={`rate-select-from-${currency.code}`}
              value={currency.code}
            >{currency.code}</SelectItem>
          ))}
        </Select>
        <span className="px-4 text-xl font-mono">→</span>
        <Select value={toCurrency} onValueChange={setToCurrency}>
          {(onlyUseEnabled ? enabledCurrencies : currencies).map(currency => (
            <SelectItem
              key={`rate-select-left-${currency.code}`}
              value={currency.code}
            >{currency.code}</SelectItem>
          ))}
        </Select>
        <Button
          className="ml-2"
          loading={isRateLoading}
          onClick={async () => {
            setIsRateLoading(true);

            try {
              const rate = await currencyRepository.getRate(fromCurrency, toCurrency);
              setRate(serviceRateToRate(rate));
            } catch (e) { }

            setIsRateLoading(false);
          }}
        >Get</Button>
      </div>
      {rate && (
        <Table className="mt-6">
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">Rate</TableCell>
              <TableCell className="font-mono">{`${formatFloat(rate.rate, 4)} (1 ${rate.from} = ${formatFloat(rate.rate, 2)} ${rate.to})`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Updated at</TableCell>
              <TableCell className="font-mono">{formatDate(rate.updatedAt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
