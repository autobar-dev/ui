"use client";

import { Currency } from "@/types/currency";
import { formatDate } from "@/utils/misc";
import { Badge, Card, Table, Title, Text, Group, Box, ScrollArea } from "@mantine/core";
import EnableCurrencyButton from "../atoms/EnableCurrencyButton";

export default function CurrenciesTable({ currencies }: {
  currencies: Currency[],
}) {
  const rows = currencies.map((currency) => {
    const symbolElement = currency.symbol ? (
      <Text size="sm" fw={500}>
        {currency.symbol}
      </Text>
    ) : (
      <Badge color="gray" variant="light" size="xs" opacity={0.5}>
        None
      </Badge>
    );

    const createdAtElement = currency.created_at ? formatDate(new Date(currency.created_at)) : "N/A";

    return (
      <Table.Tr key={currency.id}>
        <Table.Td>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Badge color="blue" variant="light" radius="md" fw={700}>
              {currency.code}
            </Badge>
          </Box>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={600}>
            {currency.name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            {symbolElement}
          </Box>
        </Table.Td>
        <Table.Td>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Text size="xs" ff="monospace" c="dimmed">
              {currency.minor_unit_divisor} ({1 / currency.minor_unit_divisor})
            </Text>
          </Box>
        </Table.Td>
        <Table.Td>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Text size="xs" ff="monospace" c="dimmed">
              {createdAtElement}
            </Text>
          </Box>
        </Table.Td>
        <Table.Td>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <EnableCurrencyButton
              checkedInitial={currency.enabled}
              currencyCode={currency.code}
            />
          </Box>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card p="xl" radius={32} shadow="sm">
      <Group mb="lg" gap="xs">
        <Title order={3} size="h4" fw={700}>
          Currencies
        </Title>
        <Badge color="blue" variant="light" radius="xl" size="xs">
          {currencies.length}
        </Badge>
      </Group>

      <ScrollArea>
        <Table verticalSpacing="md" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: 'center' }}>Code</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Symbol</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Minor unit</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Created at</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
