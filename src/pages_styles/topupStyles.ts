import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    maxWidth: "800px",
    margin: "auto",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: "100%",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },
  chooseAmountSegment: {
    marginTop: "20px",
    height: "auto",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chooseAmountTitle: {
    fontSize: "32px",
    marginBottom: "10px",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: "22px",
    },
  },
  createPaymentIntentButton: {
    marginTop: "8px",
    alignSelf: "center",
  },
  currencyInfoText: {
    marginTop: "8px",
  },
  chooseAmountInputsWrapper: {
    display: "grid",
    gridGap: "10px",

    gridTemplateColumns: "1fr 1fr 1fr",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      gridTemplateColumns: "1fr 1fr",
    },

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      gridTemplateColumns: "1fr",
    },
  },
  paymentFormSegment: {
    marginTop: "40px",
    height: "auto",
    width: "100%",
  },
  paymentFormTitle: {
    fontSize: "32px",
    marginBottom: "10px",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: "22px",
    },
  },
  paymentFormWrapper: {},
}));

