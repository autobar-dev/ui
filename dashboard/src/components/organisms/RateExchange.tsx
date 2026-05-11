"use client";

import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { Currency, Rate } from "@/types/currency";
import { formatDate, formatFloat } from "@/utils/misc";
import { Button, Card, Select, Title, Text, Table, Badge, Group, ActionIcon, Checkbox, Box, Stack, Paper } from "@mantine/core";
import { useState, useContext } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";

export default function RateExchange({ enabledCurrencies, currencies }: {
  enabledCurrencies: Currency[],
  currencies: Currency[],
}) {
  const { currencyRepository } = useContext(RepositoriesContext);

  const [onlyUseEnabled, setOnlyUseEnabled] = useState<boolean>(true);
  const [fromCurrency, setFromCurrency] = useState<string | null>(enabledCurrencies.length > 0 ? enabledCurrencies[0].code : null);
  const [toCurrency, setToCurrency] = useState<string | null>(enabledCurrencies.length > 0 ? enabledCurrencies[0].code : null);

  const [isRateLoading, setIsRateLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<Rate | undefined>(undefined);

  const currenciesSorted = [...currencies].sort((a, b) => a.code.localeCompare(b.code));
  const enabledCurrenciesSorted = [...enabledCurrencies].sort((a, b) => a.code.localeCompare(b.code));

  const selectData = (onlyUseEnabled ? enabledCurrenciesSorted : currenciesSorted).map(c => ({
    value: c.code,
    label: `${c.code} - ${c.name}`
  }));

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const fetchRate = async () => {
    if (!fromCurrency || !toCurrency) return;
    setIsRateLoading(true);
    try {
      const result = await currencyRepository.getRate(fromCurrency, toCurrency);
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
  };

  return (
    <Card p="xl" radius={32} shadow="sm">
      <Group justify="space-between" mb="xl">
        <Title order={3} size="h4" fw={700}>
          Rate Exchange
        </Title>
        <Box bg="slate.50" px="md" py="xs" style={{ borderRadius: '12px' }}>
          <Checkbox
            label="Only enabled"
            checked={onlyUseEnabled}
            onChange={(event) => setOnlyUseEnabled(event.currentTarget.checked)}
            size="sm"
            fw={500}
          />
        </Box>
      </Group>

      <Paper bg="gray.0" p="lg" radius="xl" style={{ border: '1px solid #f1f5f9' }}>
        <Group align="flex-end" gap="md">
          <Select
            label="From"
            placeholder="Select currency"
            data={selectData}
            value={fromCurrency}
            onChange={setFromCurrency}
            flex={1}
            radius="md"
            searchable
          />

          <ActionIcon 
            onClick={handleSwap}
            variant="default"
            size="xl"
            radius="xl"
            mb={2}
            style={{ border: '1px solid #e2e8f0' }}
          >
            <HiArrowsRightLeft size={20} />
          </ActionIcon>

          <Select
            label="To"
            placeholder="Select currency"
            data={selectData}
            value={toCurrency}
            onChange={setToCurrency}
            flex={1}
            radius="md"
            searchable
          />

          <Button
            loading={isRateLoading}
            onClick={fetchRate}
            size="md"
            radius="md"
            mb={2}
            px={24}
            fw={700}
            style={{ boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.2)' }}
          >
            Get Rate
          </Button>
        </Group>
      </Paper>

      {rate && (
        <Box mt="xl" style={{ border: '1px solid #f1f5f9', borderRadius: '24px', overflow: 'hidden' }}>
          <Table verticalSpacing="md" horizontalSpacing="xl">
            <Table.Tbody>
              <Table.Tr style={{ backgroundColor: '#f8fafc' }}>
                <Table.Td fw={600} w={180}>Current Rate</Table.Td>
                <Table.Td>
                  <Group gap="xs" align="baseline">
                    <Text size="xl" fw={800} c="blue.6">
                      {formatFloat(rate.rate, 4)}
                    </Text>
                    <Text size="sm" c="dimmed">
                      (1 {rate.from} = {formatFloat(rate.rate, 2)} {rate.to})
                    </Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={600}>Last Updated</Table.Td>
                <Table.Td>
                  <Badge color="gray" variant="light" radius="sm" ff="monospace">
                    {formatDate(new Date(rate.updated_at))}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
      )}
    </Card>
  );
}
