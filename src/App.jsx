import { useState } from 'react'
import { Award, BookOpenCheck, Lightbulb, Wrench, Map, Code2 } from 'lucide-react'
import Navbar from './components/common/Navbar'
import CyberCard from './components/common/CyberCard'
import CyberButton from './components/common/CyberButton'
import Modal from './components/common/Modal'
import useGameProgress from './hooks/useGameProgress'
import ArenaExamsView from './views/ArenaExamsView'
import FixTheCodeView from './views/FixTheCodeView'
import MissionMap from './components/mission/MissionMap'
import LogicLabView from './views/LogicLabView'

function App() {
  const {
    gameState,
    addXP,
    getRank,
    getXPInLevel,
    toggleSound,
    completeExam,
    completeChallenge,
    completeLogicChallenge,
    addBadge,
  } = useGameProgress()

  const [currentView, setCurrentView] = useState('home') // home | exams | fix-code | missions | logic
  const [modalOpen, setModalOpen] = useState(false)

  const handleExamComplete = (examId, results) => {
    completeExam(examId, results.score)
    // Otorgar XP si el score es >= 80%
    if (results.score >= 80) {
      addXP(200)
    } else if (results.score >= 60) {
      addXP(100)
    } else {
      addXP(50)
    }
  }

  const handleNavigateToMission = (mission) => {
    // Navegar a la vista correspondiente según el tipo de misión
    if (mission.type === 'exam') {
      setCurrentView('exams')
    } else if (mission.type === 'fix-code') {
      setCurrentView('fix-code')
    } else if (mission.type === 'logic') {
      setCurrentView('logic')
    }
  }

  const handleChallengeComplete = (challengeId, xpEarned) => {
    // Marcar desafío como completado
    completeChallenge(challengeId)
    // Otorgar XP
    addXP(xpEarned)
    // Verificar si es el primer desafío completado para dar insignia
    if (gameState.completedChallenges.length === 0) {
      addBadge('bug-hunter')
    }
  }

  const handleLogicChallengeComplete = (challengeId, xpEarned, userCode) => {
    // Marcar desafío de lógica como completado en su propio array (con código)
    completeLogicChallenge(challengeId, userCode)
    // Otorgar XP
    addXP(xpEarned)
    // Verificar si es el primer desafío de lógica completado para dar insignia
    if (gameState.completedLogicChallenges.length === 0) {
      addBadge('logic-pioneer')
    }
  }

  // Renderizado de vistas
  const renderView = () => {
    switch (currentView) {
      case 'exams':
        return (
          <ArenaExamsView
            onBack={() => setCurrentView('home')}
            onComplete={handleExamComplete}
          />
        )
      case 'fix-code':
        return (
          <FixTheCodeView
            onBack={() => setCurrentView('home')}
            onComplete={handleChallengeComplete}
            completedChallenges={gameState.completedChallenges}
          />
        )
      case 'logic':
        return (
          <LogicLabView
            onBack={() => setCurrentView('home')}
            onComplete={handleLogicChallengeComplete}
            completedChallenges={gameState.completedLogicChallenges}
          />
        )
      case 'missions':
        return (
          <MissionMap
            gameState={gameState}
            onBack={() => setCurrentView('home')}
            onNavigateToMission={handleNavigateToMission}
          />
        )
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="py-12 text-center">
              <div className="inline-block">
                <p className="font-mono text-sm text-cyber-green mb-2">
                  {'>'} SYSTEM INITIALIZED...
                </p>
                <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-cyber-cyan drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                  CyberDev Academy
                </h1>
                <p className="font-mono text-base sm:text-lg text-cyber-purple mt-4 max-w-2xl mx-auto">
                  {'>'} Plataforma gamificada de práctica de programación web
                </p>
              </div>
            </section>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <CyberCard borderColor="green">
                <p className="font-mono text-xs text-cyber-green uppercase tracking-wider mb-1">
                  XP Total
                </p>
                <p className="font-mono text-2xl font-bold text-cyber-green">
                  {gameState.xp}
                </p>
              </CyberCard>

              <CyberCard borderColor="cyan">
                <p className="font-mono text-xs text-cyber-cyan uppercase tracking-wider mb-1">
                  Nivel
                </p>
                <p className="font-mono text-2xl font-bold text-cyber-cyan">
                  {gameState.level}
                </p>
              </CyberCard>

              <CyberCard borderColor="purple">
                <p className="font-mono text-xs text-cyber-purple uppercase tracking-wider mb-1">
                  Rango
                </p>
                <p className="font-mono text-lg font-bold text-cyber-purple">
                  {getRank()}
                </p>
              </CyberCard>

              <CyberCard borderColor="yellow">
                <p className="font-mono text-xs text-cyber-yellow uppercase tracking-wider mb-1">
                  Insignias
                </p>
                <p className="font-mono text-2xl font-bold text-cyber-yellow">
                  {gameState.badges.length}
                </p>
              </CyberCard>
            </section>

            {/* Módulos de la plataforma */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <CyberCard borderColor="green" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-center">
                  <BookOpenCheck className="mx-auto mb-3 text-cyber-green" size={34} strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="font-mono text-lg font-bold text-cyber-green mb-2">
                    Arena de Exámenes
                  </h2>
                  <p className="font-mono text-xs text-cyber-text mb-4">
                    Simuladores teóricos y técnicos con 25 preguntas aleatorias
                  </p>
                  <CyberButton color="green" onClick={() => setCurrentView('exams')}>
                    ACCEDER
                  </CyberButton>
                </div>
              </CyberCard>

              <CyberCard borderColor="purple" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-center">
                  <Wrench className="mx-auto mb-3 text-cyber-purple" size={34} strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="font-mono text-lg font-bold text-cyber-purple mb-2">
                    Fix the Code
                  </h2>
                  <p className="font-mono text-xs text-cyber-text mb-4">
                    Depuración en vivo con Monaco Editor — 10 desafíos
                  </p>
                  <CyberButton color="purple" onClick={() => setCurrentView('fix-code')}>
                    ACCEDER
                  </CyberButton>
                </div>
              </CyberCard>

              <CyberCard borderColor="yellow" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-center">
                  <Code2 className="mx-auto mb-3 text-cyber-yellow" size={34} strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="font-mono text-lg font-bold text-cyber-yellow mb-2">
                    Laboratorio de Lógica
                  </h2>
                  <p className="font-mono text-xs text-cyber-text mb-4">
                    Algoritmos y desafíos de programación — 10 retos
                  </p>
                  <CyberButton color="yellow" onClick={() => setCurrentView('logic')}>
                    ACCEDER
                  </CyberButton>
                </div>
              </CyberCard>

              <CyberCard borderColor="cyan" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-center">
                  <Map className="mx-auto mb-3 text-cyber-cyan" size={34} strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="font-mono text-lg font-bold text-cyber-cyan mb-2">
                    Mapa de Misiones
                  </h2>
                  <p className="font-mono text-xs text-cyber-text mb-4">
                    Explora tu progreso y desbloquea nuevas misiones
                  </p>
                  <CyberButton color="cyan" onClick={() => setCurrentView('missions')}>
                    EXPLORAR
                  </CyberButton>
                </div>
              </CyberCard>
            </section>

            {/* Actions */}
            <section className="flex flex-wrap gap-4 justify-center mb-12">
              <CyberButton color="cyan" variant="outline" onClick={() => setModalOpen(true)}>
                Acerca del Sistema
              </CyberButton>
            </section>

            {/* Terminal Info */}
            <section className="mb-12">
              <CyberCard borderColor="cyan">
                <div className="font-mono text-sm space-y-2">
                  <p className="text-cyber-green">{'>'} CONSOLE.LOG("Bienvenido a CyberDev Academy");</p>
                  <p className="text-cyber-cyan">{'>'} // Tu viaje como programador en formación comienza aquí</p>
                  <p className="text-cyber-purple">{'>'} // Fase 3: Arena de Exámenes — COMPLETADA</p>
                  <p className="text-cyber-yellow animate-pulse">{'>'} SYSTEM_READY</p>
                </div>
              </CyberCard>
            </section>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text font-sans">
      <a href="#main-content" className="cyber-skip-link bg-cyber-cyan text-cyber-dark px-3 py-2 rounded font-mono text-xs font-bold">
        Saltar al contenido
      </a>
      {/* Navbar */}
      <Navbar
        currentXP={getXPInLevel()}
        maxXP={1000}
        level={gameState.level}
        rank={getRank()}
        soundEnabled={gameState.soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content */}
      <main id="main-content" className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div key={currentView} className="animate-page-enter">
          {renderView()}
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="SISTEMA_INICIALIZADO"
        borderColor="cyan"
      >
        <div className="font-mono text-sm space-y-3">
          <p className="text-cyber-green">
            {'>'} CyberDev Academy v1.0.0
          </p>
          <p className="text-cyber-text">
            Plataforma educativa gamificada con estética cyberpunk para
            aprender y practicar programación web.
          </p>
          <p className="text-cyber-cyan">
            {'>'} Stack: React + Vite + Tailwind CSS
          </p>
          <p className="text-cyber-purple">
            {'>'} Fase 3: Arena de Exámenes — COMPLETADA
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default App
