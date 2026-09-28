import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import cn from 'classnames'

type Variant = 'primary' | 'secondary' | 'ghost'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  to?: string
  icon?: React.ReactNode
  disabled?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'text-white border-transparent',
  secondary: 'text-[var(--ink)] border-[var(--line)] bg-[var(--surface)]',
  ghost: 'text-[var(--ink-soft)] border-transparent',
}

export default function Button({ variant = 'primary', to, icon, children, className, disabled, ...rest }: Props) {
  const baseClasses = cn(
    'inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-sm leading-none rounded-sm border transition-colors cursor-pointer',
    variantClasses[variant],
    disabled && 'opacity-50 cursor-not-allowed',
    variant === 'primary' && !disabled && 'bg-[var(--ink)] hover:bg-[#000] border-[var(--ink)]',
    className
  )

  const btn = to && !disabled ? (
    <Link to={to} className="no-underline">
      <span className={baseClasses}>
        {children}
        {icon}
      </span>
    </Link>
  ) : (
    <button disabled={disabled} className={baseClasses} {...rest}>
      {children}
      {icon}
    </button>
  )

  return (
    <motion.span
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className="inline-flex"
    >
      {btn}
    </motion.span>
  )
}