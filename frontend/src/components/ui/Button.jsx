/**
 * Reusable Button with built-in variants from the design system.
 *
 * Renders a <button> by default, or a react-router <Link> when `to` is
 * given, or an <a> when `href` is given — so call sites never hand-roll
 * styled navigation.
 *
 * Variants: 'primary' | 'ghost' | 'gold' | 'danger'
 * Sizes:    'sm' | 'md' | 'lg'
 */
import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  gold: 'btn-gold',
  danger: 'btn-danger',
};

const SIZES = {
  sm: '!px-4 !py-1.5 !text-xs',
  md: '',
  lg: '!px-8 !py-3.5 !text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = `${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export { VARIANTS, SIZES };
