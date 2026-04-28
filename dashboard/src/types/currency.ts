export type Currency = {
  id: number,
  code: string,
  name: string,
  minor_unit_divisor: number,
  symbol?: string,
  enabled: boolean,
  created_at: string,
};

export type Rate = {
  from: string,
  to: string,
  rate: number,
  updated_at: string,
};
