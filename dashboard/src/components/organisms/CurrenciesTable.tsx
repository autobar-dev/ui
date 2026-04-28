"use client";

import { Currency } from "@/types/currency";
import { formatDate } from "@/utils/misc";
import { Badge, Card, Flex, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title, Text } from "@tremor/react";
import EnableCurrencyButton from "../atoms/EnableCurrencyButton";

export default function CurrenciesTable({ currencies }: {
  currencies: Currency[],
}) {
  return (
    <Card className="rounded-2xl shadow-sm border-none bg-white">
      <Flex justifyContent="start" alignItems="center" className="space-x-3 mb-6">
        <Title className="text-xl font-bold text-slate-800">Currencies</Title>
        <Badge size="xs" color="blue" className="rounded-full px-2.5">
          {currencies.length}
        </Badge>
      </Flex>

      <Table>
        <TableHead>
          <TableRow className="border-b border-slate-100">
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Code</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider">Name</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Symbol</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Minor unit</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Created at</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Status</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {currencies.map((currency, index) => {
            const symbolElement = currency.symbol ? (
              <Text className="font-medium text-slate-700">{currency.symbol}</Text>
            ) : (
              <Badge color="slate" size="xs" className="opacity-50">None</Badge>
            );

            const createdAtElement = currency.created_at ? formatDate(new Date(currency.created_at)) : "N/A";

            const enabledElement = (
              <EnableCurrencyButton
                checkedInitial={currency.enabled}
                currencyCode={currency.code}
              />
            );

            // Alternate background color logic
            const rowBgClass = index % 2 === 1 ? "bg-slate-50/50" : "bg-transparent";

            return (
              <TableRow key={`currency-table-row-${currency.id}`} className={`${rowBgClass} hover:bg-slate-100/50 transition-colors`}>
                <TableCell className="text-center">
                  <Badge color="blue" size="xs" className="font-mono px-2 rounded-md">
                    {currency.code}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Text className="font-medium text-slate-800">{currency.name}</Text>
                </TableCell>
                <TableCell className="text-center">
                  {symbolElement}
                </TableCell>
                <TableCell className="text-center font-mono text-slate-600">
                  {currency.minor_unit_divisor} ({1 / currency.minor_unit_divisor})
                </TableCell>
                <TableCell className="text-center">
                  <Text className="text-slate-500 text-xs font-mono">{createdAtElement}</Text>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {enabledElement}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
