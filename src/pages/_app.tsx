import { AppProps } from 'next/app';
import Head from 'next/head';
import { Center, Loader, LoadingOverlay, MantineProvider } from '@mantine/core';
import Global from '../components/organisms/Global';
import UserContext from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import User from '../types/User';
import flushUserHelper from '../utils/helpers/flushUser';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [user, setUser] = useState<User | undefined>(undefined);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const flushUser = () => flushUserHelper(user, setUser, `${process.env.NEXT_PUBLIC_URL}/api/graphql`);

  // Flush user on first load
  useEffect(() => {
    flushUser().then(() => {
      setIsUserLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          colors: {
            brand: ["#087f5b", "#0b7285", "#1864ab", "#364fc7", "#5f3dc4", "#862e9c", "#a61e4d", "#c92a2a", "#E3B04B", "#e7bb65"],
          },
          primaryColor: "brand",
          defaultRadius: "10px",
          fontFamily: "Outfit",
          fontSizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 20,
          },
        }}
      >
        <UserContext.Provider value={{ user, setUser, flushUser, }}>
          <Global />

          {
            isUserLoading ? (
              <Center style={{ width: "100vw", height: "100vh" }}>
                <Loader size={"xl"} />
              </Center>              
            )
            :
              <Component {...pageProps} />
          }
        </UserContext.Provider>
      </MantineProvider>
    </>
  );
}