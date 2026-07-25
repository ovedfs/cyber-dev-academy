import { useState } from 'react'
import XPBar from './XPBar'

export default function Navbar({
  currentXP = 0,
  maxXP = 1000,
  level = 1,
  rank = 'Script Kiddie',
  soundEnabled = true,
  onToggleSound,
  className = '',
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-cyber-dark/90 backdrop-blur-md
        border-b border-cyber-border
        px-4 py-3
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
            {'>'} CyberDev_
          </span>
          <span className="font-mono text-xs text-cyber-green animate-pulse">
            ● ONLINE
          </span>
        </div>

        {/* XP Bar (centro) - oculto en mobile */}
        <div className="hidden md:block flex-1 max-w-md">
          <XPBar
            currentXP={currentXP}
            maxXP={maxXP}
            level={level}
            rank={rank}
          />
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-3">
          {/* Botón sonido */}
          <button
            onClick={onToggleSound}
            className="font-mono text-xs text-cyber-cyan hover:text-cyber-green transition-colors duration-150 border border-cyber-border rounded px-2 py-1 hover:border-cyber-cyan/50"
            title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
          >
            {soundEnabled ? '[SND:ON]' : '[SND:OFF]'}
          </button>

          {/* Menú hamburguesa mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden font-mono text-xs text-cyber-cyan border border-cyber-border rounded px-2 py-1"
          >
            {menuOpen ? '[X]' : '[=]'}
          </button>
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-cyber-border">
          <XPBar
            currentXP={currentXP}
            maxXP={maxXP}
            level={level}
            rank={rank}
          />
        </div>
      )}
    </nav>
  )
}