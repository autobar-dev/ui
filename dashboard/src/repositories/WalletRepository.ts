export type ServiceWallet = {
  id: number,
  user_email: string,
  currency_code: string,
  balance: number,
};

export type ServiceTransaction = {
  id: string,
  wallet_id: number,
  type: string,
  value: number,
  currency_code: string,
  created_at: string,
};

export class WalletRepository {
  private service_url: string;

  constructor(url: string) {
    this.service_url = url;
  }

  async get(user_email: string): Promise<ServiceWallet> {
    const url = this.service_url + `/wallet/?email=${user_email}`;

    try {
      // const response = await fetch(url, { cache: "no-store" });
      const response = await fetch(url);
      const data = (await response.json()).data;

      return data as ServiceWallet;
    } catch (e) {
      throw e;
    }
  }

  async getAllTransactionForWallet(user_email: string): Promise<ServiceTransaction[]> {
    const url = this.service_url + `/transaction/get-all?email=${user_email}`;

    try {
      // const response = await fetch(url, { cache: "no-store" });
      const response = await fetch(url);
      const data = (await response.json()).data;

      console.log(data);

      return data as ServiceTransaction[];
    } catch (e) {
      throw e;
    }
  }
}
