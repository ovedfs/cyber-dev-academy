import { useState } from 'react'
import { Check, Download, TriangleAlert, X } from 'lucide-react'
import CyberCard from '../common/CyberCard'
import CyberButton from '../common/CyberButton'

export default function ExamResults({ results, examTitle, onRetry, onBack }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')

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
    if (seconds === null || seconds === undefined) return '--:--'
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

  const weakTopics = Object.entries(topicAnalysis)
    .map(([topic, data]) => ({
      topic,
      percentage: Math.round((data.correct / data.total) * 100),
    }))
    .filter(({ percentage }) => percentage < 80)
    .sort((a, b) => a.percentage - b.percentage)

  const handlePdfExport = async () => {
    if (isExporting) return

    setIsExporting(true)
    setExportError('')

    try {
      const { jsPDF } = await import('jspdf')
      const safeTitle = examTitle.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const margin = 15
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const contentWidth = pageWidth - margin * 2
      let cursorY = 18

      const addPageIfNeeded = (space = 7) => {
        if (cursorY + space > pageHeight - 16) {
          pdf.addPage()
          cursorY = 18
        }
      }

      const addText = (text, { size = 10, color = [25, 25, 35], gap = 5 } = {}) => {
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(size)
        pdf.setTextColor(...color)
        const lines = pdf.splitTextToSize(String(text), contentWidth)
        lines.forEach((line) => {
          addPageIfNeeded(size * 0.45 + 2)
          pdf.text(line, margin, cursorY)
          cursorY += size * 0.45 + 1
        })
        cursorY += gap
      }

      const addHeading = (text) => {
        addPageIfNeeded(12)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(13)
        pdf.setTextColor(0, 120, 135)
        pdf.text(text, margin, cursorY)
        cursorY += 8
      }

      pdf.setFillColor(10, 10, 15)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      addHeading('CYBERDEV ACADEMY - REPORTE DE EXAMEN')
      addText(examTitle, { size: 15, color: [0, 229, 255], gap: 8 })
      addText(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, { color: [220, 220, 225], gap: 3 })
      addText(`Puntaje: ${score}/100 (${score10}/10) | Rango: ${rank}`, { size: 11, color: [0, 255, 102], gap: 3 })
      addText(`Correctas: ${correct}/${total} | Incorrectas: ${incorrect}/${total} | Tiempo: ${formatTime(timeUsed)}`, { color: [220, 220, 225], gap: 8 })

      addHeading('ANALISIS POR TEMA')
      Object.entries(topicAnalysis).forEach(([topic, data]) => {
        const percentage = Math.round((data.correct / data.total) * 100)
        addText(`${topic}: ${data.correct}/${data.total} (${percentage}%)`, { gap: 2 })
      })
      cursorY += 4

      addHeading('RECOMENDACIONES')
      addText(
        weakTopics.length > 0
          ? `Refuerza: ${weakTopics.map(({ topic, percentage }) => `${topic} (${percentage}%)`).join(', ')}.`
          : 'Dominio solido en todos los temas evaluados. Continua practicando para mantener tu nivel.',
        { color: weakTopics.length > 0 ? [170, 115, 0] : [0, 150, 75], gap: 8 },
      )

      addHeading('DETALLE DE RESPUESTAS')
      details.forEach((detail, index) => {
        const userAnswer = detail.userAnswer >= 0
          ? `${String.fromCharCode(65 + detail.userAnswer)}. ${detail.options[detail.userAnswer]}`
          : 'Sin responder'
        const correctAnswer = `${String.fromCharCode(65 + detail.correctAnswer)}. ${detail.options[detail.correctAnswer]}`
        addText(`${index + 1}. ${detail.isCorrect ? 'CORRECTA' : 'INCORRECTA'} - ${detail.question}`, { size: 9, color: detail.isCorrect ? [0, 125, 65] : [175, 30, 70], gap: 1 })
        addText(`Tu respuesta: ${userAnswer}`, { size: 8, color: [220, 220, 225], gap: 1 })
        if (!detail.isCorrect) addText(`Respuesta correcta: ${correctAnswer}`, { size: 8, color: [0, 125, 65], gap: 3 })
        else cursorY += 2
      })

      const totalPages = pdf.getNumberOfPages()
      for (let page = 1; page <= totalPages; page++) {
        pdf.setPage(page)
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 160)
        pdf.text(`CyberDev Academy | Página ${page} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
      }

      pdf.save(`reporte-${safeTitle || 'cyberdev'}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error('No fue posible exportar el reporte a PDF.', error)
      setExportError('No se pudo generar el archivo PDF. Intenta nuevamente.')
    } finally {
      setIsExporting(false)
    }
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
      <div className="mb-8">
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
                      {d.isCorrect ? <Check size={17} strokeWidth={3} aria-label="Respuesta correcta" /> : <X size={17} strokeWidth={3} aria-label="Respuesta incorrecta" />}
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

      {/* Recomendaciones */}
      <div className="mb-8">
        <CyberCard borderColor={weakTopics.length > 0 ? 'yellow' : 'green'}>
          <h3 className="font-mono text-sm text-cyber-yellow uppercase tracking-wider mb-3">
            {'>'} RECOMENDACIONES
          </h3>
          {weakTopics.length > 0 ? (
            <div className="space-y-2">
              <p className="font-mono text-xs text-cyber-text">
                Refuerza estos temas antes del siguiente intento:
              </p>
              <ul className="space-y-1 font-mono text-xs text-cyber-yellow">
                {weakTopics.map(({ topic, percentage }) => (
                  <li key={topic} className="flex items-center gap-2">
                    <TriangleAlert size={14} aria-hidden="true" /> {topic}: {percentage}% de aciertos
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="font-mono text-xs text-cyber-green">
              Dominio sólido en todos los temas evaluados. Continúa practicando para mantener tu nivel.
            </p>
          )}
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
        <CyberButton color="cyan" variant="outline" onClick={handlePdfExport} disabled={isExporting}>
          {isExporting ? <Printer size={16} className="animate-pulse" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
          {isExporting ? 'GENERANDO PDF...' : 'DESCARGAR REPORTE PDF'}
        </CyberButton>
        <CyberButton color="pink" variant="outline" onClick={onBack}>
          VOLVER AL MENÚ
        </CyberButton>
      </div>
      {exportError && (
        <p className="mt-4 text-center font-mono text-xs text-cyber-pink" role="alert">
          {exportError}
        </p>
      )}
    </div>
  )
}
