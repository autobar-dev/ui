import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    width: "100%",
    borderBottom: "solid 1px #303030",
    display: "flex",
    flexDirection: "column",
    padding: "20px 30px",
    cursor: "pointer",

    ["&:hover"]: {
      backgroundColor: "#ffffff08",
    },

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: "20px 15px",
    },
  },
  banner: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  beerInfoWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "10px",
  },
  beerNameAndTypeWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "25px",
    justifyContent: "center",
    alignContent: "start",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      marginLeft: "15px",
    },
  },
  beerNameLink: {
    color: "#C1C2C5",

    ["&:hover"]: {
      textDecorationThickness: "2px",
    },
  },
  beerName: {
    fontSize: "20px",
    fontWeight: "bold",

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      fontSize: "18px",
    },
  },
  beerType: {
    fontSize: "18px",

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      fontSize: "16px",
    },
  },
  chevron: {
    marginLeft: "20px",
  },
  details: {
    width: "100%",
    height: "auto",
    marginTop: "30px",
    position: "relative",

    ["&::before"]: {
      content: "''",
      display: "inline-block",
      width: "40%",
      height: "2px",
      backgroundColor: "#303030",
      position: "absolute",
      top: "-10px",
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
  beerDescription: {
    fontSize: "16px",
  },
}));