import { useState } from 'react'
import { ArrowLeft, Map, ChevronRight } from 'lucide-react'
import CyberCard from '../common/CyberCard'
import CyberButton from '../common/CyberButton'
import MissionNode from './MissionNode'
import missions from '../../data/missions'

const moduleColors = {
  'Arena de Exámenes': 'green',
  'Fix the Code': 'purple',
  'Laboratorio de Lógica': 'yellow',
}

const moduleIcons = {
  'Arena de Exámenes': '📖',
  'Fix the Code': '🔧',
  'Laboratorio de Lógica': '💡',
}

export default function MissionMap({
  gameState,
  onBack,
  onNavigateToMission,
}) {
  const [selectedModule, setSelectedModule] = useState(null)
  const [hoveredMission, setHoveredMission] = useState(null)

  // Agrupar misiones por módulo
  const modules = missions.reduce((acc, mission) => {
    if (!acc[mission.module]) {
      acc[mission.module] = []
    }
    acc[mission.module].push(mission)
    return acc
  }, {})

  const moduleNames = Object.keys(modules)

  // Determinar el estado de una misión
  const getMissionStatus = (mission) => {
    const { xp } = gameState

    // Verificar si está completada según el tipo
    let isCompleted = false
    if (mission.type === 'exam') {
      isCompleted = gameState.completedExams.some((e) => e.id === mission.id)
    } else if (mission.type === 'fix-code') {
      isCompleted = gameState.completedChallenges.includes(mission.id)
    } else if (mission.type === 'logic') {
      isCompleted = gameState.completedLogicChallenges.includes(mission.id)
    }

    if (isCompleted) return 'completed'
    if (xp >= mission.requiredXP) return 'unlocked'
    return 'locked'
  }

  // Calcular progreso de un módulo
  const getModuleProgress = (moduleName) => {
    const moduleMissions = modules[moduleName]
    const completed = moduleMissions.filter(
      (m) => getMissionStatus(m) === 'completed'
    ).length
    return {
      completed,
      total: moduleMissions.length,
      percentage: Math.round((completed / moduleMissions.length) * 100),
    }
  }

  // Manejar clic en un nodo
  const handleNodeClick = (mission) => {
    if (onNavigateToMission) {
      onNavigateToMission(mission)
    }
  }

  // Vista de selección de módulos
  const renderModuleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-mono text-2xl font-bold text-cyber-cyan text-glow-cyan mb-2">
          MAPA DE MISIONES
        </h2>
        <p className="font-mono text-sm text-cyber-text/70">
          Selecciona un módulo para ver sus misiones
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {moduleNames.map((moduleName) => {
          const progress = getModuleProgress(moduleName)
          const color = moduleColors[moduleName] || 'cyan'
          const icon = moduleIcons[moduleName] || '❓'

          return (
            <CyberCard
              key={moduleName}
              borderColor={color}
              className="cursor-pointer hover:scale-[1.03] transition-transform"
            >
              <button
                className="w-full text-left"
                onClick={() => setSelectedModule(moduleName)}
                aria-label={`Ver misiones de ${moduleName}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className={`font-mono text-sm font-bold text-cyber-${color}`}>
                      {moduleName}
                    </h3>
                    <p className="font-mono text-xs text-cyber-text/60">
                      {progress.completed}/{progress.total} completadas
                    </p>
                  </div>
                  <ChevronRight className={`ml-auto text-cyber-${color}`} size={20} />
                </div>

                {/* Barra de progreso */}
                <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-cyber-${color}`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <p className={`font-mono text-xs text-cyber-${color} mt-1 text-right`}>
                  {progress.percentage}%
                </p>
              </button>
            </CyberCard>
          )
        })}
      </div>

      {/* Resumen global */}
      <CyberCard borderColor="cyan">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="text-cyber-cyan" size={20} />
            <span className="font-mono text-sm text-cyber-text">
              Progreso global
            </span>
          </div>
          <span className="font-mono text-sm text-cyber-cyan font-bold">
            {missions.filter((m) => getMissionStatus(m) === 'completed').length} / {missions.length} misiones
          </span>
        </div>
      </CyberCard>
    </div>
  )

  // Vista detallada de un módulo
  const renderModuleDetail = () => {
    const moduleMissions = modules[selectedModule]
    const progress = getModuleProgress(selectedModule)
    const color = moduleColors[selectedModule] || 'cyan'

    return (
      <div className="space-y-6">
        {/* Header del módulo */}
        <div className="flex items-center gap-3 mb-6">
          <CyberButton color="cyan" variant="outline" size="sm" onClick={() => setSelectedModule(null)}>
            <ArrowLeft size={16} />
            VOLVER
          </CyberButton>
          <div>
            <h2 className={`font-mono text-xl font-bold text-cyber-${color}`}>
              {moduleIcons[selectedModule]} {selectedModule}
            </h2>
            <p className="font-mono text-xs text-cyber-text/60">
              {progress.completed}/{progress.total} completadas · {progress.percentage}%
            </p>
          </div>
        </div>

        {/* Barra de progreso del módulo */}
        <div className="w-full h-3 bg-cyber-dark rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 bg-cyber-${color} shadow-neon-${color}`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Grid de nodos */}
        <div className="relative">
          {/* SVG para líneas conectoras */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {moduleMissions.map((mission, index) => {
              if (index === 0) return null
              const prevMission = moduleMissions[index - 1]
              const prevStatus = getMissionStatus(prevMission)
              const currStatus = getMissionStatus(mission)
              const lineColor =
                prevStatus === 'completed'
                  ? `var(--color-cyber-${color})`
                  : 'rgba(255,255,255,0.1)'

              return (
                <line
                  key={`line-${mission.id}`}
                  x1="50%"
                  y1={`${((index - 1) * 100) / moduleMissions.length + 12}%`}
                  x2="50%"
                  y2={`${(index * 100) / moduleMissions.length - 12}%`}
                  stroke={lineColor}
                  strokeWidth="2"
                  strokeDasharray={currStatus === 'locked' ? '4 4' : 'none'}
                  className="transition-colors duration-500"
                />
              )
            })}
          </svg>

          {/* Nodos */}
          <div className="relative z-10 space-y-8">
            {moduleMissions.map((mission, index) => {
              const status = getMissionStatus(mission)
              const isFirst = index === 0
              const isLast = index === moduleMissions.length - 1

              return (
                <div key={mission.id} className="flex items-center gap-6">
                  {/* Indicador de número */}
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    font-mono text-xs font-bold border
                    ${status === 'completed'
                      ? `bg-cyber-${color}/20 border-cyber-${color} text-cyber-${color}`
                      : status === 'unlocked'
                        ? `bg-cyber-${color}/10 border-cyber-${color}/50 text-cyber-${color}`
                        : 'bg-cyber-card border-cyber-border text-cyber-text/40'
                    }
                  `}>
                    {index + 1}
                  </div>

                  {/* Nodo visual */}
                  <div className="flex-1">
                    <MissionNode
                      mission={mission}
                      status={status}
                      onClick={handleNodeClick}
                    />
                  </div>

                  {/* Info de la misión (tooltip) */}
                  <div
                    className="hidden sm:block flex-1"
                    onMouseEnter={() => setHoveredMission(mission.id)}
                    onMouseLeave={() => setHoveredMission(null)}
                  >
                    <p className={`font-mono text-sm font-bold ${
                      status === 'locked' ? 'text-cyber-text/40' : 'text-cyber-text'
                    }`}>
                      {mission.title}
                    </p>
                    <p className={`font-mono text-xs mt-1 ${
                      status === 'locked' ? 'text-cyber-text/30' : 'text-cyber-text/60'
                    }`}>
                      {mission.description}
                    </p>
                    {status === 'locked' && (
                      <p className="font-mono text-xs text-cyber-yellow/60 mt-1">
                        🔒 Requiere {mission.requiredXP} XP
                      </p>
                    )}
                    {status === 'unlocked' && (
                      <p className={`font-mono text-xs text-cyber-${color} mt-1`}>
                        +{mission.xpReward} XP al completar
                      </p>
                    )}
                    {status === 'completed' && (
                      <p className="font-mono text-xs text-cyber-green mt-1">
                        ✓ Completada
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <CyberButton color="cyan" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
          INICIO
        </CyberButton>
        <div>
          <p className="font-mono text-xs text-cyber-green">
            {'>'} NAVIGATING_MISSION_MAP
          </p>
        </div>
      </div>

      {/* Contenido */}
      {selectedModule ? renderModuleDetail() : renderModuleSelection()}
    </div>
  )
}