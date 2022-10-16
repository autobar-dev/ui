import { Autocomplete, createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    position: "relative",
    width: "150px",
    height: "150px",
  },
  picker: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    opacity: 0,
    cursor: "pointer",
    backgroundColor: "#1A1B1Ebb",
    transition: "opacity ease-out 0.1s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "&:hover": {
      opacity: 1,
    },
  },
  image: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: "50%",
    width: "100%",
    height: "100%",
  },
  placeholder: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: "50%",
    backgroundColor: "#e3b04b",
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    fontSize: "48px",
    fontWeight: 700,
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modalImage: {
    maxWidth: 400,
    maxHeight: 400,
  },
  modalButton: {
    marginTop: 20,
  },
}));