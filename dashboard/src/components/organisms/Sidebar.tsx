"use client";

import SidebarItem from "../atoms/SidebarItem";
import { usePathname } from "next/navigation";
import { HiCube, HiCurrencyDollar, HiUsers } from "react-icons/hi2";
import { ReactNode } from "react";

type SidebarItemContent = {
  path: string,
  label: string,
  icon: ReactNode,
};

const items: SidebarItemContent[] = [
  {
    path: "/users",
    label: "Users",
    icon: (
      <HiUsers className="mr-2 text-xl inline-block" />
    ),
  },
  {
    path: "/modules",
    label: "Modules",
    icon: (
      <HiCube className="mr-2 text-xl inline-block" />
    ),
  },
  {
    path: "/currencies",
    label: "Currencies",
    icon: (
      <HiCurrencyDollar className="mr-2 text-xl inline-block" />
    ),
  },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <nav className="h-full w-64 left-0 bg-white pt-6 px-4 flex flex-col border-r border-slate-100 shadow-sm">
      <div className="space-y-1">
        {items.map(item => (
          <SidebarItem
            path={item.path}
            label={item.label}
            icon={item.icon}
            key={`sidebar-item-${item.path}`}
            active={path.includes(item.path)}
          />
        ))}
      </div>
    </nav>
  );
}
