"use client";

import { Stack, Center, Loader, Text } from "@mantine/core";
import Wallet from "@/components/organisms/Wallet";
import { serviceTransactionToTransaction, serviceWalletToWallet } from "@/utils/wallet_utils";
import Transactions from "../organisms/Transactions";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";
import { Wallet as WalletType } from "@/types/wallet";

export default function UserSection({ email }: {
  email: string,
}) {
  const { walletRepository } = useContext(RepositoriesContext);

  // const [wallet, setWallet] = useState<WalletType | null>(null);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!walletRepository) return;

  //   setLoading(true);
  //   Promise.all([
  //     walletRepository.get(email),
  //     walletRepository.getAllTransactionForWallet(email)
  //   ])
  //   .then(([serviceWallet, serviceAllTransactions]) => {
  //     setWallet(serviceWalletToWallet(serviceWallet));
  //     setTransactions(serviceAllTransactions.map(serviceTransactionToTransaction));
  //     setLoading(false);
  //   })
  //   .catch(err => {
  //     console.error("Failed to load user wallet/transactions", err);
  //     setLoading(false);
  //   });
  // }, [walletRepository, email]);

  // if (loading || !wallet) {
  //   return (
  //     <Center h={400}>
  //       <Stack align="center" gap="xs">
  //         <Loader size="lg" variant="dots" />
  //         <Text size="sm" c="dimmed" fw={300}>Loading user financial data...</Text>
  //       </Stack>
  //     </Center>
  //   );
  // }

  return (
    <Stack gap="xl">
      {/* <Wallet wallet={wallet} /> */}
      {/* <Transactions transactions={transactions} /> */}
    </Stack>
  );
}
