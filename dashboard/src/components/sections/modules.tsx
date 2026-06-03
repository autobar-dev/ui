"use client";

import { Badge, Card, Table, Title, Text, Group, Button, ScrollArea, Center, Stack, Loader, Select, Modal, NumberInput, Switch, ActionIcon } from "@mantine/core";
import Link from "next/link";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { serviceModuleToModule } from "@/utils/module_utils";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Module } from "@/types/module";
import { ServiceStation, ServiceDisplayUnit } from "@/repositories/ModuleRepository";
import { Currency } from "@/types/currency";
import { ServiceProduct } from "@/repositories/ProductRepository";

export default function ModulesSection() {
  const { moduleRepository, currencyRepository, productRepository } = useContext(RepositoriesContext);

  const [modules, setModules] = useState<Module[]>([]);
  const [stations, setStations] = useState<ServiceStation[]>([]);
  const [enabledCurrencies, setEnabledCurrencies] = useState<Currency[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [displayUnits, setDisplayUnits] = useState<ServiceDisplayUnit[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Assignment Modal State
  const [assignmentModalModule, setAssignmentModalModule] = useState<Module | null>(null);
  const [assignmentSelectedStation, setAssignmentSelectedStation] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  // Price Modal State
  const [priceModalModule, setPriceModalModule] = useState<Module | null>(null);
  const [priceRows, setPriceRows] = useState<{ code: string; value: number | undefined }[]>([]);
  const [updatingPrices, setUpdatingPrices] = useState(false);

  // Status Confirmation Modal State
  const [statusConfirmModule, setStatusConfirmModule] = useState<{ module: Module, newStatus: boolean } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!moduleRepository || !currencyRepository || !productRepository) {
      return;
    }

    setLoading(true);
    Promise.all([
      moduleRepository.getAll(),
      moduleRepository.getAllStations(),
      currencyRepository.getAllEnabled(),
      productRepository.getAll(),
      moduleRepository.getAllDisplayUnits()
    ])
      .then(([serviceModules, serviceStations, enabledCurrencies, serviceProducts, serviceDisplayUnits]) => {
        const mappedModules = serviceModules.map(serviceModuleToModule);
        setModules(mappedModules);
        setStations(serviceStations);
        setEnabledCurrencies(enabledCurrencies);
        setProducts(serviceProducts);
        setDisplayUnits(serviceDisplayUnits);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load modules, stations, currencies, products and units", err);
        setLoading(false);
      });
  }, [moduleRepository, currencyRepository, productRepository]);

  const handleAssignStation = async () => {
    if (!moduleRepository || !assignmentModalModule || !assignmentSelectedStation) return;
    setAssigning(true);
    try {
      await moduleRepository.addModuleToStation(
        parseInt(assignmentSelectedStation),
        assignmentModalModule.serialNumber
      );
      // Refresh modules
      const serviceModules = await moduleRepository.getAll();
      setModules(serviceModules.map(serviceModuleToModule));
      setAssignmentModalModule(null);
    } catch (err) {
      console.error("Failed to assign station", err);
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignStation = async () => {
    if (!moduleRepository || !assignmentModalModule || !assignmentModalModule.stationId) return;
    setAssigning(true);
    try {
      await moduleRepository.removeModuleFromStation(
        assignmentModalModule.stationId,
        assignmentModalModule.serialNumber
      );
      // Refresh modules
      const serviceModules = await moduleRepository.getAll();
      setModules(serviceModules.map(serviceModuleToModule));
      setAssignmentModalModule(null);
    } catch (err) {
      console.error("Failed to unassign station", err);
    } finally {
      setAssigning(false);
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

      // Refresh modules
      const serviceModules = await moduleRepository.getAll();
      setModules(serviceModules.map(serviceModuleToModule));
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
      // Refresh modules
      const serviceModules = await moduleRepository.getAll();
      setModules(serviceModules.map(serviceModuleToModule));
      setStatusConfirmModule(null);
    } catch (err) {
      console.error("Failed to update module enabled status", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateProduct = async (serialNumber: string, productId: string | null) => {
    if (!moduleRepository) return;
    try {
      await moduleRepository.updateProduct(serialNumber, productId ? parseInt(productId) : null);
      const serviceModules = await moduleRepository.getAll();
      setModules(serviceModules.map(serviceModuleToModule));
    } catch (err) {
      console.error("Failed to update module product", err);
    }
  };

  const handleUpdateUnit = async (serialNumber: string, unitId: string) => {
    if (!moduleRepository) return;
    try {
      await moduleRepository.updateDisplayUnit(serialNumber, parseInt(unitId));
      const serviceModules = await moduleRepository.getAll();
      setModules(serviceModules.map(serviceModuleToModule));
    } catch (err) {
      console.error("Failed to update module display unit", err);
    }
  };

  const handleUpdateCurrency = async (serialNumber: string, currencyCode: string) => {
    if (!moduleRepository) return;
    try {
      await moduleRepository.updateCurrency(serialNumber, currencyCode);
      const serviceModules = await moduleRepository.getAll();
      setModules(serviceModules.map(serviceModuleToModule));
    } catch (err) {
      console.error("Failed to update module currency", err);
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

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading modules...</Text>
        </Stack>
      </Center>
    );
  }

  const filteredModules = selectedStationId
    ? modules.filter(m => m.stationId === parseInt(selectedStationId))
    : modules;

  const rows = filteredModules.map((module) => {
    const stationElement = module.stationId ? (
      <Button 
        variant="light" 
        size="compact-xs" 
        radius="md"
        onClick={() => {
          setAssignmentModalModule(module);
          setAssignmentSelectedStation(module.stationId!.toString());
        }}
      >
        Station {module.stationId}
      </Button>
    ) : (
      <Button 
        color="gray" 
        variant="light" 
        size="compact-xs" 
        radius="md"
        onClick={() => {
          setAssignmentModalModule(module);
          setAssignmentSelectedStation(null);
        }}
      >
        Assign Station
      </Button>
    );

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
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
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
      <Group mb="xl" justify="space-between">
        <Group gap="xs">
          <Title order={3} size="h4" fw={500}>
            Modules
          </Title>
          <Badge color="blue" variant="light" radius="xl" size="xs">
            {filteredModules.length}
          </Badge>
        </Group>

        <Select
          placeholder="Filter by station"
          data={[
            ...stations.map(s => ({ value: s.id.toString(), label: s.name || `Station ${s.id}` }))
          ]}
          value={selectedStationId}
          onChange={(val) => setSelectedStationId(val)}
          clearable
          searchable
          radius="md"
          size="sm"
        />
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

      <Modal 
        opened={!!assignmentModalModule} 
        onClose={() => setAssignmentModalModule(null)} 
        title={`Manage Station Assignment - ${assignmentModalModule?.serialNumber}`}
      >
        <Stack gap="md">
          <Select
            label="Select Station"
            placeholder="Choose a station"
            data={stations.map(s => ({ value: s.id.toString(), label: s.name || `Station ${s.id}` }))}
            value={assignmentSelectedStation}
            onChange={(val) => setAssignmentSelectedStation(val)}
            searchable
          />
          <Group justify="flex-end" mt="md">
            {assignmentModalModule?.stationId && (
              <>
                <Button component={Link} href={`/stations/${assignmentModalModule.stationId}`} variant="light" color="blue">
                  Navigate to Station
                </Button>
                <Button variant="light" color="red" onClick={handleUnassignStation} loading={assigning}>
                  Unassign
                </Button>
              </>
            )}
            <Button onClick={handleAssignStation} loading={assigning} disabled={!assignmentSelectedStation || assignmentSelectedStation === assignmentModalModule?.stationId?.toString()}>
              Save Assignment
            </Button>
          </Group>
        </Stack>
      </Modal>

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
    </Card>
  );
}
