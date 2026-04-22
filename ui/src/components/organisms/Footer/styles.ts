import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colors.defaultGray[3]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },

  icon: {
    padding: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor: theme.colors.defaultGray[4],
    },
  }
}));