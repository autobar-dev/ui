export type ServiceModule = {
  id: number,
  serial_number: string,
  station_slug: string | null,
  product_slug: string | null,
  prices: Map<string, number>,
  created_at: string,
};

export class ModuleRepository {
  private service_url: string;

  constructor(url: string) {
    this.service_url = url;
  }

  async get(serial_number: string): Promise<ServiceModule> {
    const url = this.service_url + "/?serial_number=" + serial_number;

    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()).data;

      return data as ServiceModule;
    } catch (e) {
      throw e;
    }
  }

  async getAll(): Promise<ServiceModule[]> {
    const url = this.service_url + "/get-all";

    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()).data;

      return data as ServiceModule[];
    } catch (e) {
      throw e;
    }
  }
}
