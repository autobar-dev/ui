import { Currency } from "@/types/currency";
import { ApiClient } from "@/utils/ApiClient";

export type ServiceStation = {
  id: number;
  slug: string;
  name: string;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceDisplayUnit = {
  id: number;
  amount: number;
  symbol: string;
  divisor_from_millilitres: number;
  decimals_displayed: number;
  created_at: string;
  updated_at: string;
};

export type ServiceFirmware = {
  id: number;
  program: string;
  channel: string;
  target: string;
  version: string;
  file_id: number;
  created_at: string;
};

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
    const url = this.service_url + "/" + serial_number;
    const resp = await this.apiClient.get<ServiceModule>(url);
    return resp;
  }

  async getAll(): Promise<ServiceModule[]> {
    const resp = await this.apiClient.get<ServiceModule[]>(this.service_url + "/all");
    return resp;
  }

  async create(currencyCode: string): Promise<any> {
    return await this.apiClient.post(this.service_url + "/create", {
      currency_code: currencyCode,
    });
  }

  // --- Station Management ---

  async getAllStations(): Promise<ServiceStation[]> {
    return await this.apiClient.get<ServiceStation[]>(this.service_url + "/stations/");
  }

  async getStation(id: number): Promise<ServiceStation> {
    const stations = await this.getAllStations();
    const station = stations.find(s => s.id === id);
    if (!station) throw new Error("Station not found");
    return station;
  }

  async createStation(slug: string, name: string, owner_id: string | null = null): Promise<ServiceStation> {
    return await this.apiClient.post<ServiceStation>(this.service_url + "/stations/", {
      slug,
      name,
      owner_id
    });
  }

  async updateStation(id: number, payload: Partial<{ slug: string, name: string, owner_id: string | null }>): Promise<ServiceStation> {
    return await this.apiClient.patch<ServiceStation>(this.service_url + "/stations/" + id, payload);
  }

  async deleteStation(id: number): Promise<void> {
    return await this.apiClient.delete(this.service_url + "/stations/" + id);
  }

  async getStationModules(id: number): Promise<ServiceModule[]> {
    return await this.apiClient.get<ServiceModule[]>(this.service_url + "/stations/" + id + "/modules");
  }

  async addModuleToStation(id: number, serial_number: string): Promise<void> {
    return await this.apiClient.patch(this.service_url + "/stations/" + id + "/modules/" + serial_number, {});
  }

  async removeModuleFromStation(id: number, serial_number: string): Promise<void> {
    return await this.apiClient.delete(this.service_url + "/stations/" + id + "/modules/" + serial_number);
  }

  // --- Firmware Management ---

  async uploadFirmware(formData: FormData): Promise<void> {
    return await this.apiClient.postFormData(this.service_url + "/firmware", formData);
  }

  async getFirmware(serial_number: string, target: string, channel: string): Promise<any> {
    const url = this.service_url + `/${serial_number}/firmware?target=${target}&channel=${channel}`;
    return await this.apiClient.get(url);
  }

  // --- Module-Specific Routes ---

  async requestReport(serial_number: string): Promise<any> {
    return await this.apiClient.get(this.service_url + `/${serial_number}/request-report`);
  }

  async submitReport(serial_number: string, queue: string, status: string): Promise<void> {
    return await this.apiClient.post(this.service_url + `/${serial_number}/report`, {
      queue,
      status,
    });
  }

  async prepare(serial_number: string): Promise<any> {
    return await this.apiClient.get(this.service_url + `/${serial_number}/prepare`);
  }

  async activate(serial_number: string, otk: string): Promise<void> {
    return await this.apiClient.post(this.service_url + `/${serial_number}/activate`, {
      otk,
    });
  }

  async deactivate(serial_number: string): Promise<void> {
    return await this.apiClient.post(this.service_url + `/${serial_number}/deactivate`, {});
  }

  async getActivationSession(serial_number: string): Promise<any> {
    return await this.apiClient.get(this.service_url + `/${serial_number}/activation-session`);
  }

  async updateActivationSession(serial_number: string, price: number, amountMillilitres: number): Promise<void> {
    return await this.apiClient.patch(this.service_url + `/${serial_number}/activation-session`, {
      price,
      amount_millilitres: amountMillilitres,
    });
  }

  async updatePrices(serial_number: string, prices: Record<string, number>): Promise<void> {
    return await this.apiClient.patch(this.service_url + `/${serial_number}/prices`, prices);
  }

  async updateEnabled(serial_number: string, enabled: boolean): Promise<void> {
    return await this.apiClient.patch(this.service_url + `/${serial_number}/enabled`, {
      enabled,
    });
  }

  async getAllDisplayUnits(): Promise<ServiceDisplayUnit[]> {
    return await this.apiClient.get<ServiceDisplayUnit[]>(this.service_url + "/display-units");
  }

  async updateProduct(serial_number: string, productId: number | null): Promise<void> {
    return await this.apiClient.patch(this.service_url + `/${serial_number}/product`, {
      product_id: productId,
    });
  }

  async updateDisplayUnit(serial_number: string, displayUnitId: number): Promise<void> {
    return await this.apiClient.patch(this.service_url + `/${serial_number}/display-unit`, {
      display_unit_id: displayUnitId,
    });
  }

  async updateCurrency(serial_number: string, currencyCode: string): Promise<void> {
    return await this.apiClient.patch(this.service_url + `/${serial_number}/currency`, {
      currency_code: currencyCode,
    });
  }

  async getAllFirmware(program?: string, channel?: string, target?: string): Promise<ServiceFirmware[]> {
    const params = new URLSearchParams();
    if (program) params.append("program", program);
    if (channel) params.append("channel", channel);
    if (target) params.append("target", target);
    
    const qs = params.toString();
    const url = this.service_url + "/firmware" + (qs ? `?${qs}` : "");
    return await this.apiClient.get<ServiceFirmware[]>(url);
  }
}
