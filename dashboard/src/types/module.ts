import { Currency } from "./currency";

export type Module = {
  id: number,
  serialNumber: string,
  stationId?: number,
  productId?: number,
  enabled: boolean,
  prices: Map<string, number>,
  displayCurrency: Currency,
  displayUnit: {
    id: number,
    amount: number,
    symbol: string,
    divisorFromMillilitres: number,
    decimalsDisplayed: number,
    createdAt: Date,
    updatedAt?: Date,
  },
  createdAt: Date,
  updatedAt: Date,
};
