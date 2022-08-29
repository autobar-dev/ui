import { Title } from "@mantine/core";
import { useStyles } from "./styles";

export default function Footer() {
  const { classes } = useStyles();

  return (
    <footer className={classes.root}>
      <Title>Footer</Title>
    </footer>
  );
}