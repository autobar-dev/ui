"use client";

import { ReactNode } from "react";
import { AppShell, Container } from "@mantine/core";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Shell({ children }: {
  children: ReactNode,
}) {
  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
      }}
      padding="xl"
      styles={{
        main: {
          backgroundColor: '#f8fafc',
        }
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl" pt="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
