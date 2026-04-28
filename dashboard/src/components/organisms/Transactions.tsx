import { Transaction } from "@/types/transaction";
import { Badge, Card, Flex, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";
import TransactionTypeElement from "../atoms/TransactionTypeElement";
import { formatDate } from "@/utils/misc";

export default async function Transactions({ transactions }: {
  transactions: Transaction[],
}) {
  const transactionsSorted = transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <Card className="mt-2">
      <Flex justifyContent="start" className="space-x-2">
        <Title>Transactions</Title>
        <Badge color="gray">{transactions.length}</Badge>
      </Flex>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Id</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Value</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
            <TableHeaderCell>Created at</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactionsSorted.map(transaction => {
            const typeElement = (
              <TransactionTypeElement transaction_type={transaction.transactionType} />
            );

            return (
              <TableRow key={`transaction-table-row-${transaction.id}`}>
                <TableCell className="font-mono">{transaction.id}</TableCell>
                <TableCell className="text-center">{typeElement}</TableCell>
                <TableCell className="font-mono text-right">{transaction.value}</TableCell>
                <TableCell className="italic">{transaction.currencyCode}</TableCell>
                <TableCell className="font-mono">{formatDate(transaction.createdAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
