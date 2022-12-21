import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  filteringContainer: {
    display: "flex",
    flexDirection: "column",
  },
  submitAndClearFiltersContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "40px",
  },
  saveButton: {
    marginLeft: "6px",
  },
}));