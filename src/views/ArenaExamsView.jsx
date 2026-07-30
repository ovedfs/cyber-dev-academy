import { useState, useRef } from 'react'
import { BookOpen, Brain, Clock3, Target } from 'lucide-react'
import confetti from 'canvas-confetti'
import CyberCard from '../components/common/CyberCard'
import CyberButton from '../components/common/CyberButton'
import ExamRunner from '../components/exam/ExamRunner'
import theoryBank from '../data/theoryBank.json'
import webTechBank from '../data/webTechBank.json'

export default function ArenaExamsView({ onBack, onComplete, playCorrect, playError, playLevelUp }) {
  const viewRef = useRef(null)
  const [selectedExam, setSelectedExam] = useState(null)

  const handleExamComplete = (examId, results) => {
    if (onComplete) onComplete(examId, results)
    // Confetti si puntaje >= 80%
    if (results.score >= 80) {
      const rect = viewRef.current?.getBoundingClientRect()
      if (rect) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#00ff66', '#00e5ff', '#9d00ff', '#ffcc00'],
        })
      }
    }
  }

  if (selectedExam) {
    return (
      <ExamRunner
        questionBank={selectedExam.bank}
        examTitle={selectedExam.title}
        onBack={() => setSelectedExam(null)}
        onComplete={(results) => handleExamComplete(selectedExam.id, results)}
        playCorrect={playCorrect}
        playError={playError}
        playLevelUp={playLevelUp}
      />
    )
  }

  return (
    <div ref={viewRef} className="max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <p className="font-mono text-sm text-cyber-green mb-2">
          {'>'} SELECCIONA UN MODO DE EXAMEN
        </p>
        <h1 className="font-mono text-3xl font-bold text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
          Arena de Exámenes
        </h1>
        <p className="font-mono text-sm text-cyber-purple mt-2">
          Pon a prueba tus conocimientos con 25 preguntas aleatorias
        </p>
      </div>

      {/* Tarjetas de selección */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Examen Teórico */}
        <CyberCard borderColor="green" className="cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="text-center">
            <BookOpen className="mx-auto mb-4 text-cyber-green" size={42} strokeWidth={1.5} aria-hidden="true" />
            <h2 className="font-mono text-xl font-bold text-cyber-green mb-2">
              Examen Teórico
            </h2>
            <p className="font-mono text-xs text-cyber-text mb-4">
              HTML5, CSS3, React, Git y tecnologías fundamentales del desarrollo web.
            </p>
            <div className="space-y-1 mb-4">
              <p className="flex items-center justify-center gap-1 font-mono text-[10px] text-cyber-cyan">
                <BookOpen size={13} aria-hidden="true" /> {webTechBank.length} preguntas disponibles
              </p>
              <p className="flex items-center justify-center gap-1 font-mono text-[10px] text-cyber-yellow">
                <Target size={13} aria-hidden="true" /> 25 preguntas <span aria-hidden="true">·</span> <Clock3 size={13} aria-hidden="true" /> 30 min
              </p>
            </div>
            <CyberButton
              color="green"
              onClick={() =>
                setSelectedExam({ id: 'theory', title: 'Examen Teórico', bank: webTechBank })
              }
            >
              COMENZAR
            </CyberButton>
          </div>
        </CyberCard>

        {/* Examen Técnico Web */}
        <CyberCard borderColor="cyan" className="cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="text-center">
            <Brain className="mx-auto mb-4 text-cyber-cyan" size={42} strokeWidth={1.5} aria-hidden="true" />
            <h2 className="font-mono text-xl font-bold text-cyber-cyan mb-2">
              Examen Técnico Web
            </h2>
            <p className="font-mono text-xs text-cyber-text mb-4">
              Conceptos de programación: variables, funciones, POO, estructuras de control y ejercicios de "¿Qué imprime?".
            </p>
            <div className="space-y-1 mb-4">
              <p className="flex items-center justify-center gap-1 font-mono text-[10px] text-cyber-cyan">
                <BookOpen size={13} aria-hidden="true" /> {theoryBank.length} preguntas disponibles
              </p>
              <p className="flex items-center justify-center gap-1 font-mono text-[10px] text-cyber-yellow">
                <Target size={13} aria-hidden="true" /> 25 preguntas <span aria-hidden="true">·</span> <Clock3 size={13} aria-hidden="true" /> 30 min
              </p>
            </div>
            <CyberButton
              color="cyan"
              onClick={() =>
                setSelectedExam({ id: 'webtech', title: 'Examen Técnico Web', bank: theoryBank })
              }
            >
              COMENZAR
            </CyberButton>
          </div>
        </CyberCard>
      </div>

      {/* Botón volver */}
      <div className="text-center">
        <CyberButton color="pink" variant="outline" onClick={onBack}>
          ← VOLVER AL MENÚ PRINCIPAL
        </CyberButton>
      </div>
    </div>
  )
}
