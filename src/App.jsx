import { useState } from 'react'
import Navbar from './components/common/Navbar'
import CyberCard from './components/common/CyberCard'
import CyberButton from './components/common/CyberButton'
import Modal from './components/common/Modal'
import useGameProgress from './hooks/useGameProgress'

function App() {
  const {
    gameState,
    addXP,
    getRank,
    getXPInLevel,
    toggleSound,
  } = useGameProgress()

  const [modalOpen, setModalOpen] = useState(false)

  const handleAddXP = () => {
    addXP(50)
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text font-sans">
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
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

        {/* Actions */}
        <section className="flex flex-wrap gap-4 justify-center mb-12">
          <CyberButton color="green" onClick={handleAddXP}>
            +50 XP
          </CyberButton>
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
              <p className="text-cyber-purple">{'>'} // Próximamente: Exámenes, Fix the Code, Lógica y más...</p>
              <p className="text-cyber-yellow animate-pulse">{'>'} SYSTEM_READY</p>
            </div>
          </CyberCard>
        </section>
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
            {'>'} Fase 1: Configuración del Entorno y UI Cyberpunk — COMPLETADA
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default App