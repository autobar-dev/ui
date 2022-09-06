import Currency from "./Currency";

type User = {
  id: number;

  email: string;

  name: string;
  surname: string;
  birthdate: Date;
  phone_number: string;

  balance: number;
  balance_currency: Currency;

  verified_at: Date | null;
  created_at: Date;

  transactions: any[];
  purchases: any[];
  active_sessions: any[]
};

export default User;