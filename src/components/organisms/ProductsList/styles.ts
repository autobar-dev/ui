import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    border: "solid 1px #303030",
    borderRadius: "15px",
    marginTop: "30px",
  },
}));