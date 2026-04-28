export type Currency = {
  id: number,
  code: string,
  name: string,
  minorUnitDivisor: number,
  symbol?: string,
  enabled: boolean,
  createdAt: Date,
  updatedAt: Date,
};

export type EnabledCurrency = {
  code: string,
  name: string,
};

export type Rate = {
  from: string,
  to: string,
  rate: number,
  updatedAt: Date,
};
