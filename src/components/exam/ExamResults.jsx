import { useRef } from 'react'
import CyberCard from '../common/CyberCard'
import CyberButton from '../common/CyberButton'

export default function ExamResults({ results, examTitle, onRetry, onBack }) {
  const reportRef = useRef(null)

  if (!results) return null

  const {
    total,
    correct,
    incorrect,
    score,
    score10,
    rank,
    details,
    timeUsed,
  } = results

  const formatTime = (seconds) => {
    if (!seconds) return '--:--'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const getScoreColor = () => {
    if (score >= 80) return 'text-cyber-green'
    if (score >= 60) return 'text-cyber-yellow'
    return 'text-cyber-pink'
  }

  const getScoreBorder = () => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'pink'
  }

  const getScoreGlow = () => {
    if (score >= 80) return 'shadow-neon-green'
    if (score >= 60) return 'shadow-neon-yellow'
    return 'shadow-neon-pink'
  }

  // Agrupar por tema para análisis
  const topicAnalysis = {}
  details.forEach((d) => {
    if (!topicAnalysis[d.topic]) {
      topicAnalysis[d.topic] = { total: 0, correct: 0 }
    }
    topicAnalysis[d.topic].total++
    if (d.isCorrect) topicAnalysis[d.topic].correct++
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <p className="font-mono text-sm text-cyber-green mb-2">
          {'>'} EXAMEN COMPLETADO
        </p>
        <h2 className="font-mono text-2xl font-bold text-cyber-cyan">
          {examTitle}
        </h2>
      </div>

      {/* Score principal */}
      <div className="flex justify-center mb-8">
        <div
          className={`
            relative w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center
            ${getScoreBorder() === 'green' ? 'border-cyber-green' : getScoreBorder() === 'yellow' ? 'border-cyber-yellow' : 'border-cyber-pink'}
            ${getScoreGlow()}
            bg-cyber-card
          `}
        >
          <span className={`font-mono text-5xl font-bold ${getScoreColor()}`}>
            {score}
          </span>
          <span className="font-mono text-xs text-cyber-text mt-1">/ 100</span>
          <span className={`font-mono text-sm ${getScoreColor()} mt-1`}>
            {score10}
          </span>
        </div>
      </div>

      {/* Rango */}
      <div className="text-center mb-8">
        <CyberCard borderColor={getScoreBorder()}>
          <p className="font-mono text-xs text-cyber-purple uppercase tracking-wider mb-1">
            Rango Obtenido
          </p>
          <p className={`font-mono text-2xl font-bold ${getScoreColor()}`}>
            {rank}
          </p>
        </CyberCard>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <CyberCard borderColor="green">
          <p className="font-mono text-xs text-cyber-green uppercase tracking-wider mb-1">
            Correctas
          </p>
          <p className="font-mono text-3xl font-bold text-cyber-green">
            {correct}
            <span className="text-sm text-cyber-text ml-1">/{total}</span>
          </p>
        </CyberCard>

        <CyberCard borderColor="pink">
          <p className="font-mono text-xs text-cyber-pink uppercase tracking-wider mb-1">
            Incorrectas
          </p>
          <p className="font-mono text-3xl font-bold text-cyber-pink">
            {incorrect}
            <span className="text-sm text-cyber-text ml-1">/{total}</span>
          </p>
        </CyberCard>

        <CyberCard borderColor="cyan">
          <p className="font-mono text-xs text-cyber-cyan uppercase tracking-wider mb-1">
            Tiempo usado
          </p>
          <p className="font-mono text-2xl font-bold text-cyber-cyan">
            {formatTime(timeUsed)}
          </p>
        </CyberCard>
      </div>

      {/* Semáforo de preguntas */}
      <div className="mb-8" ref={reportRef}>
        <CyberCard borderColor={getScoreBorder()}>
          <h3 className="font-mono text-sm text-cyber-cyan uppercase tracking-wider mb-4">
            {'>'} DETALLE DE PREGUNTAS
          </h3>

          <div className="space-y-3">
            {details.map((d, i) => {
              const userAnswerLabel = d.userAnswer >= 0 ? d.options[d.userAnswer] : '(Sin responder)'
              const correctAnswerLabel = d.options[d.correctAnswer]

              return (
                <div
                  key={d.id}
                  className={`
                    p-4 rounded-md border text-sm font-mono
                    ${
                      d.isCorrect
                        ? 'border-cyber-green/30 bg-cyber-green/5'
                        : 'border-cyber-pink/30 bg-cyber-pink/5'
                    }
                  `}
                >
                  {/* Enunciado de la pregunta */}
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        text-xs font-bold border
                        ${
                          d.isCorrect
                            ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                            : 'border-cyber-pink bg-cyber-pink/20 text-cyber-pink'
                        }
                      `}
                    >
                      {d.isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-cyber-text">
                        <span className="text-cyber-cyan">{i + 1}.</span> {d.question}
                      </p>
                      <p className="text-[10px] text-cyber-purple mt-0.5">
                        #{d.topic} · {d.difficulty === 'easy' ? 'Fácil' : d.difficulty === 'medium' ? 'Intermedio' : 'Avanzado'}
                      </p>
                    </div>
                  </div>

                  {/* Respuesta del alumno */}
                  <div className="ml-11 mb-2">
                    <span className="text-[10px] text-cyber-text/60 uppercase tracking-wider">
                      Tu respuesta:
                    </span>
                    <div
                      className={`
                        mt-1 px-3 py-2 rounded border text-xs
                        ${
                          d.isCorrect
                            ? 'border-cyber-green/50 bg-cyber-green/10 text-cyber-green'
                            : 'border-cyber-pink/50 bg-cyber-pink/10 text-cyber-pink'
                        }
                      `}
                    >
                      {d.userAnswer >= 0 ? (
                        <span>{String.fromCharCode(65 + d.userAnswer)}. {userAnswerLabel}</span>
                      ) : (
                        <span className="italic opacity-70">{userAnswerLabel}</span>
                      )}
                    </div>
                  </div>

                  {/* Respuesta correcta (solo si falló) */}
                  {!d.isCorrect && (
                    <div className="ml-11">
                      <span className="text-[10px] text-cyber-green/80 uppercase tracking-wider">
                        Respuesta correcta:
                      </span>
                      <div className="mt-1 px-3 py-2 rounded border border-cyber-green/50 bg-cyber-green/10 text-cyber-green text-xs">
                        {String.fromCharCode(65 + d.correctAnswer)}. {correctAnswerLabel}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CyberCard>
      </div>

      {/* Análisis por tema */}
      <div className="mb-8">
        <CyberCard borderColor="purple">
          <h3 className="font-mono text-sm text-cyber-purple uppercase tracking-wider mb-4">
            {'>'} ANÁLISIS POR TEMA
          </h3>
          <div className="space-y-3">
            {Object.entries(topicAnalysis).map(([topic, data]) => {
              const pct = Math.round((data.correct / data.total) * 100)
              return (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs text-cyber-text uppercase">
                      #{topic}
                    </span>
                    <span className="font-mono text-xs text-cyber-cyan">
                      {data.correct}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-cyber-dark rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 80
                          ? 'bg-cyber-green'
                          : pct >= 60
                          ? 'bg-cyber-yellow'
                          : 'bg-cyber-pink'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CyberCard>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <CyberButton color="green" onClick={onRetry}>
          REINTENTAR EXAMEN
        </CyberButton>
        <CyberButton color="cyan" variant="outline" onClick={handlePrint}>
          🖨️ GUARDAR REPORTE PDF
        </CyberButton>
        <CyberButton color="pink" variant="outline" onClick={onBack}>
          VOLVER AL MENÚ
        </CyberButton>
      </div>
    </div>
  )
}