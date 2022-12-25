import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  },
  linkAuthenticationEmailInput: {
    marginBottom: "10px",
  },
  payNowButton: {
    marginTop: "20px",
    alignSelf: "center",
  },
}));