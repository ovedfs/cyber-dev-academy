import { useState, useEffect } from 'react'
import { AlertTriangle, BarChart3, ChevronLeft, ChevronRight, Clock3, Lightbulb } from 'lucide-react'
import useExamEngine from '../../hooks/useExamEngine'
import QuestionCard from './QuestionCard'
import CyberButton from '../common/CyberButton'
import ExamResults from './ExamResults'

export default function ExamRunner({ questionBank, examTitle, onBack, onComplete }) {
  const {
    currentQuestion,
    currentIndex,
    questions,
    answers,
    examState,
    timeRemaining,
    progress,
    answeredCount,
    totalQuestions,
    startExam,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    finishExam,
    getResults,
  } = useExamEngine(questionBank, 30)

  const [showConfirmFinish, setShowConfirmFinish] = useState(false)
  const [results, setResults] = useState(null)

  // Formatear tiempo
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleFinish = () => {
    finishExam()
    const res = getResults()
    setResults(res)
    if (onComplete) onComplete(res)
  }

  const handleBackToMenu = () => {
    if (onBack) onBack()
  }

  // Pantalla de inicio
  if (examState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="text-center">
          <p className="font-mono text-sm text-cyber-green mb-2">
            {'>'} INICIALIZANDO EXAMEN...
          </p>
          <h2 className="font-mono text-3xl font-bold text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
            {examTitle}
          </h2>
          <div className="mt-6 font-mono text-sm text-cyber-text space-y-2">
            <p className="flex items-center justify-center gap-2 text-cyber-yellow"><AlertTriangle size={16} aria-hidden="true" /> 25 preguntas · 30 minutos · Sin límite de intentos</p>
            <p className="flex items-center justify-center gap-2 text-cyber-purple"><BarChart3 size={16} aria-hidden="true" /> Dificultad balanceada: 10 fáciles · 10 intermedias · 5 avanzadas</p>
            <p className="flex items-center justify-center gap-2 text-cyber-cyan"><Lightbulb size={16} aria-hidden="true" /> Puedes navegar entre preguntas libremente</p>
          </div>
        </div>

        <div className="flex gap-4">
          <CyberButton color="cyan" onClick={startExam}>
            INICIAR EXAMEN
          </CyberButton>
          <CyberButton color="pink" variant="outline" onClick={handleBackToMenu}>
            CANCELAR
          </CyberButton>
        </div>
      </div>
    )
  }

  // Pantalla de resultados
  if (examState === 'finished' && results) {
    return (
      <ExamResults
        results={results}
        examTitle={examTitle}
        onRetry={startExam}
        onBack={handleBackToMenu}
      />
    )
  }

  // Examen en curso
  return (
    <div className="max-w-3xl mx-auto">
      {/* Barra superior del examen */}
      <div className="mb-6 space-y-4">
        {/* Título y temporizador */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CyberButton color="pink" variant="outline" size="sm" onClick={handleBackToMenu}>
              <ChevronLeft size={16} aria-hidden="true" /> SALIR
            </CyberButton>
            <h2 className="font-mono text-lg font-semibold text-cyber-cyan">
              {'>'} {examTitle}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-cyber-purple">
              {answeredCount}/{totalQuestions} respondidas
            </span>
            <span
              className={`font-mono text-sm px-3 py-1 rounded border ${
                timeRemaining < 300
                  ? 'text-cyber-pink border-cyber-pink/50 animate-pulse'
                  : 'text-cyber-green border-cyber-green/30'
              }`}
            >
              <Clock3 className="inline-block mr-1" size={15} aria-hidden="true" /> {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-cyber-card rounded-full h-2 overflow-hidden border border-cyber-border">
          <div
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Mini mapa de preguntas */}
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined
            const isCurrent = i === currentIndex

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(i)}
                className={`
                  w-7 h-7 rounded text-[10px] font-mono font-bold border transition-all duration-100
                  ${
                    isCurrent
                      ? 'border-cyber-cyan bg-cyber-cyan text-cyber-dark shadow-neon-cyan'
                      : isAnswered
                      ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                      : 'border-cyber-border text-cyber-text/50 hover:border-cyber-cyan/50 cursor-pointer'
                  }
                `}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Pregunta actual */}
      {currentQuestion && (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswer={(index) => answerQuestion(currentQuestion.id, index)}
        />
      )}

      {/* Navegación inferior */}
      <div className="flex items-center justify-between mt-6">
        <CyberButton
          color="cyan"
          variant="outline"
          onClick={prevQuestion}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={16} aria-hidden="true" /> ANTERIOR
        </CyberButton>

        <div className="flex gap-3">
          <CyberButton color="pink" variant="outline" onClick={() => setShowConfirmFinish(true)}>
            FINALIZAR
          </CyberButton>
          {currentIndex < totalQuestions - 1 && (
            <CyberButton color="cyan" onClick={nextQuestion}>
              SIGUIENTE <ChevronRight size={16} aria-hidden="true" />
            </CyberButton>
          )}
          {currentIndex === totalQuestions - 1 && (
            <CyberButton color="green" onClick={handleFinish}>
              ENTREGAR EXAMEN
            </CyberButton>
          )}
        </div>
      </div>

      {/* Modal de confirmación para finalizar */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-cyber-card border border-cyber-pink/50 rounded-lg p-6 max-w-md w-full mx-4 shadow-neon-pink">
            <h3 className="font-mono text-lg font-semibold text-cyber-pink mb-4">
              {'>'} ¿FINALIZAR EXAMEN?
            </h3>
            <p className="font-mono text-sm text-cyber-text mb-2">
              Has respondido {answeredCount} de {totalQuestions} preguntas.
            </p>
            {answeredCount < totalQuestions && (
              <p className="flex items-center gap-2 font-mono text-xs text-cyber-yellow mb-4">
                <AlertTriangle size={15} aria-hidden="true" /> Quedan {totalQuestions - answeredCount} preguntas sin responder.
              </p>
            )}
            <div className="flex gap-3 justify-end mt-6">
              <CyberButton color="cyan" variant="outline" onClick={() => setShowConfirmFinish(false)}>
                SEGUIR
              </CyberButton>
              <CyberButton
                color="pink"
                onClick={() => {
                  setShowConfirmFinish(false)
                  handleFinish()
                }}
              >
                FINALIZAR
              </CyberButton>
              <CyberButton
                color="pink"
                variant="outline"
                onClick={() => {
                  setShowConfirmFinish(false)
                  handleBackToMenu()
                }}
              >
                SALIR
              </CyberButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
