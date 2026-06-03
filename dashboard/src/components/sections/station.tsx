"use client";

import { Card, Table, Title, Text, Group, Badge, ScrollArea, Center, Stack, Loader, Button, Select, Modal, NumberInput, Switch, ActionIcon } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { ServiceStation, ServiceDisplayUnit } from "@/repositories/ModuleRepository";
import { Module } from "@/types/module";
import { serviceModuleToModule } from "@/utils/module_utils";
import { Currency } from "@/types/currency";
import { ServiceProduct } from "@/repositories/ProductRepository";
import Link from "next/link";
import { HiPlus, HiTrash } from "react-icons/hi2";

export default function StationDetailsSection({ id }: { id: number }) {
  const { moduleRepository, currencyRepository, productRepository } = useContext(RepositoriesContext);
  
  const [station, setStation] = useState<ServiceStation | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const [enabledCurrencies, setEnabledCurrencies] = useState<Currency[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [displayUnits, setDisplayUnits] = useState<ServiceDisplayUnit[]>([]);

  // Price Modal State
  const [priceModalModule, setPriceModalModule] = useState<Module | null>(null);
  const [priceRows, setPriceRows] = useState<{ code: string; value: number | undefined }[]>([]);
  const [updatingPrices, setUpdatingPrices] = useState(false);

  // Status Confirmation Modal State
  const [statusConfirmModule, setStatusConfirmModule] = useState<{ module: Module, newStatus: boolean } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadData = async () => {
    if (!moduleRepository || !currencyRepository || !productRepository) return;
    setLoading(true);
    try {
      const [stationData, modulesData, curData, prodData, unitData] = await Promise.all([
        moduleRepository.getStation(id),
        moduleRepository.getStationModules(id),
        currencyRepository.getAllEnabled(),
        productRepository.getAll(),
        moduleRepository.getAllDisplayUnits()
      ]);
      setStation(stationData);
      setModules(modulesData.map(serviceModuleToModule));
      setEnabledCurrencies(curData);
      setProducts(prodData);
      setDisplayUnits(unitData);
    } catch (err) {
      console.error("Failed to load station details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [moduleRepository, id]);

  const handleUpdateProduct = async (serialNumber: string, productId: string | null) => {
    if (!moduleRepository) return;
    try {
      await moduleRepository.updateProduct(serialNumber, productId ? parseInt(productId) : null);
      const modulesData = await moduleRepository.getStationModules(id);
      setModules(modulesData.map(serviceModuleToModule));
    } catch (err) {
      console.error("Failed to update module product", err);
    }
  };

  const handleUpdateUnit = async (serialNumber: string, unitId: string) => {
    if (!moduleRepository) return;
    try {
      await moduleRepository.updateDisplayUnit(serialNumber, parseInt(unitId));
      const modulesData = await moduleRepository.getStationModules(id);
      setModules(modulesData.map(serviceModuleToModule));
    } catch (err) {
      console.error("Failed to update module display unit", err);
    }
  };

  const handleUpdateCurrency = async (serialNumber: string, currencyCode: string) => {
    if (!moduleRepository) return;
    try {
      await moduleRepository.updateCurrency(serialNumber, currencyCode);
      const modulesData = await moduleRepository.getStationModules(id);
      setModules(modulesData.map(serviceModuleToModule));
    } catch (err) {
      console.error("Failed to update module currency", err);
    }
  };

  const handleUpdatePrices = async () => {
    if (!moduleRepository || !priceModalModule) return;
    setUpdatingPrices(true);
    try {
      const pricesToUpdate: Record<string, number> = {};
      priceRows.forEach(({ code, value }) => {
        if (code && value !== undefined) {
          const currency = enabledCurrencies.find(c => c.code === code);
          if (currency) {
            pricesToUpdate[code] = Math.round(value * currency.minor_unit_divisor);
          }
        }
      });

      await moduleRepository.updatePrices(priceModalModule.serialNumber, pricesToUpdate);
      const modulesData = await moduleRepository.getStationModules(id);
      setModules(modulesData.map(serviceModuleToModule));
      setPriceModalModule(null);
    } catch (err) {
      console.error("Failed to update prices", err);
    } finally {
      setUpdatingPrices(false);
    }
  };

  const handleToggleEnabled = async () => {
    if (!moduleRepository || !statusConfirmModule) return;
    setUpdatingStatus(true);
    try {
      await moduleRepository.updateEnabled(statusConfirmModule.module.serialNumber, statusConfirmModule.newStatus);
      const modulesData = await moduleRepository.getStationModules(id);
      setModules(modulesData.map(serviceModuleToModule));
      setStatusConfirmModule(null);
    } catch (err) {
      console.error("Failed to update module enabled status", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openPriceModal = (module: Module) => {
    const existing = Array.from(module.prices.entries()).map(([code, rawValue]) => {
      const currency = enabledCurrencies.find(c => c.code === code);
      return {
        code,
        value: currency ? rawValue / currency.minor_unit_divisor : rawValue,
      };
    });
    setPriceRows(existing);
    setPriceModalModule(module);
  };

  const handleUnassignModule = async (serialNumber: string) => {
    if (!moduleRepository) return;
    try {
      await moduleRepository.removeModuleFromStation(id, serialNumber);
      const modulesData = await moduleRepository.getStationModules(id);
      setModules(modulesData.map(serviceModuleToModule));
    } catch (err) {
      console.error("Failed to unassign module", err);
    }
  };

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading station details...</Text>
        </Stack>
      </Center>
    );
  }

  if (!station) {
    return (
      <Center h={400}>
        <Text c="red">Station not found</Text>
      </Center>
    );
  }

  const rows = modules.map((module) => {
    const productElement = (
      <Select
        placeholder="Select product"
        data={[
          { value: "", label: "None" },
          ...products.map(p => ({ value: p.id.toString(), label: p.slug || `Product ${p.id}` }))
        ]}
        value={module.productId ? module.productId.toString() : ""}
        onChange={(val) => handleUpdateProduct(module.serialNumber, val === "" ? null : val)}
        searchable
        size="xs"
        style={{ width: 120 }}
      />
    );

    const unitElement = (
      <Select
        placeholder="Select unit"
        data={displayUnits.map(u => ({ value: u.id.toString(), label: `${u.amount} ${u.symbol}` }))}
        value={module.displayUnit.id.toString()}
        onChange={(val) => { if (val) handleUpdateUnit(module.serialNumber, val); }}
        searchable
        size="xs"
        style={{ width: 100 }}
      />
    );

    const currencyElement = (
      <Select
        placeholder="Select currency"
        data={enabledCurrencies.map(c => ({ value: c.code, label: c.code }))}
        value={module.displayCurrency.code}
        onChange={(val) => { if (val) handleUpdateCurrency(module.serialNumber, val); }}
        searchable
        size="xs"
        style={{ width: 90 }}
      />
    );

    const pricesElement = (
      <Button 
        variant="light" 
        size="compact-xs" 
        radius="md"
        onClick={() => openPriceModal(module)}
      >
        {module.prices.size > 0 ? "See/Edit prices" : "Set prices"}
      </Button>
    );

    const statusElement = (
      <Switch
        checked={module.enabled}
        onChange={(event) => setStatusConfirmModule({ module, newStatus: event.currentTarget.checked })}
        color="green"
        size="sm"
        onLabel="ON"
        offLabel="OFF"
      />
    );

    return (
      <Table.Tr key={module.serialNumber}>
        <Table.Td align="center">
          <Link href={`/modules/${module.serialNumber}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Text 
              size="xs" 
              ff="monospace" 
              fw={500} 
              style={{ 
                backgroundColor: 'var(--color-brand-faint)', 
                color: 'var(--color-brand-emphasis)', 
                padding: '4px 8px', 
                borderRadius: '6px', 
                border: '1px solid var(--color-brand-muted)', 
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:scale-105 hover:shadow-xs"
            >
              {module.serialNumber}
            </Text>
          </Link>
        </Table.Td>
        <Table.Td align="center">{productElement}</Table.Td>
        <Table.Td align="center">{unitElement}</Table.Td>
        <Table.Td align="center">{currencyElement}</Table.Td>
        <Table.Td align="center">{pricesElement}</Table.Td>
        <Table.Td align="center">{statusElement}</Table.Td>
        <Table.Td align="center">
          <ActionIcon color="red" variant="subtle" onClick={() => handleUnassignModule(module.serialNumber)}>
            <HiTrash size={16} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="xl">
      <Group>
        <Button component={Link} href="/stations" variant="light" size="sm">
          &larr; Back to Stations
        </Button>
      </Group>

      <Card p="xl" radius={32} shadow="sm">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} size="h3" fw={600}>
                {station.name || "Unnamed Station"}
              </Title>
              <Text c="dimmed" size="sm" mt={4}>Manage modules and configuration for this station</Text>
            </div>
            <Badge size="lg" variant="light" color="blue" radius="md">
              {station.slug}
            </Badge>
          </Group>
          
          <Group gap="xl" mt="md">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Station ID</Text>
              <Text fw={500}>{station.id}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Owner</Text>
              {station.owner_id ? (
                <Link href={`/users/${station.owner_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Text fw={500} style={{ cursor: 'pointer' }}>{station.owner_id}</Text>
                </Link>
              ) : (
                <Text fw={500}>No owner</Text>
              )}
            </div>
          </Group>
        </Stack>
      </Card>

      <Card p="xl" radius={32} shadow="sm">
        <Group mb="xl" justify="space-between">
          <Group gap="xs">
            <Title order={3} size="h4" fw={500}>
              Assigned Modules
            </Title>
            <Badge color="blue" variant="light" radius="xl" size="xs">
              {modules.length}
            </Badge>
          </Group>
        </Group>

        <ScrollArea>
          <Table verticalSpacing="md" striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center' }}>Serial number</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Product</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Unit</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Currency</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Prices</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={7} align="center">
                    <Text c="dimmed" fs="italic">No modules assigned to this station.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      <Modal
        opened={!!priceModalModule}
        onClose={() => setPriceModalModule(null)}
        title={`Edit Pricing — ${priceModalModule?.serialNumber}`}
        size="lg"
      >
        <Stack gap="md">
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Currency</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {priceRows.map((row, i) => {
                const usedCodes = priceRows.map(r => r.code).filter((_, j) => j !== i);
                const availableCurrencies = enabledCurrencies.filter(c => !usedCodes.includes(c.code));
                const currency = enabledCurrencies.find(c => c.code === row.code);
                const decimals = currency ? Math.log10(currency.minor_unit_divisor) : 2;

                return (
                  <Table.Tr key={`price-row-${i}`}>
                    <Table.Td>
                      <Select
                        data={availableCurrencies.map(c => ({ value: c.code, label: `${c.code} — ${c.name}` }))}
                        value={row.code || null}
                        onChange={(val) => setPriceRows(prev => prev.map((r, j) => j === i ? { ...r, code: val || "" } : r))}
                        placeholder="Select currency"
                        searchable
                        size="sm"
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        value={row.value}
                        onChange={(val) => setPriceRows(prev => prev.map((r, j) => j === i ? { ...r, value: typeof val === 'number' ? val : undefined } : r))}
                        placeholder="0.00"
                        decimalScale={decimals}
                        fixedDecimalScale
                        min={0}
                        size="sm"
                        rightSection={<Text size="xs" c="dimmed">{row.code || ""}</Text>}
                      />
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => setPriceRows(prev => prev.filter((_, j) => j !== i))}
                      >
                        <HiTrash size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>

          {priceRows.length < enabledCurrencies.length && (
            <Button
              leftSection={<HiPlus size={14} />}
              variant="light"
              size="xs"
              onClick={() => setPriceRows(prev => [...prev, { code: "", value: undefined }])}
            >
              Add currency
            </Button>
          )}

          <Group justify="flex-end" mt="sm">
            <Button variant="light" color="gray" onClick={() => setPriceModalModule(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePrices} loading={updatingPrices}>
              Save Prices
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!statusConfirmModule}
        onClose={() => setStatusConfirmModule(null)}
        title={`Confirm Status Change`}
        size="sm"
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to <strong>{statusConfirmModule?.newStatus ? "enable" : "disable"}</strong> module {statusConfirmModule?.module.serialNumber}?
          </Text>
          <Group justify="flex-end">
            <Button variant="light" color="gray" onClick={() => setStatusConfirmModule(null)}>
              Cancel
            </Button>
            <Button color={statusConfirmModule?.newStatus ? "green" : "red"} onClick={handleToggleEnabled} loading={updatingStatus}>
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
