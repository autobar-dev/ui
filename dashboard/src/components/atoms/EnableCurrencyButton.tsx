"use client";

import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { Button } from "@mantine/core";
import { useState, useContext } from "react";

export default function EnableCurrencyButton({ className, checkedInitial, currencyCode }: {
  className?: string,
  checkedInitial: boolean,
  currencyCode: string,
}) {
  const { currencyRepository } = useContext(RepositoriesContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(checkedInitial);

  const handleToggle = async () => {
    const targetValue = !checked;
    const action = targetValue ? "enable" : "disable";
    
    const confirmed = window.confirm(`Are you sure you want to ${action} ${currencyCode}?`);
    
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await currencyRepository.setCurrencyEnabled(currencyCode, targetValue);
      setChecked(targetValue);
    } catch (e) { 
      console.error("Failed to update currency status", e);
      alert(`Failed to ${action} currency. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={className}
      onClick={handleToggle}
      loading={isLoading}
      size="xs"
      radius="sm"
      variant="light"
      color={checked ? "green" : "gray"}
      fw={400}
    >
      {checked ? "Enabled" : "Disabled"}
    </Button>
  );
}
