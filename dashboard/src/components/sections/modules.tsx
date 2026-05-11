"use client";

import { Badge, Card, Table, Title, Text, Group, Button, ScrollArea, Center, Stack, Loader } from "@mantine/core";
import { serviceModuleToModule } from "@/utils/module_utils";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Module } from "@/types/module";

export default function ModulesSection() {
  const { moduleRepository } = useContext(RepositoriesContext);

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleRepository) {
      return;
    }

    setLoading(true);
    moduleRepository.getAll()
      .then(serviceModules => {
        const mappedModules = serviceModules.map(serviceModuleToModule);
        setModules(mappedModules);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load modules", err);
        setLoading(false);
      });
  }, [moduleRepository]);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={500}>Loading modules...</Text>
        </Stack>
      </Center>
    );
  }

  const rows = modules.map((module) => {
    const stationElement = module.stationId ? (
      <Button variant="light" size="compact-xs" radius="md">
        Station {module.stationId}
      </Button>
    ) : (
      <Badge color="gray" variant="light" size="xs">None</Badge>
    );

    const productElement = module.productId ? (
      <Button variant="light" size="compact-xs" radius="md">
        Product {module.productId}
      </Button>
    ) : (
      <Badge color="gray" variant="light" size="xs">None</Badge>
    );

    const unitElement = (
      <Text size="sm" fw={500}>
        {module.displayUnit.amount} {module.displayUnit.symbol}
      </Text>
    );

    const currencyElement = (
      <Badge color="blue" variant="light" radius="md" fw={700}>
        {module.displayCurrency.code}
      </Badge>
    );

    const pricesElement = module.prices.size > 0 ? (
      <Button variant="light" size="compact-xs" radius="md">
        See prices
      </Button>
    ) : (
      <Badge color="gray" variant="light" size="xs">None</Badge>
    );

    const statusElement = module.enabled ? (
      <Badge color="green" variant="light" radius="sm">ENABLED</Badge>
    ) : (
      <Badge color="red" variant="light" radius="sm">DISABLED</Badge>
    );

    return (
      <Table.Tr key={module.serialNumber}>
        <Table.Td align="center">
          <Text size="xs" ff="monospace" fw={600} style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
            {module.serialNumber}
          </Text>
        </Table.Td>
        <Table.Td align="center">{stationElement}</Table.Td>
        <Table.Td align="center">{productElement}</Table.Td>
        <Table.Td align="center">{unitElement}</Table.Td>
        <Table.Td align="center">{currencyElement}</Table.Td>
        <Table.Td align="center">{pricesElement}</Table.Td>
        <Table.Td align="center">{statusElement}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card p="xl" radius={32} shadow="sm">
      <Group mb="xl" gap="xs">
        <Title order={3} size="h4" fw={700}>
          Modules
        </Title>
        <Badge color="blue" variant="light" radius="xl" size="xs">
          {modules.length}
        </Badge>
      </Group>

      <ScrollArea>
        <Table verticalSpacing="md" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: 'center' }}>Serial number</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Station</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Product</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Unit</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Currency</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Prices</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
