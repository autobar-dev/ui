import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  userAvatar: {
    cursor: "pointer",
  },
  menuItem: {
    fontWeight: 400,
  },
  menuItemIcon: {
    width: "14px",
    marginRight: "6px",
  },
}));