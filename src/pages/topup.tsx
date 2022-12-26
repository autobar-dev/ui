import React, { useContext, useEffect } from 'react'
import Head from 'next/head'
import { Button, Code, Loader, NumberInput, Text, TextInput, Title } from '@mantine/core'
import Shell from '../components/organisms/Shell'
import UserContext from '../contexts/UserContext';
import { TableOfContents } from '../components/organisms/TableOfContents';
import { useRouter } from 'next/router';
import ImageWithPicker from '../components/molecules/ImageWithPicker';
import { useStyles } from '../pages_styles/topupStyles';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe, Stripe } from '@stripe/stripe-js';
import PaymentForm from '../components/organisms/PaymentForm';
import { CheckboxButton } from '../components/molecules/CheckboxButton';
import { showNotification } from '@mantine/notifications';

export default function ProfilePage() {
  const { classes } = useStyles();

  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if(!user) {
      router.push("/signin?r=/topup");
    }
  }, [user]);

  const [stripeInstance, setStripeInstance] = React.useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = React.useState<string>();
  const [paymentId, setPaymentId] = React.useState<string>();
  const [isCreateIntentLoading, setIsCreateIntentLoading] = React.useState<boolean>(false);

  const [amount, setAmount] = React.useState<number>();
  const [amountNumberInput, setAmountNumberInput] = React.useState<number>();
  
  useEffect(() => {
    if(!stripeInstance) {
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
        .then((stripe) => {
          setStripeInstance(stripe);
        })
        .catch((err) => {
          console.log("Failed to initialize Stripe", err);
        });
    }
  }, []);

  async function createPaymentIntent() {
    if(!amount || amount < 1) {
      return;
    }

    setIsCreateIntentLoading(true);

    let hasCancelPaymentIntentFailed = false;

    if(clientSecret && paymentId) { // Cancel previous payment intent if exists
      try {
        const response = await fetch('/api/payment/cancel-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: paymentId,
            reason: 'abandoned'
          }),
        });
      } catch (error) {
        hasCancelPaymentIntentFailed = true;

        showNotification({
          title: "Error",
          message: "Failed to cancel the previous payment intent.",
          color: "red",
        });
        console.log(error);

        setIsCreateIntentLoading(false);
      }
    }

    setClientSecret(undefined);
    setPaymentId(undefined);

    if(hasCancelPaymentIntentFailed) {
      return;
    }

    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const responseJson = await response.json();
      const { client_secret, id } = responseJson;

      setClientSecret(client_secret);
      setPaymentId(id);

      console.log("paymentId",  id);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to create a new payment intent.",
        color: "red",
      });
      console.log(error);
    }

    setIsCreateIntentLoading(false);
  }

  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
      variables: {
        spacingGridRow: "10px",
        colorPrimary: "#e3b04b",
        borderRadius: "10px",
        colorText: "#f3f3f3",
        colorBackground: "#25262B",
      },
    },
  };

  const presetAmounts = [
    10, 20, 50, 100, 200
  ];

  const [presetAmountsButtonsChecked, setPresetAmountsButtonsChecked] = React.useState<boolean[]>(presetAmounts.map(() => false));

  return (
    <>
      <Head>
        <title>Top up | Autobar</title>
      </Head>
      <Shell>
        <div className={classes.root}>
          <div className={classes.chooseAmountSegment}>
            <Title
              className={classes.chooseAmountTitle}
            >1. Choose amount</Title>
            <div className={classes.chooseAmountInputsWrapper}>
              {
                presetAmounts.map((presetAmount, index) => (
                  <CheckboxButton
                    key={`preset-amount-button-${index}`}
                    label={presetAmount.toString()}
                    checked={presetAmountsButtonsChecked[index]}
                    onChange={(newValue) => {
                      setPresetAmountsButtonsChecked(presetAmountsButtonsChecked.map((_, i) => i === index ? newValue : false));
                      setAmount(presetAmount);
                      setAmountNumberInput(undefined);
                    }}
                  />
                ))
              }
              <NumberInput
                placeholder={"Custom amount..."}
                value={amountNumberInput}
                onChange={(value) => {
                  setPresetAmountsButtonsChecked(presetAmountsButtonsChecked.map(() => false));
                  setAmountNumberInput(value);
                  setAmount(value ?? 0)
                }}
              />
            </div>
            <Text
              size={16}
              className={classes.currencyInfoText}
            >
              Your currency is <i>{ user?.balanceCurrency }</i>.
            </Text>
            <Button
              onClick={() => createPaymentIntent()}
              disabled={(amount && amount < 1) || isCreateIntentLoading}
              className={classes.createPaymentIntentButton}
            >
              {
                isCreateIntentLoading ? (
                  <Loader size={"sm"} />
                ) : "Proceed"
              }
            </Button>
          </div>
          {
            (clientSecret && paymentId && stripeInstance && !isCreateIntentLoading) && (
              <div className={classes.paymentFormSegment}>
                <Title
                  className={classes.paymentFormTitle}
                >2. Fill payment form</Title>
                <div className={classes.paymentFormWrapper}>
                  <Elements options={elementsOptions} stripe={stripeInstance}>
                    <PaymentForm
                      clientSecret={clientSecret}
                      paymentId={paymentId}
                    />
                  </Elements>
                </div>
              </div>
            )
          }
        </div>
      </Shell>
    </>
  )
}

