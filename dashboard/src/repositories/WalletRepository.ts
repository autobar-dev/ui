import { ApiClient } from "@/utils/ApiClient";

export type ServiceWallet = {
  id: number,
  user_id: string,
  currency_code: string,
  balance: number,
};

export type ServiceTransaction = {
  id: string,
  wallet_id: number,
  type: "deposit" | "withdraw" | "purchase" | "refund" | "currency-change",
  value: number,
  currency_code: string,
  created_at: string,
};

export class WalletRepository {
  private service_url: string;
  private apiClient: ApiClient;

  constructor(url: string, apiClient: ApiClient) {
    this.service_url = url;
    this.apiClient = apiClient;
  }

  async get(userId?: string): Promise<ServiceWallet> {
    const url = this.service_url + "/wallet/" + (userId ? `?user_id=${userId}` : "");
    return await this.apiClient.get<ServiceWallet>(url);
  }

  async create(userId: string, currencyCode: string): Promise<void> {
    return await this.apiClient.post(this.service_url + "/wallet/create", {
      user_id: userId,
      currency_code: currencyCode,
    });
  }

  async getTransaction(id: string): Promise<ServiceTransaction> {
    return await this.apiClient.get<ServiceTransaction>(this.service_url + `/transaction/get?id=${id}`);
  }

  async getAllTransactions(userId?: string): Promise<ServiceTransaction[]> {
    const url = this.service_url + "/transaction/get-all" + (userId ? `?user_id=${userId}` : "");
    return await this.apiClient.get<ServiceTransaction[]>(url);
  }

  async getAllTransactionForWallet(userId: string): Promise<ServiceTransaction[]> {
    return this.getAllTransactions(userId);
  }
}
