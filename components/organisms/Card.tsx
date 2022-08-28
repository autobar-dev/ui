import Image from 'next/image'
import Button from '../atoms/Button'
import styles from './styles/Card.module.css'
import { Collapse } from '@mantine/core'
import { useState } from 'react'

interface CardProps {
  link: string
  image: string
  name: string
  type: string
  extract: string
  abv: string
  description: string
}

export default function Card({
  link,
  image,
  name,
  type,
  extract,
  abv,
  description
}: CardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [opened, setOpened] = useState(false)

  const handleMouseOver = () => {
    setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }

  return (
    <div className={styles.card} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className={isHovering ? [styles.image, styles.enlarge].join(' ') : styles.image}>
        <Image
          alt={name}
          src={image}
          layout='fill'
          objectFit='contain'
        />
      </div>

      <div className={styles.content}>
        <div>
          <h2>{name}</h2>
          <br />
          <h4>{type}</h4>
          <h4>Extract: {extract}</h4>
          <h4>ABV: {abv}</h4>
          <Button label='Read more' justifyContent='inherit' onClick={() => setOpened((o) => !o)} />

          <Collapse in={opened} transitionDuration={400}>
            <div className={styles.description}>
              <br />
              {description}
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  )
}