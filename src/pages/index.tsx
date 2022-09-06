import React from 'react'
import Head from 'next/head'
import { Title } from '@mantine/core'
import Shell from '../components/organisms/Shell'

export default function HomePage() {
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
