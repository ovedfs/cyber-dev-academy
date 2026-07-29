import { useState, useCallback, useEffect, useRef } from 'react'
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
  GripHorizontal,
  Code2,
  HelpCircle,
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import confetti from 'canvas-confetti'
import { evaluateLogicChallenge } from '../utils/logicEvaluator'
import logicChallenges from '../data/logicChallenges'
import CyberButton from '../components/common/CyberButton'
import CyberCard from '../components/common/CyberCard'
import Modal from '../components/common/Modal'

// Tips pedagógicos por desafío (ayudan sin resolver el ejercicio)
const CHALLENGE_TIPS = {
  'logic-001': '💡 Piensa en qué operador matemático te dice si un número es divisible entre 2. Si el residuo es 0, es par.',
  'logic-002': '💡 Existe un método de array que recorre todos los elementos y acumula un valor. También puedes usar un bucle for clásico.',
  'logic-003': '💡 El método .find() devuelve el primer elemento que cumple una condición. Si no encuentra nada, devuelve undefined.',
  'logic-004': '💡 Los template strings usan backticks (`) y la sintaxis ${variable} para insertar valores dentro del texto.',
  'logic-005': '💡 Convierte el texto a minúsculas con .toLowerCase() y luego revisa cada carácter. Las vocales son a, e, i, o, u.',
  'logic-006': '💡 El método atacar recibe un enemigo como parámetro. Debes modificar la propiedad vida de ese objeto enemigo.',
  'logic-007': '💡 Usa super(nombre) dentro del constructor para llamar al constructor de la clase padre Player.',
  'logic-008': '💡 useState devuelve un array con dos elementos: el valor actual y una función para actualizarlo. Ej: const [contador, setContador] = React.useState(0)',
  'logic-009': '💡 Los valores por defecto en props se asignan en la desestructuración: function Componente({ nombre, rol = "Usuario" })',
  'logic-010': '💡 Haz una copia del array original antes de modificarlo para no mutarlo. Puedes usar el operador spread: [...numeros]',
}

export default function LogicLabView({
  onBack,
  onComplete,
  completedChallenges: externalCompletedChallenges = [],
}) {
  // Normalizar IDs de completados (soporta objetos {id, code} o strings legacy)
  const completedIdsList = externalCompletedChallenges.map(
    (item) => (typeof item === 'string' ? item : item.id)
  )

  // Estado del desafío actual (siempre empieza en el primer desafío, el alumno elige libremente)
  const getInitialChallengeId = () => {
    return logicChallenges[0]?.id || null
  }
  const [currentChallengeId, setCurrentChallengeId] = useState(getInitialChallengeId)
  const [userCode, setUserCode] = useState('')
  const [originalCode, setOriginalCode] = useState('')

  // Estado de validación
  const [validationResult, setValidationResult] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [consoleExpanded, setConsoleExpanded] = useState(false)
  const [consoleHeight, setConsoleHeight] = useState(220)

  // Estado de victoria
  const [victoryModalOpen, setVictoryModalOpen] = useState(false)
  const [victoryData, setVictoryData] = useState(null)

  // Estado de completados (sincronizado con prop externa)
  const [completedIds, setCompletedIds] = useState(externalCompletedChallenges)

  // Sincronizar cuando la prop externa cambia (ej. al volver a entrar)
  useEffect(() => {
    setCompletedIds(externalCompletedChallenges)
  }, [externalCompletedChallenges])


  // Estado de sidebar y tips
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [tipVisible, setTipVisible] = useState(false)

  // Ref para confeti
  const viewRef = useRef(null)

  // Ref para el editor Monaco
  const editorRef = useRef(null)

  const handleEditorDidMount = useCallback((editor) => {
    editorRef.current = editor
  }, [])

  // Drag de consola
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

  // Helper para obtener el código guardado de un desafío completado
  const getSavedCode = useCallback((challengeId) => {
    const entry = externalCompletedChallenges.find(
      (item) => (typeof item === 'string' ? item : item.id) === challengeId
    )
    return entry && typeof entry === 'object' ? entry.code : null
  }, [externalCompletedChallenges])

  // Cargar desafío cuando cambia el ID
  useEffect(() => {
    const challenge = logicChallenges.find((c) => c.id === currentChallengeId)
    if (challenge) {
      const savedCode = getSavedCode(currentChallengeId)
      const codeToUse = savedCode || challenge.starterCode
      setUserCode(codeToUse)
      setOriginalCode(challenge.starterCode)
      setValidationResult(null)
      setConsoleExpanded(false)
      setTipVisible(false)
    }
  }, [currentChallengeId, getSavedCode])

  // Manejar cambio en el editor (Monaco)
  const handleCodeChange = useCallback((value) => {
    setUserCode(value || '')
    setValidationResult(null)
  }, [])

  // Manejar ejecución
  const handleRun = useCallback(() => {
    const challenge = logicChallenges.find((c) => c.id === currentChallengeId)
    if (!challenge) return

    setIsValidating(true)
    setConsoleExpanded(true)

    setTimeout(() => {
      const result = evaluateLogicChallenge(challenge, userCode)
      setValidationResult(result)
      setIsValidating(false)

      if (result.passed) {
        setVictoryData({
          challenge,
          xpEarned: challenge.xpReward,
        })
        setVictoryModalOpen(true)

        const rect = viewRef.current?.getBoundingClientRect()
        if (rect) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { x: 0.5, y: 0.4 },
            colors: ['#ffcc00', '#00e5ff', '#9d00ff', '#00ff66'],
          })
        }
      }
    }, 300)
  }, [currentChallengeId, userCode])

  // Manejar cierre de modal de victoria
  const handleVictoryClose = useCallback(() => {
    setVictoryModalOpen(false)
    if (victoryData) {
      setCompletedIds((prev) => {
        const normalized = prev.map(
          (item) => (typeof item === 'string' ? item : item.id)
        )
        return normalized.includes(victoryData.challenge.id)
          ? prev
          : [...prev, { id: victoryData.challenge.id, code: userCode }]
      })
      if (onComplete) {
        onComplete(victoryData.challenge.id, victoryData.xpEarned, userCode)
      }
    }
  }, [victoryData, onComplete, userCode])

  // Manejar selección de desafío
  const handleSelectChallenge = useCallback((challengeId) => {
    setCurrentChallengeId(challengeId)
  }, [])

  // Reiniciar desafío actual
  const handleReset = useCallback(() => {
    setUserCode(originalCode)
    setValidationResult(null)
    setConsoleExpanded(false)
    setTipVisible(false)
  }, [originalCode])

  const challenge = logicChallenges.find((c) => c.id === currentChallengeId)
  const challengeIndex = logicChallenges.findIndex((c) => c.id === currentChallengeId)
  const isCompleted = completedIdsList.includes(currentChallengeId)
  const currentTip = challenge ? CHALLENGE_TIPS[challenge.id] : null

  // Dificultad badge
  const difficultyColors = {
    easy: 'text-cyber-green border-cyber-green/30',
    medium: 'text-cyber-yellow border-cyber-yellow/30',
    hard: 'text-cyber-pink border-cyber-pink/30',
  }

  const difficultyLabels = {
    easy: 'FÁCIL',
    medium: 'MEDIO',
    hard: 'DIFÍCIL',
  }

  return (
    <div
      ref={viewRef}
      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] h-[calc(100vh-5rem)] bg-cyber-dark overflow-hidden"
    >
      <div className="px-2 sm:px-4 py-2 h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-2 flex-shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <CyberButton color="yellow" variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft size={14} />
              VOLVER
            </CyberButton>
            <div className="hidden sm:block">
              <h1 className="font-mono text-lg font-bold text-cyber-yellow">
                {'>'} Laboratorio de Lógica
              </h1>
              <p className="font-mono text-[10px] text-cyber-text/60">
                Algoritmos y desafíos de programación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-cyber-text/60 border border-cyber-border rounded px-2 py-1 hidden sm:block">
              {challengeIndex + 1}/{logicChallenges.length}
            </span>
            <CyberButton color="pink" variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw size={12} />
            </CyberButton>
            <CyberButton
              color="yellow"
              size="sm"
              onClick={handleRun}
              disabled={isValidating || isCompleted}
            >
              <Play size={14} />
              {isValidating ? '...' : 'EJECUTAR'}
            </CyberButton>
          </div>
        </header>

        {/* Info del desafío + Tip */}
        {challenge && (
          <CyberCard borderColor="yellow" className="mb-2 flex-shrink-0 !p-3">
            <div className="flex items-start justify-between flex-wrap gap-1">
              <div className="min-w-0 flex-1">
                <h2 className="font-mono text-sm font-bold text-cyber-yellow flex items-center gap-2 truncate">
                  {challenge.title}
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-cyber-green text-[10px] flex-shrink-0">
                      <CheckCircle2 size={12} /> COMPLETADO
                    </span>
                  )}
                </h2>
                <p className="font-mono text-xs text-cyber-text/80 mt-0.5">
                  {challenge.description}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`font-mono text-[10px] border rounded px-1.5 py-0.5 ${difficultyColors[challenge.difficulty] || 'text-cyber-text/60 border-cyber-border'}`}>
                  {difficultyLabels[challenge.difficulty] || challenge.difficulty}
                </span>
                <span className="font-mono text-[10px] text-cyber-yellow flex items-center gap-1">
                  <Star size={10} /> +{challenge.xpReward} XP
                </span>
                <span className="font-mono text-[10px] text-cyber-cyan flex items-center gap-1 hidden sm:flex">
                  <Code2 size={10} /> {challenge.topic}
                </span>
                {/* Botón de tip - más visible */}
                {currentTip && !isCompleted && (
                  <button
                    onClick={() => setTipVisible(!tipVisible)}
                    className={`
                      font-mono text-[10px] font-bold border-2 rounded px-2 py-0.5 flex items-center gap-1.5 transition-all duration-200
                      ${tipVisible
                        ? 'bg-cyber-yellow text-cyber-dark border-cyber-yellow shadow-neon-yellow'
                        : 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/60 hover:bg-cyber-yellow/20 hover:shadow-neon-yellow'
                      }
                    `}
                    title="Ver tip"
                  >
                    <HelpCircle size={11} />
                    TIP
                  </button>
                )}
              </div>
            </div>

            {/* Panel de tip expandible - más visible */}
            {tipVisible && currentTip && (
              <div className="mt-2 pt-2 border-t border-cyber-yellow/30 animate-fade-in">
                <div className="flex items-start gap-2.5 bg-cyber-yellow/10 border border-cyber-yellow/40 rounded-lg p-3 shadow-neon-yellow/20">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-cyber-yellow/20 flex items-center justify-center">
                    <Lightbulb size={14} className="text-cyber-yellow" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-cyber-yellow/70 uppercase tracking-wider mb-1">
                      {'>'} CONSEJO DEL DÍA
                    </p>
                    <p className="font-mono text-xs text-cyber-text leading-relaxed">
                      {currentTip}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CyberCard>
        )}

        {/* Área principal */}
        <div className="flex-1 flex gap-0 min-h-0">
          {/* Sidebar: Lista de desafíos */}
          <div
            className="relative flex-shrink-0 overflow-hidden transition-all duration-200"
            style={{
              width: sidebarCollapsed ? '0px' : '220px',
              minWidth: sidebarCollapsed ? '0px' : '180px',
              maxWidth: sidebarCollapsed ? '0px' : '280px',
            }}
          >
            <div className="absolute inset-0 overflow-y-auto">
              <div className="p-2 space-y-1">
                <p className="font-mono text-[10px] text-cyber-text/40 uppercase tracking-wider px-2 mb-2">
                  Desafíos
                </p>
                {logicChallenges.map((c, i) => {
                  const isSelected = c.id === currentChallengeId
                  const isDone = completedIdsList.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectChallenge(c.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded font-mono text-xs transition-all
                        ${isSelected
                          ? 'bg-cyber-yellow/10 border border-cyber-yellow/40 text-cyber-yellow'
                          : isDone
                            ? 'bg-cyber-green/5 border border-cyber-green/20 text-cyber-green/70'
                            : 'bg-cyber-card border border-cyber-border text-cyber-text/60 hover:border-cyber-yellow/30 hover:text-cyber-text'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{
                            backgroundColor: isSelected ? 'rgba(255,204,0,0.2)' : isDone ? 'rgba(0,255,102,0.15)' : 'rgba(255,255,255,0.05)',
                            color: isSelected ? '#ffcc00' : isDone ? '#00ff66' : 'rgba(255,255,255,0.3)',
                          }}
                        >
                          {isDone ? '✓' : i + 1}
                        </span>
                        <span className="truncate">{c.title}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Botón colapsar sidebar */}
          <div className="flex items-center justify-center flex-shrink-0">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-5 flex items-center justify-center bg-cyber-card border border-cyber-border rounded-sm hover:bg-cyber-yellow/10 transition-colors group"
              title={sidebarCollapsed ? 'Mostrar lista' : 'Ocultar lista'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={12} className="text-cyber-yellow/60 group-hover:text-cyber-yellow" />
              ) : (
                <PanelLeftClose size={12} className="text-cyber-yellow/60 group-hover:text-cyber-yellow" />
              )}
            </button>
          </div>

          {/* Panel central: Editor + Consola */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Editor de código con Monaco */}
            <div className="absolute inset-0 border border-cyber-border rounded-lg overflow-hidden">
              <Editor
                key={currentChallengeId}
                height="100%"
                language="javascript"
                value={userCode}
                theme="cyber-dark"
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                options={{
                  readOnly: isCompleted,
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  fontLigatures: true,
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 2,
                  automaticLayout: true,
                  padding: { top: 12 },
                  bracketPairColorization: { enabled: true },
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  folding: true,
                  foldingHighlight: true,
                  guides: { indentation: true, bracketPairs: true },
                }}
              />
            </div>

            {/* Botón expandir consola (cuando está colapsada) */}
            {!consoleExpanded && (
              <button
                onClick={() => setConsoleExpanded(true)}
                className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-1 px-3 py-1 bg-cyber-card/90 backdrop-blur-sm border border-cyber-border rounded-t-sm font-mono text-[10px] text-cyber-text/40 hover:text-cyber-yellow hover:bg-cyber-yellow/10 transition-colors"
              >
                <ChevronUp size={11} />
                CONSOLA DE RESULTADOS
                {validationResult && (
                  <span className={`ml-1 ${validationResult.passed ? 'text-cyber-green' : 'text-cyber-pink'}`}>
                    ({validationResult.passedCount}/{validationResult.totalCount})
                  </span>
                )}
              </button>
            )}

            {/* Consola overlay */}
            {consoleExpanded && (
              <div
                className="absolute bottom-0 left-0 right-0 z-20 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-border rounded-t-lg overflow-hidden"
                style={{ height: `${consoleHeight}px` }}
              >
                <div className="h-full flex flex-col">
                  {/* Drag handle */}
                  <div
                    onMouseDown={handleConsoleMouseDown}
                    className="flex-shrink-0 h-3 flex items-center justify-center cursor-row-resize bg-cyber-card hover:bg-cyber-yellow/10 transition-colors group"
                  >
                    <GripHorizontal size={14} className="text-cyber-yellow/40 group-hover:text-cyber-yellow" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-cyber-card border-b border-cyber-border flex-shrink-0">
                    <button
                      onClick={() => setConsoleExpanded(false)}
                      className="flex items-center gap-1.5 font-mono text-[10px] text-cyber-text/60 hover:text-cyber-yellow transition-colors"
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
                  </div>

                  {/* Cuerpo de la consola */}
                  <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-relaxed space-y-1">
                    {/* Logs del usuario */}
                    {validationResult?.logs?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-cyber-cyan/60 mb-1">{'>'} CONSOLE OUTPUT:</p>
                        {validationResult.logs.map((log, i) => (
                          <p key={i} className="text-cyber-cyan ml-3">{'>'} {log}</p>
                        ))}
                      </div>
                    )}

                    {/* Error de evaluación */}
                    {validationResult?.error && (
                      <div className="mb-2">
                        <p className="text-cyber-pink">{'>'} ⚠️ ERROR:</p>
                        <p className="text-cyber-pink/80 ml-3">{'>'} {validationResult.error}</p>
                      </div>
                    )}

                    {/* Resultados de tests */}
                    {validationResult?.results?.length > 0 && (
                      <div className="mb-2">
                        <p className={validationResult.passed ? 'text-cyber-green' : 'text-cyber-text/80'}>
                          {'>'} {validationResult.passed
                            ? '¡TODAS LAS PRUEBAS SUPERADAS! 🎉'
                            : `Resultados: ${validationResult.passedCount} de ${validationResult.totalCount} pruebas`}
                        </p>
                        {validationResult.results.map((r, i) => (
                          <div key={i} className="ml-3 mt-1">
                            <p className={r.passed ? 'text-cyber-green' : 'text-cyber-pink'}>
                              {r.passed ? <CheckCircle2 size={9} className="inline mr-1" /> : <XCircle size={9} className="inline mr-1" />}
                              Test #{i + 1}
                              {r.error && <span className="text-cyber-pink/70 ml-1">— {r.error}</span>}
                            </p>
                            {!r.passed && !r.error && (
                              <div className="ml-4 text-[10px] text-cyber-text/50 space-y-0.5">
                                <p>Input: {JSON.stringify(r.input)}</p>
                                <p>Esperado: {JSON.stringify(r.expected)}</p>
                                <p>Recibido: {JSON.stringify(r.actual)}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {!validationResult && !isCompleted && (
                      <p className="text-cyber-text/30">
                        {'>'} Presiona EJECUTAR para probar tu solución...
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
        </div>
      </div>

      {/* Modal de Victoria */}
      <Modal
        isOpen={victoryModalOpen}
        onClose={handleVictoryClose}
        title="VICTORIA"
        borderColor="yellow"
      >
        {victoryData && (
          <div className="text-center font-mono">
            <Trophy className="mx-auto mb-4 text-cyber-yellow" size={48} strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-cyber-yellow mb-2">
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
                <div className="text-center">
                  <p className="text-cyber-cyan text-sm">{victoryData.challenge.topic}</p>
                  <p className="text-cyber-text/60 text-xs">TEMA</p>
                </div>
              </div>
            </div>
            <CyberButton color="yellow" onClick={handleVictoryClose}>
              CONTINUAR
            </CyberButton>
          </div>
        )}
      </Modal>
    </div>
  )
}