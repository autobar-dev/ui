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
      paddingLeft: "15px",
      paddingRight: "15px",
    },
  },
  searchWrapper: {
    display: "flex",
    flexDirection: "row",
    height: "auto",
    marginTop: "30px",
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    marginLeft: "15px",
  },
  stateOtherThanSuccessContainer: {
    marginTop: "50px",
    display: "flex",
    justifyContent: "center",
  },
  pagination: {
    marginTop: "30px",
  },
}));

