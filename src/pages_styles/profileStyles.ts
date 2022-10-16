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
    },
  },
  profileInfoSegment: {
    height: "auto",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    padding: 20,
  },
  profilePictureSelector: {
    marginRight: 20,
  },
  profileInfoNameSurname: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignContent: "stretch",
    justifyContent: "center",
    gap: 10,
  },
  contactDetailsSegment: {
    height: "auto",
    width: "100%",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignContent: "stretch",
    gap: 15,
  },
}));

