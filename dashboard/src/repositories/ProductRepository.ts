import { ApiClient } from "@/utils/ApiClient";
import { File } from "@/types/file";

export type ServiceProduct = {
  id: number,
  names: Map<string, string>,
  descriptions: Map<string, string>,
  cover: File,
  enabled: boolean,
  badges: any[],
  created_at: string,
  updated_at: string,
};

export class ProductRepository {
  private service_url: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.service_url = url;
    this.apiClient = apiClient;
  }

  async get(id: number): Promise<ServiceProduct> {
    const url = this.service_url + "/?id=" + id;
    const resp = await this.apiClient.get<ServiceProduct>(url);
    return resp;
  }

  async getAll(): Promise<ServiceProduct[]> {
    const resp = await this.apiClient.get<ServiceProduct[]>(this.service_url + "/all");
    return resp;
  }
}
