"use client";

import { ReactNode } from "react";
import { AppShell, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Shell({ children }: {
  children: ReactNode,
}) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: opened ? 65 : 260,
        breakpoint: 'sm',
      }}
      padding="xl"
      styles={{
        main: {
          backgroundColor: '#f8fafc',
          transition: 'padding-left 300ms ease',
        },
        navbar: {
          transition: 'width 300ms ease',
        }
      }}
    >
      <AppShell.Header>
        <Header collapsed={opened} onToggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar collapsed={opened} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl" pt="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
