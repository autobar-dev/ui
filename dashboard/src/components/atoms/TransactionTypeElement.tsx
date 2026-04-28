import { TransactionType } from "@/types/transaction";
import { Badge } from "@tremor/react";
import { ReactNode } from "react";

export default function TransactionTypeElement({ transaction_type }: {
  transaction_type: TransactionType
}) {
  let element: ReactNode;

  switch (transaction_type) {
    case TransactionType.Deposit:
      element = (
        <Badge color="emerald">Deposit</Badge>
      );
      break;
    case TransactionType.Withdraw:
      element = (
        <Badge color="fuchsia">Withdraw</Badge>
      );
      break;
    case TransactionType.Purchase:
      element = (
        <Badge color="blue">Purchase</Badge>
      );
      break;
    case TransactionType.Refund:
      element = (
        <Badge color="orange">Refund</Badge>
      );
      break;
    case TransactionType.CurrencyChange:
      element = (
        <Badge color="purple">Currency change</Badge>
      );
      break;
  }

  return (
    element
  );
}
