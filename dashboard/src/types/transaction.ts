export enum TransactionType {
  Deposit,
  Withdraw,
  Purchase,
  Refund,
  CurrencyChange,
};

export type Transaction = {
  id: string,
  walletId: number,
  transactionType: TransactionType,
  value: number,
  currencyCode: string,
  createdAt: Date,
};
