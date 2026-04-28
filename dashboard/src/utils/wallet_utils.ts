import { ServiceTransaction, ServiceWallet } from "@/repositories/WalletRepository";
import { Transaction, TransactionType } from "@/types/transaction";
import { Wallet } from "@/types/wallet";

export function serviceWalletToWallet(service_wallet: ServiceWallet): Wallet {
  return {
    id: service_wallet.id,
    userEmail: service_wallet.user_email,
    currencyCode: service_wallet.currency_code,
    balance: service_wallet.balance,
  };
}

export function serviceTransactionToTransaction(service_transaction: ServiceTransaction): Transaction {
  let transactionType: TransactionType = TransactionType.Deposit;

  switch (service_transaction.type) {
    case "deposit":
      transactionType = TransactionType.Deposit;
      break;
    case "withdraw":
      transactionType = TransactionType.Withdraw;
      break;
    case "purchase":
      transactionType = TransactionType.Purchase;
      break;
    case "refund":
      transactionType = TransactionType.Refund;
      break;
    case "currency_change":
      transactionType = TransactionType.CurrencyChange;
      break;
  }

  return {
    id: service_transaction.id,
    walletId: service_transaction.wallet_id,
    transactionType,
    value: service_transaction.value,
    currencyCode: service_transaction.currency_code,
    createdAt: new Date(service_transaction.created_at),
  };
}
