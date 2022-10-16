import React, { useContext } from 'react'
import Head from 'next/head'
import { Code, Title } from '@mantine/core'
import Shell from '../components/organisms/Shell'
import UserContext from '../contexts/UserContext';

export default function HomePage() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Home | Autobar</title>
      </Head>
      <Shell>
        <Title>Home Page</Title>
      </Shell>
    </>
  )
}
