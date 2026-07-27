import { Lock, Star } from 'lucide-react'

const iconMap = {
  BookOpenCheck: '📖',
  Wrench: '🔧',
  Lightbulb: '💡',
}

const colorConfig = {
  green: {
    border: 'border-cyber-green',
    bg: 'bg-cyber-green/10',
    glow: 'shadow-neon-green',
    text: 'text-cyber-green',
    ring: 'ring-cyber-green',
  },
  purple: {
    border: 'border-cyber-purple',
    bg: 'bg-cyber-purple/10',
    glow: 'shadow-neon-purple',
    text: 'text-cyber-purple',
    ring: 'ring-cyber-purple',
  },
  yellow: {
    border: 'border-cyber-yellow',
    bg: 'bg-cyber-yellow/10',
    glow: 'shadow-neon-yellow',
    text: 'text-cyber-yellow',
    ring: 'ring-cyber-yellow',
  },
  cyan: {
    border: 'border-cyber-cyan',
    bg: 'bg-cyber-cyan/10',
    glow: 'shadow-neon-cyan',
    text: 'text-cyber-cyan',
    ring: 'ring-cyber-cyan',
  },
}

export default function MissionNode({
  mission,
  status, // 'locked' | 'unlocked' | 'completed'
  onClick,
  style,
}) {
  const colors = colorConfig[mission.color] || colorConfig.cyan
  const emoji = iconMap[mission.icon] || '❓'

  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'

  const nodeClasses = `
    relative flex flex-col items-center justify-center
    w-20 h-20 sm:w-24 sm:h-24 rounded-full
    border-2 transition-all duration-300 ease-out
    cursor-pointer select-none
    ${isLocked
      ? 'border-cyber-border bg-cyber-card/50 opacity-40 cursor-not-allowed'
      : isCompleted
        ? `${colors.border} ${colors.bg} ${colors.glow}`
        : `${colors.border} ${colors.bg} ${colors.glow} hover:scale-110 hover:brightness-125`
    }
    ${!isLocked ? 'animate-fade-in' : ''}
  `

  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick(mission)
    }
  }

  return (
    <div className="relative flex flex-col items-center" style={style}>
      {/* Línea conectora superior (opcional, se renderiza desde el SVG del mapa) */}

      {/* Nodo */}
      <button
        className={nodeClasses}
        onClick={handleClick}
        disabled={isLocked}
        title={isLocked ? `Requiere ${mission.requiredXP} XP` : mission.title}
        aria-label={`${mission.title} - ${status}`}
      >
        {isLocked ? (
          <Lock size={22} className="text-cyber-text/50" />
        ) : isCompleted ? (
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl">{emoji}</span>
            <div className="flex gap-0.5 mt-0.5">
              <Star size={10} className="fill-cyber-yellow text-cyber-yellow" />
              <Star size={10} className="fill-cyber-yellow text-cyber-yellow" />
              <Star size={10} className="fill-cyber-yellow text-cyber-yellow" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl">{emoji}</span>
            <span className={`text-[10px] font-mono font-bold mt-0.5 ${colors.text}`}>
              {mission.xpReward} XP
            </span>
          </div>
        )}
      </button>

      {/* Etiqueta del nodo */}
      <span className={`
        mt-2 text-[10px] sm:text-xs font-mono text-center leading-tight max-w-[100px]
        ${isLocked ? 'text-cyber-text/40' : 'text-cyber-text'}
      `}>
        {mission.title}
      </span>
    </div>
  )
}