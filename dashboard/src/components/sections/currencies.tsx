"use client";

import { Grid } from "@tremor/react";
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
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400 animate-pulse">Loading currencies...</p>
      </div>
    );
  }

  return (
    <Grid numItems={1} className="gap-8">
      <CurrenciesTable currencies={currencies} />
      
      <AddCurrency />
    </Grid>
  );
}
