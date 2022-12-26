import { Button, Loader } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { getRandomString } from "../../../utils/helpers/getRandomString";
import { useStyles } from "./styles";

type PaymentFormProps = {
  clientSecret: string;
  paymentId: string;
};

export default function PaymentForm(props: PaymentFormProps) {
  const { classes } = useStyles();

  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [loadingNotificationId, setLoadingNotificationId] = useState<string | null>(null);
  const [fetchPaymentStatusInterval, setFetchPaymentStatusInterval] = useState<number>();

  useEffect(() => {
    if(!stripe || !elements) {
      return;
    }

    stripe.retrievePaymentIntent(props.clientSecret).then(({ paymentIntent }) => {
      if(!paymentIntent) {
        showNotification({
          color: "red",
          title: "Error",
          message: "Payment intent not found.",
        });
      } else {
        let notificationToShow: any = undefined;

        switch (paymentIntent.status) {
          case "succeeded":
            notificationToShow = {
              color: "green",
              title: "Success",
              message: "Payment successful!",
            };
            break;
          case "processing":
            const notificationId = getRandomString(12, {
              lowercase: true,
              uppercase: true,
              numbers: true,
            });

            notificationToShow = {
              id: notificationId,
              color: "brand",
              title: "Processing",
              message: "Payment is being processed...",
              loading: true,
            };

            setLoadingNotificationId(notificationId);
            break;
          case "requires_payment_method":
            // notificationToShow = {
            //   color: "red",
            //   title: "Error",
            //   message: "Payment requires a method.",
            // };
            break;
          default:
            notificationToShow = {
              color: "red",
              title: "Error",
              message: "Something went wrong.",
            };
            break;
        }

        if(loadingNotificationId) {
          notificationToShow && updateNotification(notificationToShow);
        } else {
          notificationToShow && showNotification(notificationToShow);
        }
      }
    });
  }, [stripe]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_URL}/`,
      },
      redirect: "if_required",
    });

    if(error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        showNotification({
          color: "brand",
          title: "Error",
          message: error.message,
          autoClose: false,
          loading: false,
        });
      } else {
        showNotification({
          color: "red",
          title: "Error",
          message: "An unexpected error occurred.",
        });
      }
    }

    let counter = 1;

    const paymentStatusIntervalId = setInterval(async () => {
      
      const paymentStatusResponse = await fetch("/api/payment/status?" + new URLSearchParams({
        payment_id: props.paymentId,
      }));

      const paymentStatusJson = await paymentStatusResponse.json();
      const paymentStatus = paymentStatusJson.status;

      if(paymentStatus === "SUCCEEDED") {
        clearInterval(paymentStatusIntervalId);

        showNotification({
          color: "green",
          title: "Success",
          message: "Payment successful!",
        });

        setIsLoading(false);
        window.location.href = "/";
      } else if(paymentStatus === "FAILED") {
        clearInterval(paymentStatusIntervalId);

        showNotification({
          color: "red",
          title: "Error",
          message: "Payment failed.",
        });

        setIsLoading(false);
      }

      counter++;
    }, 500);
  }

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "auto",
  }

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className={classes.root}
    >
      {/* <LinkAuthenticationElement
        className={classes.linkAuthenticationEmailInput}
        onChange={(e) => setEmail(e.value.email)}
      /> */}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      
      <Button
        disabled={isLoading || !stripe || !elements}
        type="submit"
        className={classes.payNowButton}
      >
        <span id="button-text">
          {
            isLoading ? (
              <Loader size={"sm"} />
            ) : "Pay now"
          }
        </span>
      </Button>
    </form>
  );
}