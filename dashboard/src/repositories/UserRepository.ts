import { User } from "@/types/user";
import { ApiClient } from "@/utils/ApiClient";

export class UserRepository {
  private servicePath: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.servicePath = url;
    this.apiClient = apiClient;
  }

  public async whoAmI(): Promise<User> {
    const resp = await this.apiClient.get<User>(this.servicePath + "/who-am-i");
    return resp;
  }
}
