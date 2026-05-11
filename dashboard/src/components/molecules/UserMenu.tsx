"use client";

/**
 * UI module for the user avatar dropdown menu.
 */
import { useContext } from "react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { Menu, Avatar, UnstyledButton, Group, Text, Box, Badge, Divider } from "@mantine/core";

import { useAuth } from "@/contexts/AuthContext";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { type User } from "@/types/user";
import { type IsValidData } from "@/types/auth";
import { getInitials } from "@/utils/misc";

type UserMenuProps = {
  /**
   * The authenticated user to display in the menu.
   */
  user: User;
  /**
   * The role for styling and labeling.
   */
  role: IsValidData["rol"];
};

/**
 * Renders a user avatar button with a dropdown menu containing user info and actions.
 */
export default function UserMenu({ user, role }: UserMenuProps) {
  const { logout } = useAuth();
  const { authRepository } = useContext(RepositoriesContext);

  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const initials = getInitials(user);
  const roleLabel = role === "admin" ? "Admin" : "User";

  const handleLogout = () => {
    logout(authRepository);
  };

  return (
    <Menu shadow="md" width={240} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }} radius="md">
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            <Avatar
              radius="xl"
              size="md"
              color={role === 'admin' ? 'blue' : 'gray'}
              variant="light"
            >
              {initials}
            </Avatar>
            <Box style={{ flex: 1 }}>
              <Text size="sm" fw={600} visibleFrom="sm">
                {fullName || user.email}
              </Text>
              <Badge
                size="xs"
                variant="light"
                color={role === 'admin' ? 'blue' : 'gray'}
                visibleFrom="sm"
              >
                {roleLabel}
              </Badge>
            </Box>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown p="xs">
        <Box p="xs">
          <Text size="sm" fw={700} c="slate.800">
            {fullName || user.email}
          </Text>
          {fullName && (
            <Text size="xs" c="dimmed">
              {user.email}
            </Text>
          )}
          <Badge
            mt="xs"
            size="sm"
            variant="light"
            color={role === 'admin' ? 'amber' : 'slate'}
          >
            {roleLabel}
          </Badge>
        </Box>

        <Divider my="xs" />

        <Menu.Item
          color="red"
          leftSection={<HiArrowRightOnRectangle size={18} />}
          onClick={handleLogout}
          fw={600}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
