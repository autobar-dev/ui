import { CurrencyRepository } from "@/repositories/CurrencyRepository";
import type { Wallet as WalletType } from "@/types/wallet";
import { Card, Flex, Table, TableBody, TableCell, TableRow, Title } from "@tremor/react";

export default async function Wallet({ wallet }: {
  wallet: WalletType,
}) {
  // const currencyRepository = new CurrencyRepository("http://localhost:9000/currency");

  // const serviceCurrency = await currencyRepository.get(wallet.currencyCode);
  // const currency = serviceCurrencyToCurrency(serviceCurrency);

  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Title>Wallet</Title>
      </Flex>

      <Table className="mt-6">
        <TableBody>
          <TableRow>
            <TableCell className="font-bold">Wallet ID</TableCell>
            <TableCell className="font-mono">{wallet.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Balance</TableCell>
            {/* <TableCell className="font-mono">{`${(wallet.balance / currency.minorUnitDivisor).toFixed(Math.log10(currency.minorUnitDivisor))}`}</TableCell> */}
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Currency</TableCell>
            {/* <TableCell className="italic">{`${wallet.currencyCode} (${currency.enabled ? "enabled" : "disabled"})`}</TableCell> */}
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
