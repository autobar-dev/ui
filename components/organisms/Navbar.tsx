import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import NavItem from '../atoms/NavItem'
import { Burger } from '@mantine/core'
import Sidebar from './Sidebar'
import { IconHome2, IconBeer, IconMap2, IconMail } from '@tabler/icons';
import styles from './styles/Navbar.module.css'

interface sizeType {
  width: number | undefined;
  height: number | undefined;
}

const menuList = [
  { label: 'Home', link: '/', icon: IconHome2 },
  { label: 'Products', link: '/products', icon: IconBeer },
  { label: 'Map', link: '/map', icon: IconMap2 },
  { label: 'Contact', link: '/contact', icon: IconMail, links: [{ label: 'FAQ', link: '/faq' }, { label: 'Help', link: '/help' }] }
]

function useWindowSize(): sizeType {
  const [windowSize, setWindowSize] = useState<sizeType>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default function Navbar() {
  const [navActive, setNavActive] = useState(false)
  const [opened, setOpened] = useState(false)
  const size: sizeType = useWindowSize();

  const generateMenu = () => {
    if (size?.width && size.width < 768) {
      return (
        <div className={navActive ? [styles.menuList, styles.active].join(' ') : styles.menuList}>
          <Sidebar links={menuList} />
        </div>
      )
    }

    return (
      <div className={styles.menuList}>
        {menuList.map((menu) => (
          <div onClick={() => { setNavActive(false) }} key={menu.label}>
            <NavItem links={[{ ...menu }]} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <header>
      <nav className={styles.navBar}>
        <div className={styles.flexContainer}>

          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Link href={'/'} passHref>
                <a>
                  <Image
                    alt='Logo'
                    src='/images/logo.png'
                    width={1156}
                    height={252}
                    layout='responsive'
                    // priority={true}
                  />
                </a>
              </Link>
            </div>
          </div>

          <div className={styles.menuContainer}>{generateMenu()}</div>

          <div className={styles.loginContainer}>
            <NavItem links={[{ label: 'Log In', link: 'login' }]} login={true} />
          </div>

          <div className={styles.menuBar}>
            <NavItem links={[{ label: 'Log In', link: 'login' }]} login={true} />
            <Burger
              opened={opened}
              onClick={() => {
                setOpened((o) => !o)
                setNavActive(!navActive)
              }}
            />

          </div>
        </div>
      </nav>
    </header>
  )
}
