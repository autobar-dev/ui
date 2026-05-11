import { WalletRepository } from "@/repositories/WalletRepository";
import { Stack } from "@mantine/core";
import Wallet from "@/components/organisms/Wallet";
import { serviceTransactionToTransaction, serviceWalletToWallet } from "@/utils/wallet_utils";
import Transactions from "../organisms/Transactions";

export default async function UserSection({ email }: {
  email: string,
}) {
  const walletRepository = new WalletRepository("http://localhost:9000/wallet");

  const serviceWallet = await walletRepository.get(email);
  const serviceAllTransactions = await walletRepository.getAllTransactionForWallet(email);

  const wallet = serviceWalletToWallet(serviceWallet);
  const allTransactions = serviceAllTransactions.map(serviceTransactionToTransaction);

  return (
    <Stack gap="xl">
      <Wallet wallet={wallet} />
      <Transactions transactions={allTransactions} />
    </Stack>
  );
}
