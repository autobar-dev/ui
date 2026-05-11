"use client";

import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { Card, Title, TextInput, Text, Group, Button, SimpleGrid, NumberInput } from "@mantine/core";
import { useState, useContext } from "react";
import { HiTag, HiIdentification, HiHashtag, HiCalculator } from "react-icons/hi2";

export default function AddCurrency() {
  const { currencyRepository } = useContext(RepositoriesContext);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [minorUnitDivisor, setMinorUnitDivisor] = useState<number | string>(100);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Placeholder for actual request
      console.log("Creating currency:", { code, name, symbol, minorUnitDivisor: Number(minorUnitDivisor) });
      
      // Reset form
      setCode("");
      setName("");
      setSymbol("");
      setMinorUnitDivisor(100);
      alert(`Currency ${code} added successfully! (Logic placeholder)`);
    } catch (error) {
      console.error("Failed to create currency", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card p="xl" radius={32} shadow="sm">
      <Title order={3} size="h4" fw={500} mb="xl">
        Add New Currency
      </Title>

      <form onSubmit={handleSubmit}>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          <TextInput
            label="Currency Code"
            description="e.g. USD"
            placeholder="USD"
            leftSection={<HiTag size={18} />}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            maxLength={3}
            radius="md"
          />

          <TextInput
            label="Full Name"
            description="e.g. US Dollar"
            placeholder="US Dollar"
            leftSection={<HiIdentification size={18} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            radius="md"
          />

          <TextInput
            label="Symbol"
            description="e.g. $"
            placeholder="$"
            leftSection={<HiHashtag size={18} />}
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            maxLength={5}
            radius="md"
          />

          <NumberInput
            label="Minor Unit Divisor"
            description="e.g. 100"
            placeholder="100"
            leftSection={<HiCalculator size={18} />}
            value={minorUnitDivisor}
            onChange={setMinorUnitDivisor}
            required
            min={1}
            radius="md"
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="xl" pt="xl" style={{ borderTop: '1px solid #f8fafc' }}>
          <Button
            type="submit"
            loading={isLoading}
            size="md"
            radius="xl"
            px={40}
            fw={400}
          >
            Create
          </Button>
        </Group>
      </form>
    </Card>
  );
}
