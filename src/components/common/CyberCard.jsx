export default function CyberCard({
  children,
  borderColor = 'cyan',
  glow = true,
  className = '',
  ...props
}) {
  const glowShadows = {
    cyan: 'shadow-neon-cyan',
    green: 'shadow-neon-green',
    purple: 'shadow-neon-purple',
    pink: 'shadow-neon-pink',
    yellow: 'shadow-neon-yellow',
  }

  const borderColors = {
    cyan: 'border-cyber-cyan/30',
    green: 'border-cyber-green/30',
    purple: 'border-cyber-purple/30',
    pink: 'border-cyber-pink/30',
    yellow: 'border-cyber-yellow/30',
  }

  return (
    <div
      className={`
        bg-cyber-card border rounded-lg p-6
        ${borderColors[borderColor] || borderColors.cyan}
        ${glow ? glowShadows[borderColor] || glowShadows.cyan : ''}
        transition-all duration-200 hover:border-opacity-60
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
