"use client";

/**
 * Layout module for the application header.
 */
import Logo from "../molecules/Logo";
import UserMenu from "../molecules/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { type User } from "@/types/user";
import { type IsValidData } from "@/types/auth";
import { Group, Box, ActionIcon } from "@mantine/core";
import { HiBars3, HiBars3CenterLeft } from "react-icons/hi2";

/**
 * Renders the dashboard header with user avatar and menu.
 */
export default function Header({ collapsed, onToggle }: {
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const { tokens } = useAuth();
  const { apiClient, authRepository, userRepository } = useContext(RepositoriesContext);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<IsValidData["rol"] | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadUser = async () => {
      try {
        const [userData, validation] = await Promise.all([
          userRepository.whoAmI(),
          authRepository.isTokenValid(tokens?.accessToken || "")
        ]);

        if (!isCancelled) {
          setUser(userData);
          setRole(validation.rol);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to load user info for header", error);
          setUser(null);
          setRole(null);
        }
      }
    };

    loadUser();

    return () => {
      isCancelled = true;
    };
  }, [apiClient, authRepository, userRepository]);

  return (
    <Box h="100%" px="xl" style={{ borderBottom: '1px solid #f1f5f9' }}>
      <Group justify="space-between" h="100%">
        <Group gap="lg">
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            onClick={onToggle}
            size="lg"
            radius="md"
          >
            {collapsed ? <HiBars3 size={24} /> : <HiBars3CenterLeft size={24} />}
          </ActionIcon>
          <Logo withTextClassName="h-10" />
        </Group>

        {user && role && <UserMenu user={user} role={role} />}
      </Group>
    </Box>
  );
}
