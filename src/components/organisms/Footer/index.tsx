import { Container, Group, Button, Text, Center } from "@mantine/core";
import { IconBrandFacebook, IconBrandYoutube, IconBrandInstagram } from "@tabler/icons";
import { useStyles } from "./styles";
import Link from "next/link";
import Logo from "../../molecules/Logo";

export default function Footer() {
  const { classes, theme } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group spacing={8}>
          <Text color={theme.colors.defaultGray[0]}>
            &copy; 2022
          </Text>
          <Link href="/" passHref>
            <a style={{
              display: "flex",
              alignItems: "center",
            }}>
              <Logo
                textColor={theme.colors.defaultGray[0]}
                type={"text-only"}
                size={12}
              />
            </a>
          </Link>
        </Group>
        <Group spacing={0} className={classes.links} position="right" noWrap>
          <Link href="https://www.instagram.com" passHref>
            <Button component="a" className={classes.icon}>
              <Center>
                <IconBrandInstagram size={20} stroke={1.5} color={theme.colors.defaultGray[0]}/>
              </Center>
            </Button>
          </Link>
          <Link href="https://www.facebook.com" passHref>
            <Button component="a" className={classes.icon}>
              <Center>
                <IconBrandFacebook size={20} stroke={1.5} color={theme.colors.defaultGray[0]}/>
              </Center>
            </Button>
          </Link>
          <Link href="https://www.youtube.com" passHref>
            <Button component="a" className={classes.icon}>
              <Center>
                <IconBrandYoutube size={20} stroke={1.5} color={theme.colors.defaultGray[0]}/>
              </Center>
            </Button>
          </Link>
        </Group>
      </Container >
    </div >
  );
}