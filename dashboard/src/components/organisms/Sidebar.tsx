"use client";

import { usePathname, useRouter } from "next/navigation";
import { HiCube, HiCurrencyDollar, HiUsers, HiCpuChip, HiTag } from "react-icons/hi2";
import { ReactNode } from "react";
import { NavLink, Box, ScrollArea } from "@mantine/core";

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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const renderItem = (item: SidebarItemContent) => {
    const active = pathname === item.path || (item.children?.some(c => pathname === c.path) ?? false);

    return (
      <NavLink
        key={item.path}
        label={item.label}
        leftSection={item.icon}
        active={active}
        onClick={() => {
          if (!item.children) {
            router.push(item.path);
          }
        }}
        childrenOffset={28}
        variant="filled"
        styles={{
          root: {
            borderRadius: '12px',
            marginBottom: '4px',
          },
          label: {
            fontWeight: 600,
          }
        }}
      >
        {item.children?.map(child => (
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
                fontWeight: 500,
              }
            }}
          />
        ))}
      </NavLink>
    );
  };

  return (
    <Box h="100%" p="md" style={{ borderRight: '1px solid #f1f5f9' }}>
      <ScrollArea h="100%">
        {items.map(renderItem)}
      </ScrollArea>
    </Box>
  );
}
