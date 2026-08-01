import { useEffect, useState, useRef } from 'react'
import { ArrowLeft, Trophy, Zap, Lock, Unlock } from 'lucide-react'
import confetti from 'canvas-confetti'
import CyberCard from '../components/common/CyberCard'
import CyberButton from '../components/common/CyberButton'
import AchievementBadge from '../components/common/AchievementBadge'
import useAchievements from '../hooks/useAchievements'

export default function AchievementsView({
  gameState,
  addBadge,
  addXP,
  onBack,
  playLevelUp,
}) {
  const viewRef = useRef(null)
  const {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    unlockedCount,
    totalAchievements,
    checkNewAchievements,
  } = useAchievements(gameState, addBadge, addXP)

  const [filter, setFilter] = useState('all') // 'all' | 'unlocked' | 'locked'
  const [newAchievements, setNewAchievements] = useState([])
  const [showNewBanner, setShowNewBanner] = useState(false)

  // Verificar logros nuevos al montar o cuando cambie gameState
  useEffect(() => {
    const newlyUnlocked = checkNewAchievements()
    if (newlyUnlocked.length > 0) {
      setNewAchievements((prev) => [...prev, ...newlyUnlocked.map((a) => a.id)])
      setShowNewBanner(true)
      if (playLevelUp) playLevelUp()
      // Confetti al desbloquear logros
      const rect = viewRef.current?.getBoundingClientRect()
      if (rect) {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { x: 0.5, y: 0.3 },
          colors: ['#ffcc00', '#00e5ff', '#9d00ff', '#00ff66', '#ff66cc'],
        })
      }
      const timer = setTimeout(() => setShowNewBanner(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [gameState.xp, gameState.completedChallenges.length, gameState.completedLogicChallenges?.length, gameState.completedExams?.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const displayedAchievements = filter === 'all'
    ? achievements
    : filter === 'unlocked'
      ? unlockedAchievements
      : lockedAchievements

  const progressPercent = totalAchievements > 0
    ? Math.round((unlockedCount / totalAchievements) * 100)
    : 0

  const filterOptions = [
    { value: 'all', label: 'Todos', icon: Trophy },
    { value: 'unlocked', label: 'Desbloqueados', icon: Unlock },
    { value: 'locked', label: 'Bloqueados', icon: Lock },
  ]

  return (
    <div ref={viewRef} className="animate-page-enter">
      {/* Banner de nuevos logros */}
      {showNewBanner && newAchievements.length > 0 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <CyberCard borderColor="yellow" className="text-center !py-4 !px-8">
            <div className="flex items-center gap-3">
              <Zap size={24} className="text-cyber-yellow" />
              <div>
                <p className="font-mono text-sm font-bold text-cyber-yellow">
                  ¡Nuevos Logros Desbloqueados!
                </p>
                <p className="font-mono text-xs text-cyber-text">
                  {newAchievements.length} {newAchievements.length === 1 ? 'logro obtenido' : 'logros obtenidos'}
                </p>
              </div>
            </div>
          </CyberCard>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CyberButton color="cyan" variant="outline" onClick={onBack}>
            <ArrowLeft size={18} />
          </CyberButton>
          <h1 className="font-mono text-2xl font-bold text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            {'>'} LOGROS
          </h1>
        </div>
        <span className="font-mono text-xs text-cyber-text/60">
          {unlockedCount}/{totalAchievements}
        </span>
      </div>

      {/* Barra de progreso global */}
      <CyberCard borderColor="purple" className="mb-6">
        <div className="flex items-center gap-4">
          <Trophy size={28} className="text-cyber-purple" aria-hidden="true" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="font-mono text-xs text-cyber-text/70">Progreso Global</p>
              <p className="font-mono text-xs font-bold text-cyber-purple">{progressPercent}%</p>
            </div>
            <div className="w-full h-2 bg-cyber-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
      </CyberCard>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`
              flex items-center gap-1.5 font-mono text-xs px-3 py-2 rounded border
              transition-all duration-200
              ${filter === value
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                : 'bg-cyber-card border-cyber-border text-cyber-text/60 hover:border-cyber-text/30'
              }
            `}
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Grid de logros */}
      {displayedAchievements.length === 0 ? (
        <CyberCard borderColor="cyan" className="text-center py-8">
          <p className="font-mono text-sm text-cyber-text/60">
            {filter === 'unlocked'
              ? 'Aún no has desbloqueado ningún logro. ¡Sigue practicando!'
              : filter === 'locked'
                ? '¡Todos los logros están desbloqueados! 🎉'
                : 'No hay logros disponibles.'}
          </p>
        </CyberCard>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          role="list"
          aria-label="Lista de logros"
        >
          {displayedAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievements.some((a) => a.id === achievement.id)
            const isNew = newAchievements.includes(achievement.id)
            return (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={isUnlocked}
                isNew={isNew}
              />
            )
          })}
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <Unlock size={14} className="text-cyber-green" aria-hidden="true" />
          <span className="font-mono text-[10px] text-cyber-text/50">Desbloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-cyber-text/40" aria-hidden="true" />
          <span className="font-mono text-[10px] text-cyber-text/50">Bloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <SparklesIcon size={14} className="text-cyber-yellow" aria-hidden="true" />
          <span className="font-mono text-[10px] text-cyber-text/50">Nuevo</span>
        </div>
      </div>
    </div>
  )
}

function SparklesIcon({ size, className, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <path d="M18 12l1 3.5L22 16l-3 1-1 3.5-1-3.5L14 16l3-1z" />
      <path d="M6 12l1 3.5L10 16l-3 1-1 3.5-1-3.5L2 16l3-1z" />
    </svg>
  )
}