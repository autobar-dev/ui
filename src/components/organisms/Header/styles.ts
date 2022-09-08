import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    borderBottom: "1px solid #eaeaea",
    width: '100%',
    height: '70px',
  },
  logo: {
    maxHeight: "30px",
  },
  navbar: {
    display: "inline-flex",
    flexDirection: "row",

    [`& a`]: {
      color: theme.white,
      margin: "0 0.5rem",
    },
  },
  signInButton: {
    display: "inline-block",
  },
}));