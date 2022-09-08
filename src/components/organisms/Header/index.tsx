import { Button, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useEffect } from "react";
import UserContext from "../../../contexts/UserContext";
import Logo from "../../molecules/Logo";
import UserMenu from "../../molecules/UserMenu";
import { useStyles } from "./styles";

export default function Header() {
  const { classes, theme } = useStyles();
  const { user } = useContext(UserContext);

  const isSmallScreen = useMediaQuery(theme.fn.smallerThan("sm").split("@media ")[1]);

  return (
    <header className={classes.root}>
      <Logo
        iconColor="#f8f8f8"
        textColor="#f8f8f8"
        type={isSmallScreen ? "logo-only" : "logo-with-text"}
        className={classes.logo}
      />

      <nav className={classes.navbar}>
        <Link href="/" passHref><a>Home</a></Link>
        <Link href="/products" passHref><a>Products</a></Link>
        <Link href="/stations" passHref><a>Stations</a></Link>
        <Link href="/contact" passHref><a>Contact</a></Link>
      </nav>

      {
        user ? 
          <UserMenu />
        :
          <Link href="/signin" passHref>
            <Button
              className={classes.signInButton}
              color="primary"
            >Sign In</Button>
          </Link>
      }
    </header>
  );
}