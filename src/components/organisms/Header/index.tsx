import { Button, Title } from "@mantine/core";
import Link from "next/link";
import { useStyles } from "./styles";

export default function Header() {
  const { classes } = useStyles();

  return (
    <header className={classes.root}>
      <Title>autobar</Title>

      <nav className={classes.navbar}>
        <Link href="/" passHref><a>Home</a></Link>
        <Link href="/products" passHref><a>Products</a></Link>
        <Link href="/stations" passHref><a>Stations</a></Link>
        <Link href="/contact" passHref><a>Contact</a></Link>
      </nav>

      <Link href="/signin" passHref>
        <Button
          className={classes.signInButton}
          color="primary"
        >Sign In</Button>
      </Link>
    </header>
  );
}