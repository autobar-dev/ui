import { Avatar, Button, Menu } from "@mantine/core";
import { IconCash, IconWallet } from "@tabler/icons";
import Link from "next/link";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import ProfileIcon from "../../atoms/ProfileIcon";
import SignOutIcon from "../../atoms/SignOutIcon";
import { useStyles } from "./styles";

export default function UserMenu() {
  const { user, flushUser } = useContext(UserContext);
  const { classes } = useStyles();

  const handleSignOutButtonClick = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    await flushUser();
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
          src={user?.profilePicture ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${user.profilePicture}` : undefined}
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Link href="/topup" passHref>
          <Menu.Item
            component="a"
            className={classes.menuItem}
            icon={
              <IconWallet
                size={20}
                color="#c1c2c5"
                className={classes.menuItemIcon}
                style={{
                  marginRight: "1px",
                }}
              />
            }
          >
            Balance: {user?.balance} <i>{user?.balanceCurrency}</i>
          </Menu.Item>
        </Link>
        <Menu.Divider />
        <Link href="/profile" passHref>
          <Menu.Item
            component="a"
            className={classes.menuItem}
            icon={
              <ProfileIcon
                color="#c1c2c5"
                className={classes.menuItemIcon}
                style={{
                  width: "14px",
                }}
              />
            }
          >
            Profile
          </Menu.Item>
        </Link>
        <Link href="/transactions" passHref>
          <Menu.Item
            component="a"
            className={classes.menuItem}
            icon={
              <IconCash
                size={20}
                color="#c1c2c5"
                className={classes.menuItemIcon}
                style={{
                  marginRight: "1px",
                }}
              />
            }
          >
            Transactions
          </Menu.Item>
        </Link>
        <Menu.Divider />
        <Menu.Item
          onClick={handleSignOutButtonClick}
          className={classes.menuItem}
          icon={
            <SignOutIcon
              color="#c1c2c5"
              className={classes.menuItemIcon}
              style={{
                width: "14px",
              }}
            />
          }
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}