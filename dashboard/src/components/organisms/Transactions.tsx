"use client";

import { Transaction } from "@/types/transaction";
import { Badge, Card, Table, Title, Group, ScrollArea, Box, Text } from "@mantine/core";
import TransactionTypeElement from "../atoms/TransactionTypeElement";
import { formatDate } from "@/utils/misc";

export default function Transactions({ transactions }: {
  transactions: Transaction[],
}) {
  const transactionsSorted = [...transactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const rows = transactionsSorted.map(transaction => (
    <Table.Tr key={transaction.id}>
      <Table.Td>
        <Text size="xs" ff="monospace">
          {transaction.id}
        </Text>
      </Table.Td>
      <Table.Td align="center">
        <TransactionTypeElement transaction_type={transaction.transactionType} />
      </Table.Td>
      <Table.Td align="right">
        <Text size="sm" ff="monospace" fw={700}>
          {transaction.value}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fs="italic">
          {transaction.currencyCode}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" ff="monospace" c="dimmed">
          {formatDate(transaction.createdAt)}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card p="xl" radius={32} shadow="sm" mt="md">
      <Group mb="lg" gap="xs">
        <Title order={3} size="h4" fw={700}>
          Transactions
        </Title>
        <Badge color="gray" variant="light" radius="xl" size="xs">
          {transactions.length}
        </Badge>
      </Group>

      <ScrollArea>
        <Table verticalSpacing="md" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Type</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Value</Table.Th>
              <Table.Th>Currency</Table.Th>
              <Table.Th>Created at</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
