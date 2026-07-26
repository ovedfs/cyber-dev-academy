import { useState, useEffect } from 'react'
import CyberCard from '../common/CyberCard'
import FormattedQuestion from '../common/FormattedQuestion'

const difficultyConfig = {
  easy: { label: 'Fácil', color: 'text-cyber-green', border: 'green' },
  medium: { label: 'Intermedio', color: 'text-cyber-yellow', border: 'yellow' },
  hard: { label: 'Avanzado', color: 'text-cyber-pink', border: 'pink' },
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showResult = false,
}) {
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(false)
    const timer = setTimeout(() => setAnimateIn(true), 50)
    return () => clearTimeout(timer)
  }, [question?.id])

  if (!question) return null

  const diff = difficultyConfig[question.difficulty] || difficultyConfig.easy
  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null

  const getOptionStyle = (index) => {
    const isSelected = selectedAnswer === index
    const isCorrect = index === question.correctAnswer

    if (showResult) {
      if (isCorrect) {
        return 'border-cyber-green bg-cyber-green/10 text-cyber-green shadow-neon-green'
      }
      if (isSelected && !isCorrect) {
        return 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink shadow-neon-pink'
      }
      return 'border-cyber-border/50 text-cyber-text/50'
    }

    if (isSelected) {
      return 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan shadow-neon-cyan'
    }

    return 'border-cyber-border hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 text-cyber-text'
  }

  const optionLabels = ['A', 'B', 'C', 'D']

  return (
    <div
      className={`transition-all duration-300 ${
        animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <CyberCard borderColor={diff.border}>
        {/* Header: Número y dificultad */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-cyber-cyan">
            {'>'} PREGUNTA {questionNumber}/{totalQuestions}
          </span>
          <span className={`font-mono text-xs ${diff.color} uppercase tracking-wider`}>
            [{diff.label}]
          </span>
        </div>

        {/* Tema */}
        <div className="mb-3">
          <span className="font-mono text-[10px] text-cyber-purple uppercase tracking-widest">
            # {question.topic}
          </span>
        </div>

        {/* Pregunta */}
        <div className="mb-6">
          <FormattedQuestion text={question.question} />
        </div>

        {/* Opciones */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correctAnswer

            return (
              <button
                key={index}
                onClick={() => !showResult && onAnswer(index)}
                disabled={showResult}
                className={`
                  w-full text-left font-mono text-sm p-4 rounded-md border
                  transition-all duration-150
                  ${getOptionStyle(index)}
                  ${!showResult && !isSelected ? 'cursor-pointer' : 'cursor-default'}
                  ${!showResult ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`
                      flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center
                      text-xs font-bold
                      ${
                        showResult && isCorrect
                          ? 'border-cyber-green bg-cyber-green text-cyber-dark'
                          : showResult && isSelected && !isCorrect
                          ? 'border-cyber-pink bg-cyber-pink text-cyber-dark'
                          : isSelected
                          ? 'border-cyber-cyan bg-cyber-cyan text-cyber-dark'
                          : 'border-cyber-border text-cyber-text'
                      }
                    `}
                  >
                    {showResult && isCorrect
                      ? '✓'
                      : showResult && isSelected && !isCorrect
                      ? '✗'
                      : optionLabels[index]}
                  </span>
                  <span className="flex-1 pt-0.5">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Indicador de respondida */}
        {isAnswered && !showResult && (
          <div className="mt-4 text-right">
            <span className="font-mono text-[10px] text-cyber-green uppercase tracking-wider">
              ✓ Respondida
            </span>
          </div>
        )}
      </CyberCard>
    </div>
  )
}