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

  public async getAll(role?: string): Promise<User[]> {
    let url = this.servicePath + "/all";
    if (role) {
      url += "?role=" + role;
    }
    return await this.apiClient.get<User[]>(url);
  }

  public async getUser(id?: string, email?: string): Promise<User> {
    let url = this.servicePath + "/?";
    if (id) url += "id=" + id;
    else if (email) url += "email=" + email;
    return await this.apiClient.get<User>(url);
  }

  public async isConfirmationCodeValid(code: string): Promise<boolean> {
    const resp = await this.apiClient.get<{ status: string }>(this.servicePath + `/is-confirmation-code-valid?code=${code}`);
    return resp.status === "success";
  }

  public async getLocale(id?: number, code?: string): Promise<any> {
    let url = this.servicePath + "/locale?";
    if (id) url += "id=" + id;
    else if (code) url += "code=" + code;
    return await this.apiClient.get(url);
  }

  public async getRole(name: string): Promise<any> {
    return await this.apiClient.get(this.servicePath + `/role?name=${name}`);
  }

  public async create(payload: { email: string, password: string, first_name: string, last_name: string, date_of_birth: string, locale: string, currency_code: string }): Promise<void> {
    return await this.apiClient.post(this.servicePath + "/create", payload);
  }

  public async confirmEmail(code: string): Promise<void> {
    return await this.apiClient.post(this.servicePath + "/confirm-email", {
      confirmation_code: code,
    });
  }

  public async updateRole(id: string, role: string): Promise<void> {
    return await this.apiClient.patch(this.servicePath + `/${id}/role`, {
      role: role,
    });
  }
}
