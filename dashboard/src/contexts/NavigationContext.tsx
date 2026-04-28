"use client";

import { createContext } from "react";

type NavigationContextValues = {
  id: number,
  setId: Function,
  sidebarOpen: boolean,
  setSidebarOpen: Function,
};

export const NavigationContext = createContext<NavigationContextValues>({
  id: 0,
  setId: () => { },
  sidebarOpen: false,
  setSidebarOpen: () => { },
});
