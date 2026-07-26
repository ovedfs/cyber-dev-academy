import { useState } from 'react'

const colorMap = {
  cyan: {
    bg: 'bg-cyber-cyan',
    shadow: 'shadow-neon-cyan',
    border: 'border-cyber-cyan',
    hover: 'hover:bg-cyber-cyan/20',
  },
  green: {
    bg: 'bg-cyber-green',
    shadow: 'shadow-neon-green',
    border: 'border-cyber-green',
    hover: 'hover:bg-cyber-green/20',
  },
  purple: {
    bg: 'bg-cyber-purple',
    shadow: 'shadow-neon-purple',
    border: 'border-cyber-purple',
    hover: 'hover:bg-cyber-purple/20',
  },
  pink: {
    bg: 'bg-cyber-pink',
    shadow: 'shadow-neon-pink',
    border: 'border-cyber-pink',
    hover: 'hover:bg-cyber-pink/20',
  },
}

export default function CyberButton({
  children,
  color = 'cyan',
  variant = 'solid',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false)
  const colors = colorMap[color] || colorMap.cyan

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  const baseClasses = `
    relative font-mono font-semibold uppercase tracking-wider
    inline-flex items-center justify-center gap-2 rounded-md border transition-all duration-150 ease-in-out
    disabled:opacity-40 disabled:cursor-not-allowed
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-dark
    ${sizeClasses[size] || sizeClasses.md}
    ${isPressed ? 'scale-95' : 'motion-safe:hover:scale-105'}
  `

  const solidClasses = `
    ${colors.bg} text-cyber-dark ${colors.shadow}
    ${colors.hover} border-transparent
    hover:brightness-110
  `

  const outlineClasses = `
    bg-transparent ${colors.border} text-${color === 'cyan' ? 'cyber-cyan' : color === 'green' ? 'cyber-green' : color === 'purple' ? 'cyber-purple' : 'cyber-pink'}
    ${colors.shadow} ${colors.hover}
  `

  const variantClasses = variant === 'outline' ? outlineClasses : solidClasses

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  )
}
