import { Button, Title } from "@mantine/core";
import Link from "next/link";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import UserMenu from "../../molecules/UserMenu";
import { useStyles } from "./styles";

export default function Header() {
  const { classes } = useStyles();

  const userContext = useContext(UserContext);

  return (
    <header className={classes.root}>
      <Title>autobar</Title>

      <nav className={classes.navbar}>
        <Link href="/" passHref><a>Home</a></Link>
        <Link href="/products" passHref><a>Products</a></Link>
        <Link href="/stations" passHref><a>Stations</a></Link>
        <Link href="/contact" passHref><a>Contact</a></Link>
      </nav>

      <UserMenu />

      {/* {
        userContext.user ? 
          <UserMenu />
        :
          <Link href="/signin" passHref>
            <Button
              className={classes.signInButton}
              color="primary"
            >Sign In</Button>
          </Link>
      } */}
    </header>
  );
}