"use client";

import { Stack, Center, Loader, Text } from "@mantine/core";
import CurrenciesTable from "../organisms/CurrenciesTable";
import AddCurrency from "../organisms/AddCurrency";
import { useContext, useEffect, useState } from "react";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { Currency } from "@/types/currency";

export default function CurrenciesSection() {
  const { currencyRepository } = useContext(RepositoriesContext);

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    currencyRepository.getAll().then((data) => {
      setCurrencies(data);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load currencies", err);
      setLoading(false);
    });
  }, [currencyRepository]);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading currencies...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      <CurrenciesTable currencies={currencies} />
      <AddCurrency />
    </Stack>
  );
}
