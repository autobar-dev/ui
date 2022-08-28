import { useState } from 'react';
import { Group, Collapse } from '@mantine/core';
import { TablerIcon, IconChevronRight } from '@tabler/icons';
import Link from 'next/link'
import styles from './styles/Sidebar.module.css'

interface linksProps {
  links: { label: string; icon?: TablerIcon; link?: string; links?: { label: string; link: string }[] }[]
}

interface linkProps {
  label: string
  link?: string
  icon?: TablerIcon
  links?: { label: string; link: string }[]
}

export function LinksGroup({ label, icon: Icon, link, links }: linkProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(false);

  const items = (hasLinks ? links : []).map((subLink) => (
    <div className={styles.subLink} key={subLink.label}>
      <Link href={subLink.link}>
        <a>
          {subLink.label}
        </a>
      </Link>
    </div>
  ));

  return (
    <>
      <div onClick={() => setOpened((o) => !o)} className={hasLinks ? [styles.control, styles.collapsible].join(' ') : styles.control}>
        <Group position='apart' spacing={0}>
          {hasLinks ?
            <>
              <div className={styles.flexContainer}>
                <div className={styles.icon}>
                  {Icon && <Icon size={30} stroke={1.3} color='#2a8ee7' />}
                </div>
                <div className={styles.label}>
                  {label}
                </div>
              </div>
              <IconChevronRight
                className={styles.chevron}
                size={14}
                stroke={2.5}
                style={{
                  transform: opened ? `rotate(90deg)` : 'none',
                }}
              />
            </> :
            <div>
              {link &&
                <Link href={link}>
                  <a className={styles.flexContainer}>
                    <div className={styles.icon}>
                      {Icon && <Icon size={30} stroke={1.3} color='#2a8ee7' />}
                    </div>
                    <div className={styles.label}>
                      {label}
                    </div>
                  </a>
                </Link>
              }
            </div>
          }
        </Group>
      </div>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

export default function Sidebar({ links }: linksProps) {
  const linksCombined = links?.map((link) => <LinksGroup {...link} key={link.label} />);

  return (
    <div className={styles.menu}>
      {linksCombined}
    </div>
  )
}
