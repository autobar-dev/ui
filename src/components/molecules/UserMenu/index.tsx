import { Avatar, Button, Menu } from "@mantine/core";
import Link from "next/link";
import { useContext, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import ProfileIcon from "../../atoms/ProfileIcon";
import SignOutIcon from "../../atoms/SignOutIcon";
import { useStyles } from "./styles";
import { getAuth, signOut } from "firebase/auth";

export default function UserMenu() {
  const { user, flushUser } = useContext(UserContext);
  const { classes } = useStyles();

  const [signOutError, setSignOutError] = useState(false);

  const handleSignOutButtonClick = async () => {
    const auth = getAuth();
    
    try {
      await signOut(auth);
      setSignOutError(false);

      await flushUser();
    } catch(e) {
      console.error(e);
      setSignOutError(true);
    }
  };

  return (
    <Menu
      width={200}
      withArrow
      radius={"md"}
      position={"bottom-end"}
      arrowOffset={13}
    >
      <Menu.Target>
        <Avatar
          color="primary"
          size={"md"}
          variant={"filled"}
          radius={"xl"}
          className={classes.userAvatar}
        >
          { user!.name.charAt(0) + user!.surname.charAt(0) }
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Link href="/profile" passHref>
          <Menu.Item
            component="a"
            className={classes.menuItem}
            icon={
              <ProfileIcon
                color="#c1c2c5"
                className={classes.menuItemIcon}
              />
            }
          >
            Profile
          </Menu.Item>
        </Link>
        <Menu.Divider />
        <Menu.Item
          onClick={handleSignOutButtonClick}
          className={classes.menuItem}
          icon={
            <SignOutIcon
              color={signOutError ? "#ef5050" : "#c1c2c5"}
              className={classes.menuItemIcon}
            />
          }
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

/* <Button
        onClick={() => userContext.flushUser()}
      >Flush</Button> */