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
    return await this.apiClient.get<ServiceRate>(this.servicePath + `/rate/?from=${from}&to=${to}`);
  }

  public async getRemoteRate(from: string, to: string): Promise<ServiceRate> {
    return await this.apiClient.get<ServiceRate>(this.servicePath + `/rate/remote?from=${from}&to=${to}`);
  }
}
