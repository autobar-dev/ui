import Currency from "./Currency";

type User = {
  id: number;

  email: string;

  name: string;
  surname: string;
  birthdate: Date;
  phoneNumber: string;
  profilePicture: string | null;

  balance: number;
  balanceCurrency: Currency;

  verifiedAt: Date | null;
  createdAt: Date;

  transactions: any[];
  purchases: any[];
  activeSessions: any[]
};

export default User;