import { ApiClient } from "@/utils/ApiClient";
import { File } from "@/types/file";

export type ServiceProduct = {
  id: number,
  slug: string,
  names: Record<string, string>,
  descriptions: Record<string, string>,
  cover: File,
  enabled: boolean,
  badges: any[],
  created_at: string,
  updated_at: string,
};

export type GetProductResponse = {
  type: "product" | "redirect",
  product: ServiceProduct | null,
  redirect_slug: string | null,
};

export class ProductRepository {
  private service_url: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.service_url = url;
    this.apiClient = apiClient;
  }

  async get(id?: number, slug?: string): Promise<GetProductResponse> {
    let url = this.service_url + "/?";
    if (id) url += "id=" + id;
    else if (slug) url += "slug=" + slug;

    return await this.apiClient.get<GetProductResponse>(url);
  }

  async getAll(): Promise<ServiceProduct[]> {
    return await this.apiClient.get<ServiceProduct[]>(this.service_url + "/all");
  }

  async search(query: string, hitsPerPage: number = 20, page: number = 0, includeDisabled: boolean = false): Promise<ServiceProduct[]> {
    const resp = await this.apiClient.post<{ hits: ServiceProduct[] }>(this.service_url + "/search", {
      query,
      hits_per_page: hitsPerPage,
      page,
      include_disabled: includeDisabled,
    });
    return resp.hits;
  }

  async create(payload: { slug: string, names: Record<string, string>, descriptions: Record<string, string>, cover_file_id: number, badges: any[] }): Promise<void> {
    return await this.apiClient.post(this.service_url + "/new", payload);
  }

  async update(payload: { id: number, slug?: string, names?: Record<string, string>, descriptions?: Record<string, string>, cover_file_id?: number, enabled?: boolean, badges?: any[] }): Promise<void> {
    return await this.apiClient.put(this.service_url + "/edit", payload);
  }

  async updateNames(id: number, names: Record<string, string>): Promise<void> {
    return await this.apiClient.patch(`${this.service_url}/${id}/names`, names);
  }

  async updateBadges(id: number, badges: any[]): Promise<void> {
    return await this.apiClient.patch(`${this.service_url}/${id}/badges`, badges);
  }

  async updateStatus(id: number, enabled: boolean): Promise<void> {
    return await this.apiClient.patch(`${this.service_url}/${id}/status`, { enabled });
  }

  async updateDescriptions(id: number, descriptions: Record<string, string>): Promise<void> {
    return await this.apiClient.patch(`${this.service_url}/${id}/descriptions`, descriptions);
  }
}
