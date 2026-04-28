"use client";

import { CurrencyRepository } from "@/repositories/CurrencyRepository";
import { Button } from "@tremor/react";
import { useState } from "react";

export default function EnableCurrencyButton({ className, checkedInitial, currencyCode }: {
  className?: string,
  checkedInitial: boolean,
  currencyCode: string,
}) {
  const currencyRepository = new CurrencyRepository("http://localhost:9000/currency");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(checkedInitial);

  const generalClassName = `border-none ${className}`;
  const checkedClassName = "bg-emerald-600 hover:bg-emerald-800";
  const uncheckedClassName = "bg-red-500 hover:bg-red-700";

  return (
    <Button
      className={`${generalClassName} ${checked ? checkedClassName : uncheckedClassName}`}
      onClick={async () => {
        setIsLoading(true);

        const targetValue = !checked;
        try {
          await currencyRepository.setCurrencyEnabled(currencyCode, targetValue);
          setChecked(targetValue);
        } catch (e) { }

        setIsLoading(false);
      }}
      loading={isLoading}
    >{checked ? "Enabled" : "Disabled"}</Button>
  );
}
