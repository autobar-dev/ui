import { ApiClient } from "@/utils/ApiClient";

export class FileRepository {
  private service_url: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.service_url = url;
    this.apiClient = apiClient;
  }

  async upload(file: File, directory: string): Promise<number> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("directory", directory);

    const response = await this.apiClient.postFormData<{ id: number }>(this.service_url + "/upload", formData);
    return response.id;
  }
}
