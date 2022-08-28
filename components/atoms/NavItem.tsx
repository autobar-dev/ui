import Link from 'next/link'
import { TablerIcon, IconChevronDown } from '@tabler/icons';
import styles from './styles/NavItem.module.css'

interface ItemProps {
  links: { label: string; icon?: TablerIcon; link?: string; links?: { label: string; link: string }[] }[],
  login?: boolean,
  signup?: boolean
}

export default function NavItem({ links, login = false, signup = false }: ItemProps, ) {

  const items = links.map((link) => {
    const hasLinks = Array.isArray(link.links);

    if (hasLinks) {
      const subItems = link.links?.map((subLink) => {
        return (
          <div key={subLink.label}>
            <Link href={subLink.link}>
              <a className={styles.link}>{subLink.label}</a>
            </Link>
          </div>
        )
      })

      return (
        <div className={styles.dropdown} key={link.label}>
          <div className={[styles.highlight, styles.link].join(' ')}>
            {link.label}
            <>&nbsp;</>
            <IconChevronDown size={14} stroke={2.5} />
          </div>
          <div className={styles.dropdownContent}>
            {subItems}
          </div>
        </div>
      )
    }

    const mode = login ? styles.login : (signup ? styles.register : null)
    return (
      <div key={link.label}>
        {link.link &&
          <Link href={link.link}>
            <a className={[styles.highlight, styles.link, mode].join(' ')}>{link.label}</a>
          </Link>
        }
      </div>
    )
  })

  return (
    <div>
      {items}
    </div>
  )
}
