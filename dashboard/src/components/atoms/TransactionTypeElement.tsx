"use client";

import { TransactionType } from "@/types/transaction";
import { Badge } from "@mantine/core";
import { ReactNode } from "react";

export default function TransactionTypeElement({ transaction_type }: {
  transaction_type: TransactionType
}) {
  let color: string;
  let label: string;

  switch (transaction_type) {
    case TransactionType.Deposit:
      color = "green";
      label = "Deposit";
      break;
    case TransactionType.Withdraw:
      color = "grape";
      label = "Withdraw";
      break;
    case TransactionType.Purchase:
      color = "blue";
      label = "Purchase";
      break;
    case TransactionType.Refund:
      color = "orange";
      label = "Refund";
      break;
    case TransactionType.CurrencyChange:
      color = "violet";
      label = "Currency change";
      break;
    default:
      color = "gray";
      label = "Unknown";
  }

  return (
    <Badge color={color} variant="light" radius="sm">
      {label}
    </Badge>
  );
}
