import Navbar from './/Navbar'
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons';
import Link from 'next/link'
import styles from './styles/Layout.module.css'

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Navbar />

      <div className={styles.wrapper}>
        {children}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>
          © 2022 autobar
        </span>
        <div className={styles.footerIcon}>
          <Link href={'https://piwoharnas.pl'}>
            <a className={styles.link}><IconBrandFacebook size={30} stroke={1.1} color='black' /></a>
          </Link>
          <Link href={'https://piwoharnas.pl'}>
            <a className={styles.link}><IconBrandInstagram size={30} stroke={1.1} color='black' /></a>
          </Link>
        </div>
      </div>
    </>
  )
}
