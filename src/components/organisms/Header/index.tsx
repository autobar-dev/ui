import { Button, Burger } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import Logo from "../../molecules/Logo";
import UserMenu from "../../molecules/UserMenu";
import { useStyles } from "./styles";

interface HeaderActionProps {
  links: { label: string; link: string; }[];
}

export default function Header({ links }: HeaderActionProps) {
  const { classes, theme } = useStyles();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const isSmallScreen = useMediaQuery(theme.fn.smallerThan("sm").split("@media ")[1]);

  return (
    <header className={classes.root}>
      <div className={classes.logoContainer}>
        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
        <Link href="/" passHref>
          <a style={{
            display: "flex",
            alignItems: "center",
          }}>
            <Logo
              iconColor="#e3b04b"
              textColor="#f8f8f8"
              type={isSmallScreen ? "logo-only" : "logo-with-text"}
              className={classes.logo}
              size={30}
            />
          </a>
        </Link>
      </div>

      <div className={classes.navbarContainer}>
        <nav className={classes.navbar}>
          {links.map((item) => (
            <Link href={item.link} passHref>
              <a className={classes.navbarItem}>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>

      <div className={classes.signInButtonContainer}>
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
      </div>
    </header>
  );
}