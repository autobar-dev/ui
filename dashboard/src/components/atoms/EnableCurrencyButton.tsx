"use client";

import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { Button } from "@tremor/react";
import { useState, useContext } from "react";

export default function EnableCurrencyButton({ className, checkedInitial, currencyCode }: {
  className?: string,
  checkedInitial: boolean,
  currencyCode: string,
}) {
  const { currencyRepository } = useContext(RepositoriesContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(checkedInitial);

  const generalClassName = `border-none rounded-lg text-xs font-bold py-1 px-3 transition-all duration-200 ${className}`;
  const checkedClassName = "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-100";
  const uncheckedClassName = "bg-slate-200 hover:bg-slate-300 text-slate-600";

  const handleToggle = async () => {
    const targetValue = !checked;
    const action = targetValue ? "enable" : "disable";
    
    // Using confirm as it's the standard for confirmation dialogs.
    // If the user strictly meant prompt, they can clarify.
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
      className={`${generalClassName} ${checked ? checkedClassName : uncheckedClassName}`}
      onClick={handleToggle}
      loading={isLoading}
      size="xs"
    >
      {checked ? "Enabled" : "Disabled"}
    </Button>
  );
}
