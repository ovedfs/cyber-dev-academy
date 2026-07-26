import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  borderColor = 'cyan',
  className = '',
}) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const borderColors = {
    cyan: 'border-cyber-cyan/50 shadow-neon-cyan',
    green: 'border-cyber-green/50 shadow-neon-green',
    purple: 'border-cyber-purple/50 shadow-neon-purple',
    pink: 'border-cyber-pink/50 shadow-neon-pink',
    yellow: 'border-cyber-yellow/50 shadow-neon-yellow',
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className={`
          bg-cyber-card border rounded-lg p-6 max-w-lg w-full mx-4
          ${borderColors[borderColor] || borderColors.cyan}
          animate-modal-enter
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-lg font-semibold text-cyber-cyan">
            {'>'} {title}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center text-cyber-pink hover:text-cyber-pink/80 transition-colors border border-cyber-border rounded p-1.5 hover:border-cyber-pink/50"
            aria-label="Cerrar diálogo"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="text-cyber-text font-sans text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
