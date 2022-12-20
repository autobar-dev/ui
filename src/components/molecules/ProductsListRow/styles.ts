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
  },
  beerName: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  beerType: {
    fontSize: "18px",
  },
  details: {
    width: "100%",
    height: "250px",
    backgroundColor: "blue",
    marginTop: "30px",
  },
}));