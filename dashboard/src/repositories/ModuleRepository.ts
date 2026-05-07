import { Currency } from "@/types/currency";
import { ApiClient } from "@/utils/ApiClient";

export type ServiceModule = {
  id: number,
  serial_number: string,
  station_id: number | null,
  product_id: number | null,
  enabled: boolean,
  prices: Map<string, number>,
  display_currency: Currency,
  display_unit: {
    id: number,
    amount: number,
    symbol: string,
    divisor_from_millilitres: number,
    decimals_displayed: number,
    created_at: string,
    updated_at: string,
  },
  created_at: string,
  updated_at: string,
};

export class ModuleRepository {
  private service_url: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.service_url = url;
    this.apiClient = apiClient;
  }

  async get(serial_number: string): Promise<ServiceModule> {
    const url = this.service_url + "/?serial_number=" + serial_number;
    const resp = await this.apiClient.get<ServiceModule>(url);
    return resp;
  }

  async getAll(): Promise<ServiceModule[]> {
    const resp = await this.apiClient.get<ServiceModule[]>(this.service_url + "/all");
    return resp;
  }
}
