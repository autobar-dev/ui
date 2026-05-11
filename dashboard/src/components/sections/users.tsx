import { Title, Text, Stack, Card } from "@mantine/core";

export default async function UsersSection() {
  return (
    <Card p="xl" radius={32} shadow="sm">
      <Stack>
        <Title order={3} size="h4" fw={700}>Users</Title>
        <Text c="dimmed">User management coming soon...</Text>
      </Stack>
    </Card>
  );
}
