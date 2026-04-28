"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Shell({ children }: {
  children: ReactNode,
}) {
  return (
    <>
      <Header />
      <div className="flex flex-row mt-20 h-[calc(100vh-5rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
