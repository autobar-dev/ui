import { ClientInfo } from "@/types/realtime";
import { ApiClient } from "@/utils/ApiClient";

export type LatencyReport = {
  id: string,
  command: string,
  client_info: string,
  sent_at: number,
  reply_at: number,
  latency_ms: number,
  status: string,
};

export class RealtimeRepository {
  private servicePath: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.servicePath = url;
    this.apiClient = apiClient;
  }

  public async getLatencyHistory(clientInfo: ClientInfo): Promise<LatencyReport[]> {
    const resp = await this.apiClient.get<LatencyReport[]>(this.servicePath + `/latency-history?client_type=${clientInfo.client_type}&identifier=${clientInfo.identifier}`);
    return resp;
  }
}
