import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import Global from '../components/organisms/Global';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

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
        <Global />
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}