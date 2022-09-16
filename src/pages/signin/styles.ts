import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    margin: "80px auto",
    display: "flex",
    flexDirection: "column",
    maxWidth: "550px",
    width: "90%",
    height: "auto",
    border: `1px solid ${theme.colors.defaultGray[3]}`,
    borderRadius: "10px",
    alignItems: "stretch",
    padding: "0 40px",
  },
  logo: {
    width: "200px",
    marginTop: "35px",
    alignSelf: "center",
  },
  inputIcon: {
    width: "20px",
  },
  emailInput: {
    marginTop: "40px",
  },
  passwordInput: {
    marginTop: "35px",
  },
  rememberMeAndForgotPassword: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      flexDirection: "column",
      gap: "20px",
    },
  },
  rememberMe: {
    marginLeft: "12px",

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      marginLeft: "0px",
    },
  },
  forgotPassword: {
    marginRight: "12px",
    color: "#f8f8f8",
    fontWeight: 500,

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      marginRight: "0px",
    },
  },
  signInButton: {
    marginTop: "35px",
    marginBottom: "25px",
  },
  signUpText: {
    marginBottom: "20px",
    textAlign: "center",

    '& a': {
      color: "#f8f8f8",
      fontWeight: 500,
    },
  },
}));