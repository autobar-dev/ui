"use client";

import { usePathname, useRouter } from "next/navigation";
import { HiCube, HiCurrencyDollar, HiUsers, HiCpuChip, HiTag } from "react-icons/hi2";
import { ReactNode } from "react";
import { NavLink, Box, ScrollArea, Tooltip } from "@mantine/core";

export type SidebarItemContent = {
  path: string,
  label: string,
  icon: ReactNode,
  children?: SidebarItemContent[],
};

const items: SidebarItemContent[] = [
  {
    path: "/users",
    label: "Users",
    icon: <HiUsers size={20} />,
  },
  {
    path: "/products",
    label: "Products",
    icon: <HiTag size={20} />,
  },
  {
    path: "/modules",
    label: "Modules",
    icon: <HiCube size={20} />,
    children: [
      {
        path: "/modules/firmware",
        label: "Firmware",
        icon: <HiCpuChip size={20} />,
      }
    ]
  },
  {
    path: "/currencies",
    label: "Currencies",
    icon: <HiCurrencyDollar size={20} />,
  },
];

export default function Sidebar({ collapsed }: { collapsed?: boolean; }) {
  const pathname = usePathname();
  const router = useRouter();

  const renderItem = (item: SidebarItemContent) => {
    const active = pathname === item.path || (item.children?.some(c => pathname === c.path) ?? false);

    const navLink = (
      <NavLink
        key={item.path}
        label={collapsed ? null : item.label}
        leftSection={item.icon}
        active={active}
        onClick={() => {
          router.push(item.path);
        }}
        childrenOffset={28}
        variant="filled"
        opened={collapsed ? false : undefined}
        styles={{
          root: {
            borderRadius: '12px',
            marginBottom: '4px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0 12px' : 'var(--mantine-spacing-sm) var(--mantine-spacing-md)',
            height: collapsed ? '44px' : 'auto',
          },
          label: {
            fontWeight: 400,
            display: collapsed ? 'none' : 'block',
          },
          section: {
            margin: collapsed ? 0 : undefined,
          },
          chevron: {
            display: collapsed ? 'none' : 'block',
          }
        }}
      >
        {!collapsed && item.children?.map(child => (
          <NavLink
            key={child.path}
            label={child.label}
            leftSection={child.icon}
            active={pathname === child.path}
            onClick={() => router.push(child.path)}
            styles={{
              root: {
                borderRadius: '12px',
                marginBottom: '4px',
              },
              label: {
                fontWeight: 300,
              }
            }}
          />
        ))}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path} label={item.label} position="right" withArrow offset={10}>
          {navLink}
        </Tooltip>
      );
    }

    return navLink;
  };

  return (
    <Box h="100%" p={collapsed ? "xs" : "md"} style={{ borderRight: '1px solid #f1f5f9', transition: 'padding 300ms ease' }}>
      <ScrollArea h="100%">
        {items.map(renderItem)}
      </ScrollArea>
    </Box>
  );
}
