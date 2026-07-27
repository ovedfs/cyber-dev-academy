import { useState } from 'react'
import { Check, Download, Printer, TriangleAlert, X } from 'lucide-react'
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
      const margin = 18
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const contentWidth = pageWidth - margin * 2
      let cursorY = 25

      // Colores del tema claro
      const COLORS = {
        primary: [0, 102, 204],      // Azul principal
        secondary: [51, 51, 51],      // Texto oscuro
        dark: [30, 30, 30],           // Títulos
        gray: [100, 100, 100],        // Texto secundario
        lightGray: [240, 240, 240],   // Fondos suaves
        white: [255, 255, 255],       // Fondo blanco
        green: [0, 150, 80],          // Correcto
        red: [200, 50, 50],           // Incorrecto
        orange: [200, 140, 0],        // Advertencia
      }

      const addPageIfNeeded = (space = 7) => {
        if (cursorY + space > pageHeight - 20) {
          pdf.addPage()
          cursorY = 25
        }
      }

      const addText = (text, { size = 10, color = COLORS.dark, gap = 5, bold = false } = {}) => {
        pdf.setFont('helvetica', bold ? 'bold' : 'normal')
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

      const addDivider = () => {
        addPageIfNeeded(6)
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.3)
        pdf.line(margin, cursorY, margin + contentWidth, cursorY)
        cursorY += 6
      }

      const addSectionTitle = (text) => {
        addPageIfNeeded(10)
        // Fondo de sección
        pdf.setFillColor(...COLORS.primary)
        pdf.roundedRect(margin, cursorY, contentWidth, 7, 1.5, 1.5, 'F')
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.setTextColor(...COLORS.white)
        pdf.text(text, margin + 3, cursorY + 5)
        cursorY += 12
      }

      // ===== ENCABEZADO =====
      // Fondo del encabezado
      pdf.setFillColor(240, 245, 255)
      pdf.roundedRect(margin, cursorY, contentWidth, 35, 2, 2, 'F')
      // Línea decorativa izquierda
      pdf.setFillColor(...COLORS.primary)
      pdf.rect(margin, cursorY, 3, 35, 'F')

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      pdf.setTextColor(...COLORS.primary)
      pdf.text('CYBERDEV ACADEMY', margin + 8, cursorY + 10)

      pdf.setFontSize(11)
      pdf.setTextColor(...COLORS.secondary)
      pdf.text('Reporte de Evaluación', margin + 8, cursorY + 20)

      pdf.setFontSize(8)
      pdf.setTextColor(...COLORS.gray)
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin + 8, cursorY + 29)
      cursorY += 40

      // ===== INFORMACIÓN DEL EXAMEN =====
      addSectionTitle('INFORMACIÓN DEL EXAMEN')
      addText(`Examen: ${examTitle}`, { size: 11, bold: true, gap: 2 })
      addText(`Rango obtenido: ${rank}`, { size: 10, gap: 2 })

      // Tabla de resultados
      const tableX = margin
      const tableY = cursorY
      const colWidths = [62, 62, 62]
      const rowHeight = 7

      pdf.setFillColor(245, 247, 250)
      pdf.roundedRect(tableX, tableY, contentWidth, rowHeight * 2 + 4, 1.5, 1.5, 'F')

      // Cabeceras
      pdf.setFillColor(...COLORS.primary)
      pdf.roundedRect(tableX, tableY, colWidths[0], rowHeight, 1, 1, 'F')
      pdf.roundedRect(tableX + colWidths[0], tableY, colWidths[1], rowHeight, 1, 1, 'F')
      pdf.roundedRect(tableX + colWidths[0] + colWidths[1], tableY, colWidths[2], rowHeight, 1, 1, 'F')

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.setTextColor(...COLORS.white)
      pdf.text('Puntaje', tableX + colWidths[0] / 2, tableY + 5, { align: 'center' })
      pdf.text('Correctas', tableX + colWidths[0] + colWidths[1] / 2, tableY + 5, { align: 'center' })
      pdf.text('Tiempo usado', tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, tableY + 5, { align: 'center' })

      // Filas
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      const scoreColor = score >= 80 ? COLORS.green : score >= 60 ? COLORS.orange : COLORS.red
      pdf.setTextColor(...scoreColor)
      pdf.text(`${score}/100`, tableX + colWidths[0] / 2, tableY + rowHeight + 5, { align: 'center' })

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(...COLORS.dark)
      pdf.text(`${correct}/${total}`, tableX + colWidths[0] + colWidths[1] / 2, tableY + rowHeight + 5, { align: 'center' })
      pdf.text(formatTime(timeUsed), tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, tableY + rowHeight + 5, { align: 'center' })

      cursorY = tableY + rowHeight * 2 + 8

      // ===== ANÁLISIS POR TEMA =====
      addDivider()
      addSectionTitle('ANÁLISIS POR TEMA')

      Object.entries(topicAnalysis).forEach(([topic, data]) => {
        const percentage = Math.round((data.correct / data.total) * 100)
        const barColor = percentage >= 80 ? COLORS.green : percentage >= 60 ? COLORS.orange : COLORS.red

        addText(`${topic}`, { size: 9, bold: true, gap: 1 })
        addText(`${data.correct}/${data.total} (${percentage}%)`, { size: 8, color: COLORS.gray, gap: 4 })

        // Barra de progreso
        addPageIfNeeded(6)
        pdf.setFillColor(230, 230, 230)
        pdf.roundedRect(margin, cursorY, contentWidth, 4, 2, 2, 'F')
        pdf.setFillColor(...barColor)
        pdf.roundedRect(margin, cursorY, contentWidth * (percentage / 100), 4, 2, 2, 'F')
        cursorY += 8
      })

      // ===== RECOMENDACIONES =====
      addDivider()
      addSectionTitle('RECOMENDACIONES')

      if (weakTopics.length > 0) {
        addText('Áreas que requieren refuerzo:', { size: 9, bold: true, gap: 3 })
        weakTopics.forEach(({ topic, percentage }) => {
          addText(`  • ${topic} (${percentage}% de aciertos)`, { size: 9, color: COLORS.orange, gap: 2 })
        })
        addText('Recomendamos repasar estos temas y practicar con ejercicios adicionales.', { size: 9, color: COLORS.gray, gap: 4 })
      } else {
        addText('¡Dominio sólido en todos los temas evaluados!', { size: 10, color: COLORS.green, bold: true, gap: 2 })
        addText('Continúa practicando para mantener y mejorar tu nivel actual.', { size: 9, color: COLORS.gray, gap: 4 })
      }

      // ===== DETALLE DE RESPUESTAS =====
      addDivider()
      addSectionTitle('DETALLE DE RESPUESTAS')

      details.forEach((detail, index) => {
        addPageIfNeeded(16)

        const userAnswer = detail.userAnswer >= 0
          ? `${String.fromCharCode(65 + detail.userAnswer)}. ${detail.options[detail.userAnswer]}`
          : 'Sin responder'
        const correctAnswer = `${String.fromCharCode(65 + detail.correctAnswer)}. ${detail.options[detail.correctAnswer]}`

        // Fondo de la pregunta
        const bgColor = detail.isCorrect ? [235, 250, 240] : [255, 240, 240]
        const borderColor = detail.isCorrect ? COLORS.green : COLORS.red

        // Calcular altura del bloque
        const questionLines = pdf.splitTextToSize(detail.question, contentWidth - 20)
        const blockHeight = Math.max(20, questionLines.length * 4.5 + 16)

        if (cursorY + blockHeight > pageHeight - 20) {
          pdf.addPage()
          cursorY = 25
        }

        pdf.setFillColor(...bgColor)
        pdf.setDrawColor(...borderColor)
        pdf.setLineWidth(0.5)
        pdf.roundedRect(margin, cursorY, contentWidth, blockHeight, 1.5, 1.5, 'FD')

        // Indicador de resultado
        pdf.setFillColor(...borderColor)
        const indicatorX = margin + 3
        const indicatorY = cursorY + 4
        pdf.circle(indicatorX + 4, indicatorY + 4, 3.5, 'F')

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(7)
        pdf.setTextColor(...COLORS.white)
        pdf.text(detail.isCorrect ? '✓' : '✗', indicatorX + 4, indicatorY + 5.5, { align: 'center' })

        // Número y pregunta
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(9)
        pdf.setTextColor(...COLORS.dark)
        const questionText = `${index + 1}. ${detail.isCorrect ? 'CORRECTA' : 'INCORRECTA'}`
        pdf.text(questionText, indicatorX + 10, indicatorY + 3)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(...COLORS.secondary)
        const qLines = pdf.splitTextToSize(detail.question, contentWidth - 20)
        pdf.text(qLines, indicatorX + 10, indicatorY + 9)

        // Tema y dificultad
        pdf.setFontSize(7)
        pdf.setTextColor(...COLORS.gray)
        const diffLabel = detail.difficulty === 'easy' ? 'Fácil' : detail.difficulty === 'medium' ? 'Intermedio' : 'Avanzado'
        pdf.text(`Tema: ${detail.topic} · ${diffLabel}`, indicatorX + 10, cursorY + blockHeight - 3)

        // Tu respuesta
        const answerY = cursorY + blockHeight + 3
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8)
        pdf.setTextColor(...COLORS.dark)
        pdf.text('Tu respuesta:', margin + 5, answerY)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(...(detail.isCorrect ? COLORS.green : COLORS.red))
        const userAnswerLines = pdf.splitTextToSize(userAnswer, contentWidth - 20)
        pdf.text(userAnswerLines, margin + 5, answerY + 4)

        // Respuesta correcta (solo si falló)
        if (!detail.isCorrect) {
          const correctY = answerY + 4 + (userAnswerLines.length * 4)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(8)
          pdf.setTextColor(...COLORS.green)
          pdf.text('Respuesta correcta:', margin + 5, correctY)

          pdf.setFont('helvetica', 'normal')
          const correctLines = pdf.splitTextToSize(correctAnswer, contentWidth - 20)
          pdf.text(correctLines, margin + 5, correctY + 4)

          cursorY = correctY + 4 + (correctLines.length * 4) + 6
        } else {
          cursorY = answerY + 4 + (userAnswerLines.length * 4) + 6
        }
      })

      // ===== PIE DE PÁGINA =====
      const totalPages = pdf.getNumberOfPages()
      for (let page = 1; page <= totalPages; page++) {
        pdf.setPage(page)
        // Línea de pie
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.3)
        pdf.line(margin, pageHeight - 14, margin + contentWidth, pageHeight - 14)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(7)
        pdf.setTextColor(...COLORS.gray)
        pdf.text('CyberDev Academy - Plataforma Gamificada de Aprendizaje', margin, pageHeight - 8)
        pdf.text(`Página ${page} de ${totalPages}`, margin + contentWidth, pageHeight - 8, { align: 'right' })
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
