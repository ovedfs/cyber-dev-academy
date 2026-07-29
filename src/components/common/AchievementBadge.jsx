import { useState } from 'react'
import { Lock, Sparkles } from 'lucide-react'

const colorMap = {
  green: {
    border: 'border-cyber-green/40',
    glow: 'shadow-neon-green',
    text: 'text-cyber-green',
    bg: 'bg-cyber-green/10',
    icon: 'text-cyber-green',
  },
  cyan: {
    border: 'border-cyber-cyan/40',
    glow: 'shadow-neon-cyan',
    text: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/10',
    icon: 'text-cyber-cyan',
  },
  purple: {
    border: 'border-cyber-purple/40',
    glow: 'shadow-neon-purple',
    text: 'text-cyber-purple',
    bg: 'bg-cyber-purple/10',
    icon: 'text-cyber-purple',
  },
  pink: {
    border: 'border-cyber-pink/40',
    glow: 'shadow-neon-pink',
    text: 'text-cyber-pink',
    bg: 'bg-cyber-pink/10',
    icon: 'text-cyber-pink',
  },
  yellow: {
    border: 'border-cyber-yellow/40',
    glow: 'shadow-neon-yellow',
    text: 'text-cyber-yellow',
    bg: 'bg-cyber-yellow/10',
    icon: 'text-cyber-yellow',
  },
}

export default function AchievementBadge({
  achievement,
  unlocked = false,
  isNew = false,
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const colors = colorMap[achievement.color] || colorMap.cyan

  return (
    <div
      className={`
        relative group
        flex flex-col items-center gap-2 p-4 rounded-lg
        border transition-all duration-300 cursor-pointer
        ${unlocked ? colors.border + ' ' + colors.glow : 'border-cyber-border opacity-50 hover:opacity-70'}
        ${unlocked ? colors.bg : 'bg-cyber-card'}
        hover:scale-105
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="listitem"
      aria-label={`${achievement.title}: ${achievement.description}${unlocked ? ' — Desbloqueado' : ' — Bloqueado'}`}
      tabIndex={0}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {/* Icono de "nuevo" */}
      {isNew && (
        <span className="absolute -top-2 -right-2 animate-fade-in">
          <Sparkles size={18} className="text-cyber-yellow drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" aria-label="¡Nuevo!" />
        </span>
      )}

      {/* Icono del logro o candado */}
      <span className={`text-4xl ${unlocked ? '' : 'grayscale'}`} role="img" aria-hidden="true">
        {unlocked ? achievement.icon : <Lock size={32} className="text-cyber-text/40" />}
      </span>

      {/* Nombre */}
      <p className={`font-mono text-xs font-bold text-center ${unlocked ? colors.text : 'text-cyber-text/50'}`}>
        {achievement.title}
      </p>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 w-48 pointer-events-none">
          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-3 shadow-lg">
            <p className={`font-mono text-xs font-bold mb-1 ${colors.text}`}>
              {achievement.title}
            </p>
            <p className="font-mono text-[10px] text-cyber-text/80 mb-1">
              {achievement.description}
            </p>
            {unlocked && achievement.xpReward && (
              <p className="font-mono text-[10px] text-cyber-green">
                +{achievement.xpReward} XP
              </p>
            )}
            {!unlocked && (
              <p className="font-mono text-[10px] text-cyber-text/50 italic">
                🔒 Por desbloquear
              </p>
            )}
          </div>
          {/* Flecha del tooltip */}
          <div className="w-2 h-2 bg-cyber-dark border-r border-b border-cyber-border rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  )
}