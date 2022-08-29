import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    display: "inline-flex",
    flexDirection: "row",
    border: "1px solid #e0e0e0",
    height: "350px",
    padding: "2rem",
    cursor: "pointer",
  },
  image: {
    height: '100%',
  },
  info: {
    display: "flex",
    flexDirection: "column",
  },
}));