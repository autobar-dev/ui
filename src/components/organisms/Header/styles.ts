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
    width: "100%",
    height: "60px",
  },

  burger: {
    marginRight: "1rem",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  logo: {
    maxHeight: "30px",
  },

  logoContainer: {
    display: "flex",
    flex: "1 1 0",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  navbar: {
    display: "inline-flex",
    flexDirection: "row",

    [`& a`]: {
      color: theme.white,
      margin: "0 0.2rem",
    },
  },

  navbarContainer: {
    display: "flex",
    flex: "3 1 0",
    justifyContent: "center",
    alignItems: "center",

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  navbarItem: {
    padding: "0.2rem 0.6rem",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  signInButton: {
    display: "inline-block",
  },

  signInButtonContainer: {
    display: "flex",
    flex: "1 0 0",
    justifyContent: "flex-end",
    alignItems: "center",
  },
}));