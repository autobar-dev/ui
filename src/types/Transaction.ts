export type Transaction = {
  id: number;

  amount: number;
  currency: string;

  paymentId: string;
  status: "CREATED" | "CANCELLED" | "PROCESSING" | "REQUIRES_ACTION" | "SUCCEEDED" | "FAILED";

  createdAt: Date;
  updatedAt?: Date;
};