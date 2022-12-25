import React, { useContext, useEffect } from 'react'
import Head from 'next/head'
import { Code, Title } from '@mantine/core'
import Shell from '../components/organisms/Shell'
import UserContext from '../contexts/UserContext';
import { loadStripe } from '@stripe/stripe-js';
import { showNotification } from '@mantine/notifications';

export default function HomePage() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!).then(async (stripe) => {
      if(stripe) {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

        if(!paymentIntent) {
          return;
        }

        let notificationToShow: any = {};

        switch (paymentIntent.status) {
          case "succeeded":
            notificationToShow = {
              id: "payment-status-notification",
              title: "Success",
              message: "Your payment was successful!",
              color: "green",
            };
            break;
          case "processing":
            notificationToShow = {
              id: "payment-status-notification",
              title: "Processing...",
              message: "Your payment is in progress...",
              color: "brand",
            };
            break;
          case "requires_payment_method":
            notificationToShow = {
              id: "payment-status-notification",
              title: "Error",
              message: "Your payment failed.",
              color: "red",
            };
            break;
          default:
            notificationToShow = {
              id: "payment-status-notification",
              title: "Error",
              message: "Something went wrong with your payment.",
              color: "red",
            };
            break;
        }

        showNotification(notificationToShow);
      }
    });
  }, []);

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
