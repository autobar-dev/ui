"use client";

import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { Currency, Rate } from "@/types/currency";
import { formatDate, formatFloat } from "@/utils/misc";
import { Button, Card, Flex, Select, SelectItem, Title, Text, Table, TableBody, TableRow, TableCell, Badge } from "@tremor/react";
import { useState, useContext } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";

export default function RateExchange({ enabledCurrencies, currencies }: {
  enabledCurrencies: Currency[],
  currencies: Currency[],
}) {
  const { currencyRepository } = useContext(RepositoriesContext);

  const [onlyUseEnabled, setOnlyUseEnabled] = useState<boolean>(true);
  const [fromCurrency, setFromCurrency] = useState<string>(enabledCurrencies.length > 0 ? enabledCurrencies[0].code : "");
  const [toCurrency, setToCurrency] = useState<string>(enabledCurrencies.length > 0 ? enabledCurrencies[0].code : "");

  const [isRateLoading, setIsRateLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<Rate | undefined>(undefined);

  const currenciesSorted = [...currencies].sort((a, b) => a.code.localeCompare(b.code));
  const enabledCurrenciesSorted = [...enabledCurrencies].sort((a, b) => a.code.localeCompare(b.code));

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <Card className="rounded-2xl shadow-sm border-none bg-white p-8">
      <Flex justifyContent="between" alignItems="center" className="mb-8">
        <Title className="text-xl font-bold text-slate-800">Rate Exchange</Title>
        <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl">
          <input
            type="checkbox"
            id="only-enabled"
            checked={onlyUseEnabled}
            onChange={() => setOnlyUseEnabled(!onlyUseEnabled)}
            className="w-4 h-4 rounded border-slate-300 text-tremor-brand focus:ring-tremor-brand cursor-pointer"
          />
          <label htmlFor="only-enabled" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
            Only enabled
          </label>
        </div>
      </Flex>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="flex-1 w-full">
          <Text className="mb-2 ml-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">From</Text>
          <Select value={fromCurrency} onValueChange={setFromCurrency} className="rounded-xl border-slate-200">
            {(onlyUseEnabled ? enabledCurrenciesSorted : currenciesSorted).map(currency => (
              <SelectItem
                key={`rate-select-from-${currency.code}`}
                value={currency.code}
              >
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <button 
          onClick={handleSwap}
          className="mt-6 p-3 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-tremor-brand hover:border-tremor-brand hover:shadow-md transition-all cursor-pointer"
          title="Swap currencies"
        >
          <HiArrowsRightLeft size={20} />
        </button>

        <div className="flex-1 w-full">
          <Text className="mb-2 ml-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">To</Text>
          <Select value={toCurrency} onValueChange={setToCurrency} className="rounded-xl border-slate-200">
            {(onlyUseEnabled ? enabledCurrenciesSorted : currenciesSorted).map(currency => (
              <SelectItem
                key={`rate-select-to-${currency.code}`}
                value={currency.code}
              >
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Button
          className="md:mt-6 py-2.5 px-8 rounded-xl font-bold bg-tremor-brand hover:bg-tremor-brand-emphasis shadow-lg shadow-blue-100 transition-all cursor-pointer"
          loading={isRateLoading}
          onClick={async () => {
            setIsRateLoading(true);
            try {
              const result = await currencyRepository.getRate(fromCurrency, toCurrency);
              // Directly mapping since the fields are fixed in types/currency.ts
              setRate({
                from: result.from,
                to: result.to,
                rate: result.rate,
                updated_at: result.updated_at
              });
            } catch (e) {
              console.error("Failed to fetch exchange rate", e);
            } finally {
              setIsRateLoading(false);
            }
          }}
        >
          Get Rate
        </Button>
      </div>

      {rate && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100">
          <Table>
            <TableBody>
              <TableRow className="bg-slate-50/50">
                <TableCell className="font-semibold text-slate-600 px-6">Current Rate</TableCell>
                <TableCell className="px-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-800">{formatFloat(rate.rate, 4)}</span>
                    <Text className="text-slate-500 text-sm">
                      (1 {rate.from} = {formatFloat(rate.rate, 2)} {rate.to})
                    </Text>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-600 px-6">Last Updated</TableCell>
                <TableCell className="px-6">
                  <Badge color="slate" size="xs" className="font-mono opacity-80 rounded-md">
                    {formatDate(new Date(rate.updated_at))}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
