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
        user.transactions.sort((a: Transaction, b: Transaction) => {
          return (b.updatedAt || b.createdAt).getTime() - (a.updatedAt || a.createdAt).getTime();
        })
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
                <th>Payment ID</th>
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
                    <td>{transaction.paymentId}</td>
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

