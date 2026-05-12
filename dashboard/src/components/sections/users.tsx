"use client";

import { Badge, Card, Table, Title, Text, Group, ScrollArea, Center, Stack, Loader, Select } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types/user";

type Locale = {
  id: number;
  code: string;
  name: string;
  name_localized: string;
};

const ROLES: Record<number, { label: string; color: string }> = {
  1: { label: "User",       color: "blue"   },
  2: { label: "Admin",      color: "red"    },
  3: { label: "Owner",      color: "violet" },
  4: { label: "Maintainer", color: "orange" },
};

export default function UsersSection() {
  const { userRepository, apiClient } = useContext(RepositoriesContext);
  const [users, setUsers] = useState<User[]>([]);
  const [localeMap, setLocaleMap] = useState<Map<number, Locale>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userRepository || !apiClient) return;
    setLoading(true);

    userRepository.getAll()
      .then(async (data) => {
        setUsers(data);

        // Deduplicate locale_ids and fetch each once
        const uniqueLocaleIds = [...new Set(data.map(u => u.locale_id))];
        const localeEntries = await Promise.all(
          uniqueLocaleIds.map(id =>
            apiClient.get<Locale>(`/user/locale?id=${id}`)
              .then(locale => [id, locale] as [number, Locale])
              .catch(() => null)
          )
        );

        const map = new Map<number, Locale>();
        for (const entry of localeEntries) {
          if (entry) map.set(entry[0], entry[1]);
        }
        setLocaleMap(map);
      })
      .catch(err => console.error("Failed to load users", err))
      .finally(() => setLoading(false));
  }, [userRepository, apiClient]);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading users...</Text>
        </Stack>
      </Center>
    );
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    if (!userRepository) return;
    try {
      await userRepository.updateRole(userId, role);
      // Refresh users
      const data = await userRepository.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Failed to update user role", err);
    }
  };

  const rows = users.map((user) => {
    const role = ROLES[user.role_id] ?? { label: `Role ${user.role_id}`, color: "gray" };
    const locale = localeMap.get(user.locale_id);

    return (
      <Table.Tr key={user.id}>
        <Table.Td align="center">
          <Link href={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
            <Text size="xs" ff="monospace" fw={300} style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block', color: 'inherit' }}>
              {user.id}
            </Text>
          </Link>
        </Table.Td>
        <Table.Td align="center">
          <Text size="sm" fw={400}>{user.first_name} {user.last_name}</Text>
        </Table.Td>
        <Table.Td align="center">
          <Text size="sm" c="dimmed">{user.email}</Text>
        </Table.Td>
        <Table.Td align="center">
          <Select
            data={Object.values(ROLES).map(r => ({ value: r.label.toLowerCase(), label: r.label }))}
            value={role.label.toLowerCase()}
            onChange={(val) => { if (val) handleUpdateRole(user.id, val) }}
            size="xs"
            radius="sm"
            styles={{
              input: {
                backgroundColor: 'transparent',
                color: `var(--mantine-color-${role.color}-filled)`,
                fontWeight: 600,
                textAlign: 'center',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }
            }}
            variant="unstyled"
          />
        </Table.Td>
        <Table.Td align="center">
          {locale ? (
            <Group gap="xs" justify="center">
              <Text size="xs" ff="monospace" fw={300} style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                {locale.code}
              </Text>
              <Text size="sm" c="dimmed">{locale.name}</Text>
            </Group>
          ) : (
            <Text size="xs" c="dimmed">#{user.locale_id}</Text>
          )}
        </Table.Td>
        <Table.Td align="center">
          <Text size="xs" c="dimmed">{new Date(user.created_at).toLocaleDateString()}</Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card p="xl" radius={32} shadow="sm">
      <Group mb="xl" gap="xs">
        <Title order={3} size="h4" fw={500}>
          Users
        </Title>
        <Badge color="blue" variant="light" radius="xl" size="xs">
          {users.length}
        </Badge>
      </Group>

      <ScrollArea>
        <Table verticalSpacing="md" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: 'center' }}>ID</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Name</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Email</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Role</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Locale</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Joined</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={6} align="center">
                  <Text c="dimmed" fs="italic">No users found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
