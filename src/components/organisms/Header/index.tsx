import { Button, Burger } from "@mantine/core";
import { useMediaQuery, useDisclosure, useClickOutside } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useRef, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import Logo from "../../molecules/Logo";
import UserMenu from "../../molecules/UserMenu";
import { useStyles } from "./styles";
import { IconHome, IconBeer, IconMap2, IconMail, IconCircuitSwitchClosed } from '@tabler/icons';
import Sidebar from "../../molecules/Sidebar";
import { useRouter } from "next/router"

const menuList = [
  { label: "Home", link: "/", icon: IconHome },
  { label: "Products", link: "/products", icon: IconBeer },
  { label: "Stations", link: "/stations", icon: IconMap2 },
  { label: "Contact", link: "/contact", icon: IconMail },
]

export default function Header() {
  const { classes, cx, theme } = useStyles();
  const { user } = useContext(UserContext);
  const [opened, { close, toggle }] = useDisclosure(false);
  const isSmallScreen = useMediaQuery(theme.fn.smallerThan("sm").split("@media ")[1]);

  const sidebarRef = useRef(null);
  const burgerRef = useRef(null);
  useClickOutside(() => close(), null, [sidebarRef.current!, burgerRef.current!]);

  const router = useRouter();
  const currentRoute = router.pathname;
  
  return (
    <>
      {isSmallScreen &&
        <div ref={sidebarRef} className={cx(classes.sidebar, { [classes.sidebarActive]: opened === true })}>
          <Sidebar handleClick={close} links={menuList} />
        </div>
      }
      <header className={classes.root}>
        <div className={classes.leftContainer}>
          <Burger ref={burgerRef} opened={opened} onClick={toggle} className={classes.burger} size="sm" />

          <Link href="/" passHref>
            <a style={{
              display: "flex",
              alignItems: "center",
            }}>
              <Logo
                iconColor="#e3b04b"
                textColor="#f8f8f8"
                type={isSmallScreen ? "logo-only" : "logo-with-text"}
                size={30}
              />
            </a>
          </Link>
        </div>

        <div className={classes.navbarContainer}>
          <nav className={classes.navbar}>
            {menuList.map((item) => (
              <Link href={item.link} key={item.label} passHref>
                <a className={cx(classes.navbarItem, { [classes.navbarItemActive]: item.link === currentRoute })}>
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
                <Button className={classes.signInButton}
                  styles={(theme) => ({
                    label: {
                      color: "black",
                    },
                  })}
                >
                  Sign In
                </Button>
              </Link>
          }
        </div>
      </header>
    </>
  );
}