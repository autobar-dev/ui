import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons';
import Link from 'next/link'
import Footer from '../Footer';
import Header from '../Header';
import { useStyles } from './styles';

export default function Layout({ children }: { children: any }) {
  const { classes } = useStyles();

  const menuList = [
    { label: "Home", link: "/" },
    { label: "Products", link: "products" },
    { label: "Stations", link: "/stations" },
    { label: "Contact", link: "/contact" },
  ]

  return (
    <div className={classes.root}>
      <Header links={menuList}/>
      <div className={classes.container}>
        { children }
      </div>
      <Footer />
    </div>
  );
}

/* 
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
      </div> */
