export type Module = {
  id: number,
  serialNumber: string,
  stationSlug?: string,
  productSlug?: string,
  prices: Map<string, number>,
  createdAt: Date,
};
