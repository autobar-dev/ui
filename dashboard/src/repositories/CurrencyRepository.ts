export type ServiceEnabledCurrency = {
  code: string,
  name: string,
};

export type ServiceCurrency = {
  id: number,
  code: string,
  name: string,
  minor_unit_divisor: number,
  symbol: string | null,
  enabled: boolean,
  created_at: string,
  updated_at: string,
};

export type ServiceRate = {
  from: string,
  to: string,
  rate: number,
  updated_at: string,
};

export class CurrencyRepository {
  private service_url: string;

  constructor(url: string) {
    this.service_url = url;
  }

  async get(code: string): Promise<ServiceCurrency> {
    const url = this.service_url + "/currency/?code=" + code;

    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()).data;

      return data as ServiceCurrency;
    } catch (e) {
      throw e;
    }
  }

  async getAll(): Promise<ServiceCurrency[]> {
    const url = this.service_url + "/currency/all";

    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()).data;

      return data as ServiceCurrency[];
    } catch (e) {
      throw e;
    }
  }

  async getAllEnabled(): Promise<ServiceEnabledCurrency[]> {
    const url = this.service_url + "/currency/enabled";

    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()).data;

      return data as ServiceEnabledCurrency[];
    } catch (e) {
      throw e;
    }
  }

  async getRate(from: string, to: string): Promise<ServiceRate> {
    const url = this.service_url + `/rate/?from=${from}&to=${to}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()).data;

      return data as ServiceRate;
    } catch (e) {
      throw e;
    }
  }

  async setCurrencyEnabled(currency: string, enabled: boolean): Promise<void> {
    const url = this.service_url + "/currency/set-enabled";

    try {
      await fetch(url, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: currency,
          enabled,
        }),
      });
    } catch (e) {
      throw e;
    }
  }
}
