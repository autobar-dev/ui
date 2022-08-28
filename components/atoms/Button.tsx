import styles from './styles/Button.module.css'

interface ButtonProps {
  login?: boolean
  backgroundColor?: string
  justifyContent?: string
  label: string;
  onClick?: () => void
}

export default function Button({
  login = false,
  backgroundColor,
  justifyContent = 'center',
  label,
  ...props
}: ButtonProps) {
  const mode = login ? styles.login : styles.primary
  return (
    <div className={styles.buttonWrapper} style={{ justifyContent }}>
      <button className={[styles.button, mode].join(' ')} onClick={props.onClick} style={{ backgroundColor }}>{label}</button>
    </div>
  )
}
