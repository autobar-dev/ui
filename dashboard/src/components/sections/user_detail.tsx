"use client";

import { Card, Title, Text, Group, Badge, Center, Stack, Loader, Button, Avatar } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import Link from "next/link";

const ROLES: Record<number, { label: string; color: string }> = {
  1: { label: "User",       color: "blue"   },
  2: { label: "Admin",      color: "red"    },
  3: { label: "Owner",      color: "violet" },
  4: { label: "Maintainer", color: "orange" },
};

export default function UserDetailsSection({ id }: { id: string }) {
  const { userRepository } = useContext(RepositoriesContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userRepository) return;
    setLoading(true);
    userRepository.getUser(id)
      .then(setUser)
      .catch(err => console.error("Failed to load user details", err))
      .finally(() => setLoading(false));
  }, [userRepository, id]);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading user details...</Text>
        </Stack>
      </Center>
    );
  }

  if (!user) {
    return (
      <Center h={400}>
        <Text c="red">User not found</Text>
      </Center>
    );
  }

  const role = ROLES[user.role_id] ?? { label: `Role ${user.role_id}`, color: "gray" };

  return (
    <Stack gap="xl">
      <Group>
        <Button component={Link} href="/users" variant="light" size="sm">
          &larr; Back to Users
        </Button>
      </Group>

      <Card p="xl" radius={32} shadow="sm">
        <Group align="flex-start" gap="xl">
          <Avatar size={120} radius={32} color={role.color} variant="light">
            {user.first_name[0]}{user.last_name[0]}
          </Avatar>
          
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between" align="center">
              <div>
                <Title order={2} size="h3" fw={600}>
                  {user.first_name} {user.last_name}
                </Title>
                <Text c="dimmed">{user.email}</Text>
              </div>
              <Badge size="lg" variant="light" color={role.color} radius="md">
                {role.label}
              </Badge>
            </Group>

            <Group gap="xl" mt="md">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>User ID</Text>
                <Text size="xs" ff="monospace" style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block', marginTop: 4 }}>
                  {user.id}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Locale ID</Text>
                <Text fw={500}>#{user.locale_id}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Joined</Text>
                <Text fw={500}>{new Date(user.created_at).toLocaleDateString()}</Text>
              </div>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Stack>
  );
}
