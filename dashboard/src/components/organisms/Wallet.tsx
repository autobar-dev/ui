"use client";

import type { Wallet as WalletType } from "@/types/wallet";
import { Card, Table, Title, Text, Group, Box } from "@mantine/core";

export default function Wallet({ wallet }: {
  wallet: WalletType,
}) {
  return (
    <Card p="xl" radius={32} shadow="sm">
      <Group mb="lg">
        <Title order={3} size="h4" fw={500}>
          Wallet
        </Title>
      </Group>

      <Table verticalSpacing="md">
        <Table.Tbody>
          <Table.Tr>
            <Table.Td fw={400} w={120}>Wallet ID</Table.Td>
            <Table.Td>
              <Text size="sm" ff="monospace">
                {wallet.id}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td fw={400}>Balance</Table.Td>
            <Table.Td>
              <Text size="sm" ff="monospace">
                {/* Balance formatting logic here if needed */}
                {wallet.balance}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td fw={400}>Currency</Table.Td>
            <Table.Td>
              <Text size="sm" fs="italic">
                {wallet.currencyCode}
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
