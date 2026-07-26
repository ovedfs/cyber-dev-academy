import { CheckCircle, Lock, Star, Code, Bug, Zap, Trophy } from 'lucide-react'
import bugChallenges from '../../data/bugChallenges'

const difficultyConfig = {
  easy: {
    label: 'Fácil',
    color: 'text-cyber-green',
    border: 'border-cyber-green/30',
    bg: 'bg-cyber-green/10',
    icon: Bug,
  },
  medium: {
    label: 'Intermedio',
    color: 'text-cyber-yellow',
    border: 'border-cyber-yellow/30',
    bg: 'bg-cyber-yellow/10',
    icon: Zap,
  },
  hard: {
    label: 'Difícil',
    color: 'text-cyber-pink',
    border: 'border-cyber-pink/30',
    bg: 'bg-cyber-pink/10',
    icon: Trophy,
  },
}

export default function ChallengeSelector({
  currentChallengeId,
  completedChallenges = [],
  onSelectChallenge,
  isLocked = false,
}) {
  return (
    <div className="flex flex-col h-full border border-cyber-border rounded-lg overflow-hidden bg-cyber-dark">
      {/* Header */}
      <div className="px-4 py-3 border-b border-cyber-border bg-cyber-card">
        <h3 className="font-mono text-sm font-bold text-cyber-cyan flex items-center gap-2">
          <Code size={14} />
          DESAFÍOS
        </h3>
        <p className="font-mono text-[10px] text-cyber-text/40 mt-0.5">
          {completedChallenges.length} / {bugChallenges.length} completados
        </p>
      </div>

      {/* Lista de desafíos */}
      <div className="flex-1 overflow-y-auto">
        {bugChallenges.map((challenge, index) => {
          const isCurrent = challenge.id === currentChallengeId
          const isCompleted = completedChallenges.includes(challenge.id)
          const isPrevUnlocked = index === 0 || completedChallenges.includes(bugChallenges[index - 1]?.id)
          const canAccess = isPrevUnlocked || isCompleted || isCurrent
          const config = difficultyConfig[challenge.difficulty] || difficultyConfig.easy
          const IconComponent = config.icon

          return (
            <button
              key={challenge.id}
              onClick={() => canAccess && onSelectChallenge(challenge.id)}
              disabled={!canAccess && !isCurrent}
              className={`
                w-full text-left px-4 py-3 border-b border-cyber-border/50
                transition-all duration-150
                ${
                  isCurrent
                    ? 'bg-cyber-cyan/10 border-l-2 border-l-cyber-cyan'
                    : isCompleted
                    ? 'bg-cyber-green/5 hover:bg-cyber-green/10'
                    : canAccess
                    ? 'hover:bg-cyber-card/50'
                    : 'opacity-40 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icono de estado */}
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle size={16} className="text-cyber-green" />
                  ) : isCurrent ? (
                    <IconComponent size={16} className={config.color} />
                  ) : canAccess ? (
                    <IconComponent size={16} className="text-cyber-text/40" />
                  ) : (
                    <Lock size={16} className="text-cyber-text/30" />
                  )}
                </div>

                {/* Info del desafío */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`
                        font-mono text-sm font-semibold truncate
                        ${isCurrent ? 'text-cyber-cyan' : isCompleted ? 'text-cyber-green' : 'text-cyber-text'}
                      `}
                    >
                      {challenge.title}
                    </span>
                    {isCompleted && (
                      <Star size={10} className="text-cyber-yellow fill-cyber-yellow" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${config.color} ${config.bg} ${config.border}`}>
                      {config.label}
                    </span>
                    <span className="font-mono text-[10px] text-cyber-yellow">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}