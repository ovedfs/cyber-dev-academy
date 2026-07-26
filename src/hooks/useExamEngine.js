import { useState, useCallback, useRef, useEffect } from 'react'
import { selectQuestions } from '../utils/randomizer'

/**
 * Hook que maneja la lógica del motor de exámenes
 * @param {Array} questionBank - Banco de preguntas completo
 * @param {number} timeLimit - Límite de tiempo en minutos (0 = sin límite)
 */
export default function useExamEngine(questionBank, timeLimit = 0) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [examState, setExamState] = useState('idle') // idle | running | finished
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60)
  const [excludeIds, setExcludeIds] = useState([])
  const timerRef = useRef(null)

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Timer del examen
  useEffect(() => {
    if (examState === 'running' && timeLimit > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            finishExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [examState, timeLimit])

  const startExam = useCallback(() => {
    const selected = selectQuestions(questionBank, excludeIds)
    setQuestions(selected)
    setCurrentIndex(0)
    setAnswers({})
    setExamState('running')
    setTimeRemaining(timeLimit * 60)
    setExcludeIds((prev) => {
      const newIds = [...prev, ...selected.map((q) => q.id)]
      // Mantener solo los últimos 100 IDs para no crecer infinitamente
      return newIds.slice(-100)
    })
  }, [questionBank, excludeIds, timeLimit])

  const answerQuestion = useCallback((questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }, [])

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
    }
  }, [questions.length])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, questions.length])

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setExamState('finished')
  }, [])

  // Calcular resultados
  const getResults = useCallback(() => {
    const total = questions.length
    let correct = 0
    const details = questions.map((q) => {
      const userAnswer = answers[q.id]
      const isCorrect = userAnswer === q.correctAnswer
      if (isCorrect) correct++
      return {
        ...q,
        userAnswer: userAnswer ?? -1,
        isCorrect,
      }
    })

    const score = Math.round((correct / total) * 100)
    const score10 = parseFloat((score / 10).toFixed(1))

    // Determinar rango
    let rank = 'Web Explorer'
    if (score >= 90) rank = 'JS Developer'
    else if (score >= 80) rank = 'CSS Apprentice'
    else if (score >= 60) rank = 'HTML Padawan'

    return {
      total,
      correct,
      incorrect: total - correct,
      score,
      score10,
      rank,
      details,
      timeUsed: timeLimit > 0 ? timeLimit * 60 - timeRemaining : null,
    }
  }, [questions, answers, timeLimit, timeRemaining])

  const currentQuestion = questions[currentIndex] || null
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0
  const answeredCount = Object.keys(answers).length

  return {
    // Estado
    questions,
    currentIndex,
    currentQuestion,
    answers,
    examState,
    timeRemaining,
    progress,
    answeredCount,
    totalQuestions: questions.length,

    // Acciones
    startExam,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    finishExam,
    getResults,
  }
}
