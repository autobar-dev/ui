import { Currency } from "@/types/currency";
import { formatDate } from "@/utils/misc";
import { Badge, Card, Flex, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";
import EnableCurrencyButton from "../atoms/EnableCurrencyButton";

export default function CurrenciesTable({ currencies }: {
  currencies: Currency[],
}) {

  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Title>Currencies</Title>
        <Badge color="gray">{currencies.length}</Badge>
      </Flex>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Code</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Symbol</TableHeaderCell>
            <TableHeaderCell>Minor unit</TableHeaderCell>
            <TableHeaderCell>Last updated at</TableHeaderCell>
            <TableHeaderCell>Enabled</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {currencies.map(currency => {
            const symbolElement = currency.symbol ? (
              currency.symbol
            ) : (
              <Badge color="gray">None</Badge>
            );
            const updatedAtElement = formatDate(currency.updatedAt);
            const enabledElement = (
              <EnableCurrencyButton
                checkedInitial={currency.enabled}
                currencyCode={currency.code}
              />
            );

            return (
              <TableRow key={`currency-table-row-${currency.id}`}>
                <TableCell className="italic">{currency.code}</TableCell>
                <TableCell>{currency.name}</TableCell>
                <TableCell className="text-center">{symbolElement}</TableCell>
                <TableCell className="text-center">{currency.minorUnitDivisor}</TableCell>
                <TableCell className="font-mono">{updatedAtElement}</TableCell>
                <TableCell className="text-center">{enabledElement}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
