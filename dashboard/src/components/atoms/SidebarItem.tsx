"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { SidebarItemContent } from "../organisms/Sidebar";

export default function SidebarItem({ item, active, currentPath }: {
  item: SidebarItemContent,
  active: boolean,
  currentPath: string,
}) {
  const isDirectlyActive = currentPath === item.path;
  const hasActiveChild = item.children?.some(c => currentPath === c.path) ?? false;
  
  const hasChildren = item.children && item.children.length > 0;

  // Base classes for the parent item
  const baseClassName = "w-full flex flex-row justify-start items-center px-6 py-3 mt-2 rounded-xl transition-all duration-200 font-bold";
  
  let itemClassName = "";
  if (isDirectlyActive) {
    // Directly active: Solid bright blue background with white text
    itemClassName = `${baseClassName} bg-[#3B82F6] text-white shadow-md shadow-blue-100`;
  } else if (hasActiveChild) {
    // Parent of an active child: Light blue background with blue text
    itemClassName = `${baseClassName} bg-[#EFF6FF] text-[#3B82F6]`;
  } else {
    // Inactive: Transparent background with gray text
    itemClassName = `${baseClassName} bg-transparent text-slate-600 hover:bg-slate-50`;
  }

  return (
    <div>
      <Link href={item.path} className={itemClassName}>
        <span className="flex items-center">
          {item.icon}
          <span className="inline-block ml-4">{item.label}</span>
        </span>
      </Link>

      {hasChildren && (
        <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-100 pl-2">
          {item.children!.map((child) => {
            const isChildActive = currentPath === child.path;
            
            // Sub-item styles
            const childBaseClass = "w-full flex flex-row justify-start items-center px-4 py-2 mt-1 rounded-lg transition-all duration-200 text-sm font-bold";
            const childActiveStyle = "bg-[#3B82F6] text-white shadow-md shadow-blue-100";
            const childInactiveStyle = "bg-transparent text-slate-500 hover:bg-slate-50";

            return (
              <Link 
                href={child.path} 
                key={`child-${child.path}`} 
                className={`${childBaseClass} ${isChildActive ? childActiveStyle : childInactiveStyle}`}
              >
                <span className={isChildActive ? "opacity-100" : "opacity-70"}>{child.icon}</span>
                <span className="inline-block ml-3">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
