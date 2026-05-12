"use client";

import { Card, Table, Title, Text, Group, Button, ScrollArea, Center, Stack, Loader, TextInput, Box, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { ServiceStation } from "@/repositories/ModuleRepository";
import { User } from "@/types/user";

export default function StationsSection() {
  const { moduleRepository, userRepository } = useContext(RepositoriesContext);
  const [stations, setStations] = useState<ServiceStation[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      slug: '',
      owner_id: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      slug: (value) => (value.length < 2 ? 'Slug must have at least 2 letters' : null),
      owner_id: (value) => (!value ? 'Owner is required' : null),
    },
  });

  const loadStations = async () => {
    if (!moduleRepository) return;
    setLoading(true);
    try {
      const data = await moduleRepository.getAllStations();
      setStations(data);
    } catch (err) {
      console.error("Failed to load stations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
    if (userRepository) {
      userRepository.getAll("owner").then(setOwners).catch(err => console.error("Failed to load owners", err));
    }
  }, [moduleRepository, userRepository]);

  const handleCreateStation = async (values: typeof form.values) => {
    if (!moduleRepository) return;
    setCreating(true);
    try {
      await moduleRepository.createStation(values.slug, values.name, values.owner_id);
      form.reset();
      await loadStations();
    } catch (err) {
      console.error("Failed to create station", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading stations...</Text>
        </Stack>
      </Center>
    );
  }

  const rows = stations.map((station) => (
    <Table.Tr key={station.id}>
      <Table.Td align="center">
        <Text size="xs" ff="monospace" fw={300} style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
          {station.id}
        </Text>
      </Table.Td>
      <Table.Td align="center">
        <Text size="sm" fw={500}>{station.name}</Text>
      </Table.Td>
      <Table.Td align="center">
        <Text size="sm" c="dimmed">{station.slug}</Text>
      </Table.Td>
      <Table.Td align="center">
        <Button component={Link} href={`/stations/${station.id}`} variant="light" size="compact-xs" radius="md">
          View Details
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="xl">
      <Card p="xl" radius={32} shadow="sm">
        <Group mb="xl" justify="space-between">
          <Group gap="xs">
            <Title order={3} size="h4" fw={500}>
              Stations
            </Title>
          </Group>
        </Group>

        <ScrollArea>
          <Table verticalSpacing="md" striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center' }}>ID</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Name</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Slug</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={4} align="center">
                    <Text c="dimmed" fs="italic">No stations found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      <Card p="xl" radius={32} shadow="sm">
        <Title order={4} size="h5" fw={500} mb="md">
          Add New Station
        </Title>
        <Box component="form" onSubmit={form.onSubmit(handleCreateStation)}>
          <Group align="flex-end">
            <TextInput
              label="Name"
              placeholder="E.g., Downtown Location"
              {...form.getInputProps('name')}
              required
            />
            <TextInput
              label="Slug"
              placeholder="E.g., downtown-1"
              {...form.getInputProps('slug')}
              required
            />
            <Select
              label="Owner"
              placeholder="Select an owner"
              data={owners.map(u => ({ value: u.id, label: `${u.first_name} ${u.last_name} (${u.email})` }))}
              {...form.getInputProps('owner_id')}
              required
              searchable
            />
            <Button type="submit" loading={creating}>
              Create Station
            </Button>
          </Group>
        </Box>
      </Card>
    </Stack>
  );
}
