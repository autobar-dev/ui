import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Shell from '../components/organisms/Shell'
import UserContext from '../contexts/UserContext';
import { useRouter } from 'next/router';
import { useStyles } from '../pages_styles/transactionsStyles';
import { Transaction } from '../types/Transaction';
import { Table } from '@mantine/core';

export default function TransactionsPage() {
  const { classes } = useStyles();

  const { user } = useContext(UserContext);
  const router = useRouter();

  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  useEffect(() => {
    if(!user) {
      router.push("/signin?r=/transactions");
    }
  }, [user]);

  useEffect(() => {
    if(user) {
      setTransactionList(
        user.transactions
          .sort((a: Transaction, b: Transaction) => {
            const aLastDate = new Date(a.updatedAt ?? a.createdAt);
            const bLastDate = new Date(b.updatedAt ?? b.createdAt);

            return bLastDate.getTime() - aLastDate.getTime();
          })
          .filter((item: Transaction) => item.status !== "CREATED")
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Transactions | Autobar</title>
      </Head>
      <Shell>
        <div className={classes.root}>
          <Table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {
                transactionList.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.amount}</td>
                    <td>{transaction.currency}</td>
                    <td>{transaction.status}</td>
                    <td>
                      {
                        (transaction.updatedAt || transaction.createdAt).toLocaleString()
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </Shell>
    </>
  )
}

