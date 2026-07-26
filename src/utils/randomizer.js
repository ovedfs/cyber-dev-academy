/**
 * Algoritmo Fisher-Yates Shuffle para mezclar arrays
 */
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Selecciona 25 preguntas aleatorias de un banco de datos
 * con balance de dificultad: 10 fáciles, 10 intermedias, 5 avanzadas
 * @param {Array} bank - Banco de preguntas completo
 * @param {Array} excludeIds - IDs de preguntas a excluir (usadas en sesión anterior)
 * @returns {Array} - 25 preguntas seleccionadas y mezcladas
 */
export function selectQuestions(bank, excludeIds = []) {
  // Filtrar preguntas excluidas
  let available = bank.filter((q) => !excludeIds.includes(q.id))

  // Si no hay suficientes, usar todo el banco
  if (available.length < 25) {
    available = [...bank]
  }

  // Separar por dificultad
  const easy = available.filter((q) => q.difficulty === 'easy')
  const medium = available.filter((q) => q.difficulty === 'medium')
  const hard = available.filter((q) => q.difficulty === 'hard')

  // Seleccionar 10 fáciles, 10 intermedias, 5 avanzadas
  const selectedEasy = shuffle(easy).slice(0, 10)
  const selectedMedium = shuffle(medium).slice(0, 10)
  const selectedHard = shuffle(hard).slice(0, 5)

  let selected = [...selectedEasy, ...selectedMedium, ...selectedHard]

  // Si no se alcanzaron 25, completar con las restantes
  if (selected.length < 25) {
    const usedIds = new Set(selected.map((q) => q.id))
    const remaining = shuffle(available.filter((q) => !usedIds.has(q.id)))
    selected = [...selected, ...remaining.slice(0, 25 - selected.length)]
  }

  // Mezclar el resultado final y mezclar opciones de cada pregunta
  return shuffle(selected).map((q) => {
    const correctOption = q.options[q.correctAnswer]
    const shuffledOptions = shuffle(q.options)
    const newCorrectAnswer = shuffledOptions.indexOf(correctOption)
    return {
      ...q,
      options: shuffledOptions,
      correctAnswer: newCorrectAnswer,
    }
  })
}