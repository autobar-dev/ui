import { Button } from "@tremor/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function SidebarItem({ path, label, icon, active }: {
  path: string,
  label: string,
  icon: ReactNode,
  active: boolean,
}) {
  const generalClassName = "w-full flex flex-row justify-start px-6 py-3 mt-2 border-none rounded-xl transition-all duration-200";
  const activeClassName = "bg-tremor-brand text-white shadow-md shadow-blue-100";
  const inactiveClassName = "bg-transparent text-slate-600 hover:bg-slate-100";

  return (
    <Link href={path}>
      <Button
        className={`${generalClassName} ${active ? activeClassName : inactiveClassName}`}
        variant={active ? "primary" : "secondary"}
      >
        {icon}
        <span className="inline-block ml-4 font-medium">{label}</span>
      </Button>
    </Link>
  );
}
