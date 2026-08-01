import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ArrowLeft,
  Lightbulb,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  Star,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  GripHorizontal,
  GripVertical,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import CodeEditor from '../components/editor/CodeEditor'
import CodePreview from '../components/editor/CodePreview'
import ChallengeSelector from '../components/editor/ChallengeSelector'
import { validateChallenge } from '../components/editor/BugValidator'
import bugChallenges from '../data/bugChallenges'
import CyberButton from '../components/common/CyberButton'
import CyberCard from '../components/common/CyberCard'
import Modal from '../components/common/Modal'
import useResizablePanel from '../hooks/useResizablePanel'

export default function FixTheCodeView({
  onBack,
  onComplete,
  completedChallenges: externalCompletedChallenges = [],
  hintsUsed: externalHintsUsed = 0,
  playCorrect,
  playError,
  playLevelUp,
}) {
  // Estado del desafío actual: buscar el primer desafío no completado
  const getInitialChallengeId = () => {
    const firstPending = bugChallenges.find((c) => !externalCompletedChallenges.includes(c.id))
    return firstPending?.id || bugChallenges[0]?.id || null
  }
  const [currentChallengeId, setCurrentChallengeId] = useState(getInitialChallengeId)
  const [userFiles, setUserFiles] = useState({ html: '', css: '', js: '' })
  const [originalFiles, setOriginalFiles] = useState({ html: '', css: '', js: '' })

  // Estado de validación
  const [validationResult, setValidationResult] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [consoleExpanded, setConsoleExpanded] = useState(false)
  const [consoleHeight, setConsoleHeight] = useState(220) // altura en px
  const consoleDragRef = useRef(null)

  // Estado de pistas
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)

  // Estado de victoria
  const [victoryModalOpen, setVictoryModalOpen] = useState(false)
  const [victoryData, setVictoryData] = useState(null)

  // Estado de completados
  const [completedIds, setCompletedIds] = useState(externalCompletedChallenges)

  // Estado de colapso de paneles
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [previewCollapsed, setPreviewCollapsed] = useState(false)

  // Ref para el contenedor de confeti
  const viewRef = useRef(null)

  // Hook para redimensionar entre editor y preview
  const editorPreviewResize = useResizablePanel({
    initialLeftWidth: 60,
    minWidth: 25,
    direction: 'horizontal',
  })

  // Drag de la consola (overlay)
  const consoleDragState = useRef({ startY: 0, startHeight: 220 })

  const handleConsoleMouseDown = useCallback((e) => {
    e.preventDefault()
    consoleDragState.current = { startY: e.clientY, startHeight: consoleHeight }

    const handleMouseMove = (ev) => {
      const deltaY = consoleDragState.current.startY - ev.clientY
      const newHeight = Math.max(80, Math.min(500, consoleDragState.current.startHeight + deltaY))
      setConsoleHeight(newHeight)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }, [consoleHeight])

  // Cargar desafío cuando cambia el ID
  useEffect(() => {
    const challenge = bugChallenges.find((c) => c.id === currentChallengeId)
    if (challenge) {
      const files = {
        html: challenge.files.html || '',
        css: challenge.files.css || '',
        js: challenge.files.js || '',
      }
      setUserFiles(files)
      setOriginalFiles(files)
      setValidationResult(null)
      setConsoleExpanded(false)
      setHintsRevealed(0)
    }
  }, [currentChallengeId])

  // Manejar cambio en el editor
  const handleCodeChange = useCallback((fileType, value) => {
    setUserFiles((prev) => ({
      ...prev,
      [fileType]: value,
    }))
    setValidationResult(null)
  }, [])

  // Manejar validación
  const handleValidate = useCallback(() => {
    const challenge = bugChallenges.find((c) => c.id === currentChallengeId)
    if (!challenge) return

    setIsValidating(true)
    setConsoleExpanded(true)

    setTimeout(() => {
      const result = validateChallenge(challenge, userFiles)
      setValidationResult(result)
      setIsValidating(false)

      if (result.passed) {
        const finalXP = Math.max(challenge.xpReward - hintsUsed * 15, 10)
        setVictoryData({
          challenge,
          xpEarned: finalXP,
          hintsUsed,
        })
        setVictoryModalOpen(true)
        if (playCorrect) playCorrect()
        if (playLevelUp) playLevelUp()

        const rect = viewRef.current?.getBoundingClientRect()
        if (rect) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { x: 0.5, y: 0.4 },
            colors: ['#00ff66', '#00e5ff', '#9d00ff', '#ffcc00'],
          })
        }
      } else {
        if (playError) playError()
      }
    }, 300)
  }, [currentChallengeId, userFiles, hintsUsed])

  // Manejar pistas
  const handleRevealHint = useCallback(() => {
    const challenge = bugChallenges.find((c) => c.id === currentChallengeId)
    if (!challenge || hintsRevealed >= challenge.hints.length) return
    setHintsRevealed((prev) => prev + 1)
    setHintsUsed((prev) => prev + 1)
  }, [currentChallengeId, hintsRevealed])

  // Manejar cierre de modal de victoria
  const handleVictoryClose = useCallback(() => {
    setVictoryModalOpen(false)
    if (victoryData) {
      setCompletedIds((prev) =>
        prev.includes(victoryData.challenge.id) ? prev : [...prev, victoryData.challenge.id]
      )
      if (onComplete) {
        onComplete(victoryData.challenge.id, victoryData.xpEarned)
      }
    }
  }, [victoryData, onComplete])

  // Manejar selección de desafío
  const handleSelectChallenge = useCallback((challengeId) => {
    setCurrentChallengeId(challengeId)
  }, [])

  // Reiniciar desafío actual
  const handleReset = useCallback(() => {
    setUserFiles(originalFiles)
    setValidationResult(null)
    setHintsRevealed(0)
    setConsoleExpanded(false)
  }, [originalFiles])

  const challenge = bugChallenges.find((c) => c.id === currentChallengeId)
  const challengeIndex = bugChallenges.findIndex((c) => c.id === currentChallengeId)
  const isCompleted = completedIds.includes(currentChallengeId)

  // Ancho de los paneles con colapso
  const sidebarWidth = sidebarCollapsed ? 0 : editorPreviewResize.leftSize * 0.25
  const editorWidth = editorPreviewResize.leftSize
  const previewWidth = previewCollapsed ? 0 : editorPreviewResize.rightSize

  return (
    <div
      ref={viewRef}
      className="w-full h-[calc(100vh-5rem)] bg-cyber-dark overflow-hidden"
    >
      <div className="px-2 sm:px-4 py-2 h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-2 flex-shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <CyberButton color="cyan" variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft size={14} />
              VOLVER
            </CyberButton>
            <div className="hidden sm:block">
              <h1 className="font-mono text-lg font-bold text-cyber-cyan">
                {'>'} Fix the Code
              </h1>
              <p className="font-mono text-[10px] text-cyber-text/60">
                Laboratorio de depuración en vivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-cyber-text/60 border border-cyber-border rounded px-2 py-1 hidden sm:block">
              {challengeIndex + 1}/{bugChallenges.length}
            </span>
            <CyberButton color="pink" variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw size={12} />
            </CyberButton>
            <CyberButton
              color="green"
              size="sm"
              onClick={handleValidate}
              disabled={isValidating || isCompleted}
            >
              <Play size={14} />
              {isValidating ? '...' : 'VALIDAR'}
            </CyberButton>
          </div>
        </header>

        {/* Info del desafío */}
        {challenge && (
          <CyberCard borderColor="cyan" className="mb-2 flex-shrink-0 !p-3">
            <div className="flex items-start justify-between flex-wrap gap-1">
              <div className="min-w-0 flex-1">
                <h2 className="font-mono text-sm font-bold text-cyber-cyan flex items-center gap-2 truncate">
                  {challenge.title}
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-cyber-green text-[10px] flex-shrink-0">
                      <CheckCircle2 size={12} /> COMPLETADO
                    </span>
                  )}
                </h2>
                <p className="font-mono text-xs text-cyber-text/80 mt-0.5 line-clamp-1">
                  {challenge.description}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-[10px] text-cyber-yellow flex items-center gap-1">
                  <Star size={10} /> +{challenge.xpReward} XP
                </span>
                {challenge.hints.length > 0 && (
                  <span className="font-mono text-[10px] text-cyber-purple flex items-center gap-1 hidden sm:flex">
                    <Lightbulb size={10} /> {challenge.hints.length} pistas
                  </span>
                )}
              </div>
            </div>
          </CyberCard>
        )}

        {/* Área principal: 3 paneles redimensionables */}
        <div
          ref={editorPreviewResize.containerRef}
          className="flex-1 flex gap-0 min-h-0"
        >
          {/* Panel izquierdo: Lista de desafíos */}
          <div
            className="relative flex-shrink-0 overflow-hidden transition-all duration-200"
            style={{
              width: sidebarCollapsed ? '0px' : `${Math.max(15, sidebarWidth)}%`,
              minWidth: sidebarCollapsed ? '0px' : '180px',
              maxWidth: sidebarCollapsed ? '0px' : '320px',
            }}
          >
            <div className="absolute inset-0">
              <ChallengeSelector
                currentChallengeId={currentChallengeId}
                completedChallenges={completedIds}
                onSelectChallenge={handleSelectChallenge}
              />
            </div>
          </div>

          {/* Botón colapsar sidebar */}
          <div className="flex items-center justify-center flex-shrink-0">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-5 flex items-center justify-center bg-cyber-card border border-cyber-border rounded-sm hover:bg-cyber-cyan/10 transition-colors group"
              title={sidebarCollapsed ? 'Mostrar lista' : 'Ocultar lista'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={12} className="text-cyber-cyan/60 group-hover:text-cyber-cyan" />
              ) : (
                <PanelLeftClose size={12} className="text-cyber-cyan/60 group-hover:text-cyber-cyan" />
              )}
            </button>
          </div>

          {/* Panel central: Editor + Consola (overlay) */}
          <div
            className="flex-1 flex flex-col min-w-0 relative"
            style={{ width: `${editorWidth}%` }}
          >
            {/* Editor - siempre ocupa el 100% */}
            <div className="absolute inset-0">
              <CodeEditor
                files={userFiles}
                onCodeChange={handleCodeChange}
                readOnly={isCompleted}
              />
            </div>

            {/* Botón expandir consola (cuando está colapsada) - overlay abajo */}
            {!consoleExpanded && (
              <button
                onClick={() => setConsoleExpanded(true)}
                className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-1 px-3 py-1 bg-cyber-card/90 backdrop-blur-sm border border-cyber-border rounded-t-sm font-mono text-[10px] text-cyber-text/40 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
              >
                <ChevronUp size={11} />
                CONSOLA DE VALIDACIÓN
                {validationResult && (
                  <span className={`ml-1 ${validationResult.passed ? 'text-cyber-green' : 'text-cyber-pink'}`}>
                    ({validationResult.passedCount}/{validationResult.totalCount})
                  </span>
                )}
              </button>
            )}

            {/* Consola overlay - se superpone sin afectar al editor */}
            {consoleExpanded && (
              <div
                className="absolute bottom-0 left-0 right-0 z-20 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-border rounded-t-lg overflow-hidden"
                style={{ height: `${consoleHeight}px` }}
              >
                <div className="h-full flex flex-col">
                  {/* Drag handle */}
                  <div
                    ref={consoleDragRef}
                    onMouseDown={handleConsoleMouseDown}
                    className="flex-shrink-0 h-3 flex items-center justify-center cursor-row-resize bg-cyber-card hover:bg-cyber-cyan/10 transition-colors group"
                  >
                    <GripHorizontal size={14} className="text-cyber-cyan/40 group-hover:text-cyber-cyan" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-cyber-card border-b border-cyber-border flex-shrink-0">
                    <button
                      onClick={() => setConsoleExpanded(false)}
                      className="flex items-center gap-1.5 font-mono text-[10px] text-cyber-text/60 hover:text-cyber-cyan transition-colors"
                    >
                      <AlertTriangle size={11} />
                      CONSOLA
                      {validationResult && (
                        <span className={`ml-1 ${validationResult.passed ? 'text-cyber-green' : 'text-cyber-pink'}`}>
                          ({validationResult.passedCount}/{validationResult.totalCount})
                        </span>
                      )}
                      <ChevronDown size={11} />
                    </button>
                    <div className="flex items-center gap-1">
                      {challenge && hintsRevealed < challenge.hints.length && !isCompleted && (
                        <button
                          onClick={handleRevealHint}
                          className="font-mono text-[10px] text-cyber-purple hover:text-cyber-purple/80 border border-cyber-purple/30 rounded px-1.5 py-0.5 transition-colors"
                          title="Mostrar pista"
                        >
                          <Lightbulb size={10} className="inline mr-0.5" />
                          PISTA {hintsRevealed + 1}/{challenge.hints.length}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-relaxed space-y-1">
                    {/* Pistas */}
                    {challenge && hintsRevealed > 0 && (
                      <div className="mb-2">
                        <p className="text-cyber-purple mb-1">
                          {'>'} PISTAS ({hintsUsed} usadas):
                        </p>
                        {challenge.hints.slice(0, hintsRevealed).map((hint, i) => (
                          <p key={i} className="text-cyber-purple/70 ml-3">
                            {'>'} {hint}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Resultados de validación - mensajes GENÉRICOS sin revelar respuestas */}
                    {validationResult && (
                      <>
                        <p className={validationResult.passed ? 'text-cyber-green' : 'text-cyber-pink'}>
                          {'>'} {validationResult.passed
                            ? '¡TODAS LAS PRUEBAS SUPERADAS! 🎉'
                            : `⚠️ ${validationResult.passedCount} de ${validationResult.totalCount} pruebas superadas`}
                        </p>

                        {validationResult.passedCount > 0 && (
                          <p className="text-cyber-green ml-3 flex items-center gap-1">
                            <CheckCircle2 size={9} />
                            {validationResult.passedCount} prueba{validationResult.passedCount !== 1 ? 's' : ''} correcta{validationResult.passedCount !== 1 ? 's' : ''}
                          </p>
                        )}

                        {!validationResult.passed && (
                          <p className="text-cyber-pink ml-3 flex items-center gap-1">
                            <XCircle size={9} />
                            Aún hay errores que corregir. Revisa tu código o usa una pista.
                          </p>
                        )}

                        {validationResult.passed && (
                          <p className="text-cyber-green mt-2">
                            {'>'} ¡Excelente trabajo! Tu solución es correcta.
                          </p>
                        )}
                      </>
                    )}

                    {!validationResult && !isCompleted && (
                      <p className="text-cyber-text/30">
                        {'>'} Presiona VALIDAR para verificar tu solución...
                      </p>
                    )}

                    {isCompleted && (
                      <p className="text-cyber-green">
                        {'>'} Desafío completado. ¡Buen trabajo!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drag handle horizontal entre editor y preview */}
          <div
            className="flex-shrink-0 w-2 flex items-center justify-center cursor-col-resize bg-cyber-card hover:bg-cyber-cyan/10 transition-colors group rounded-sm mx-0.5"
            onMouseDown={editorPreviewResize.handleMouseDown}
          >
            <GripVertical size={14} className="text-cyber-cyan/40 group-hover:text-cyber-cyan" />
          </div>

          {/* Panel derecho: Preview */}
          <div
            className="flex-shrink-0 overflow-hidden transition-all duration-200"
            style={{
              width: previewCollapsed ? '0px' : `${Math.max(20, previewWidth)}%`,
              minWidth: previewCollapsed ? '0px' : '200px',
            }}
          >
            <div className="h-full">
              <CodePreview
                files={userFiles}
                challengeId={currentChallengeId}
              />
            </div>
          </div>

          {/* Botón colapsar preview */}
          <div className="flex items-center justify-center flex-shrink-0">
            <button
              onClick={() => setPreviewCollapsed(!previewCollapsed)}
              className="h-8 w-5 flex items-center justify-center bg-cyber-card border border-cyber-border rounded-sm hover:bg-cyber-cyan/10 transition-colors group"
              title={previewCollapsed ? 'Mostrar preview' : 'Ocultar preview'}
            >
              {previewCollapsed ? (
                <PanelRightOpen size={12} className="text-cyber-cyan/60 group-hover:text-cyber-cyan" />
              ) : (
                <PanelRightClose size={12} className="text-cyber-cyan/60 group-hover:text-cyber-cyan" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Victoria */}
      <Modal
        isOpen={victoryModalOpen}
        onClose={handleVictoryClose}
        title="VICTORIA"
        borderColor="green"
      >
        {victoryData && (
          <div className="text-center font-mono">
            <Trophy className="mx-auto mb-4 text-cyber-yellow" size={48} strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-cyber-green mb-2">
              ¡DESAFÍO SUPERADO!
            </h3>
            <p className="text-cyber-text/80 mb-4">
              Has completado: <span className="text-cyber-cyan">{victoryData.challenge.title}</span>
            </p>
            <div className="bg-cyber-card border border-cyber-border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-cyber-yellow text-2xl font-bold">+{victoryData.xpEarned}</p>
                  <p className="text-cyber-text/60 text-xs">XP GANADOS</p>
                </div>
                {victoryData.hintsUsed > 0 && (
                  <div className="text-center">
                    <p className="text-cyber-purple text-sm">-{victoryData.hintsUsed * 15} XP</p>
                    <p className="text-cyber-text/60 text-xs">POR PISTAS</p>
                  </div>
                )}
              </div>
            </div>
            <CyberButton color="green" onClick={handleVictoryClose}>
              CONTINUAR
            </CyberButton>
          </div>
        )}
      </Modal>
    </div>
  )
}