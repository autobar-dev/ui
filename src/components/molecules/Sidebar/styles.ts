import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => {
  const iconRef = getRef("icon");

  return {
    menuItem: {
      margin: "3px 0px 3px",
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.white,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor: theme.colors.defaultGray[4],
      },
    },

    linkIcon: {
      ref: iconRef,
      color: theme.white,
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      },
    },
  }
});