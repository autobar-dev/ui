import { Currency } from "@/types/currency";
import { ApiClient } from "@/utils/ApiClient";

export type ServiceRate = {
  from: string,
  to: string,
  rate: number,
  updated_at: string,
};

export class CurrencyRepository {
  private servicePath: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.servicePath = url;
    this.apiClient = apiClient;
  }

  public async get(code: string): Promise<Currency> {
    const resp = await this.apiClient.get<Currency>(this.servicePath + "/currency/?code=" + code);
    return resp;
  }

  public async getAll(): Promise<Currency[]> {
    const resp = await this.apiClient.get<Currency[]>(this.servicePath + "/currency/all");
    return resp;
  }

  public async getAllEnabled(): Promise<Currency[]> {
    const resp = await this.apiClient.get<Currency[]>(this.servicePath + "/currency/enabled");
    return resp;
  }

  public async getRate(from: string, to: string): Promise<ServiceRate> {
    const url = this.servicePath + `/rate/?from=${from}&to=${to}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()).data;

      return data as ServiceRate;
    } catch (e) {
      throw e;
    }
  }

  async setCurrencyEnabled(currency: string, enabled: boolean): Promise<void> {
    const url = this.servicePath + "/currency/set-enabled";

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
