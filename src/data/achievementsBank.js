/**
 * @typedef {Object} Achievement
 * @property {string} id - Identificador único del logro
 * @property {string} title - Nombre visible
 * @property {string} description - Descripción del logro
 * @property {string} icon - Emoji/icono representativo
 * @property {string} color - Color cyberpunk (green, cyan, purple, pink, yellow)
 * @property {function} condition - Función que recibe gameState y retorna true si está desbloqueado
 * @property {number} [xpReward] - XP adicional al desbloquear (opcional)
 */

const achievements = [
  {
    id: 'bug-hunter',
    title: 'Bug Hunter',
    description: 'Corrige tu primer bug en Fix the Code',
    icon: '🐛',
    color: 'green',
    condition: (gs) => gs.completedChallenges.length >= 1,
    xpReward: 50,
  },
  {
    id: 'bug-exterminator',
    title: 'Bug Exterminator',
    description: 'Corrige 5 bugs en Fix the Code',
    icon: '🔧',
    color: 'green',
    condition: (gs) => gs.completedChallenges.length >= 5,
    xpReward: 100,
  },
  {
    id: 'bug-master',
    title: 'Bug Master',
    description: 'Completa todos los desafíos de Fix the Code',
    icon: '🏆',
    color: 'green',
    condition: (gs) => gs.completedChallenges.length >= 10,
    xpReward: 200,
  },
  {
    id: 'logic-pioneer',
    title: 'Logic Pioneer',
    description: 'Completa tu primer desafío de lógica',
    icon: '🧠',
    color: 'yellow',
    condition: (gs) => {
      const list = gs.completedLogicChallenges || []
      return list.length >= 1
    },
    xpReward: 50,
  },
  {
    id: 'logic-explorer',
    title: 'Logic Explorer',
    description: 'Completa 5 desafíos de lógica',
    icon: '⚡',
    color: 'yellow',
    condition: (gs) => {
      const list = gs.completedLogicChallenges || []
      return list.length >= 5
    },
    xpReward: 100,
  },
  {
    id: 'logic-master',
    title: 'Logic Master',
    description: 'Completa todos los desafíos de lógica',
    icon: '💎',
    color: 'yellow',
    condition: (gs) => {
      const list = gs.completedLogicChallenges || []
      return list.length >= 10
    },
    xpReward: 200,
  },
  {
    id: 'exam-warrior',
    title: 'Exam Warrior',
    description: 'Completa tu primer examen',
    icon: '📚',
    color: 'cyan',
    condition: (gs) => (gs.completedExams || []).length >= 1,
    xpReward: 50,
  },
  {
    id: 'exam-scholar',
    title: 'Exam Scholar',
    description: 'Completa 5 exámenes',
    icon: '🎓',
    color: 'cyan',
    condition: (gs) => (gs.completedExams || []).length >= 5,
    xpReward: 100,
  },
  {
    id: 'perfect-score',
    title: 'Puntaje Perfecto',
    description: 'Obtén 100% en cualquier examen',
    icon: '💯',
    color: 'cyan',
    condition: (gs) => {
      const exams = gs.completedExams || []
      return exams.some((e) => e.score === 100)
    },
    xpReward: 150,
  },
  {
    id: 'century',
    title: 'Century',
    description: 'Acumula 1000 XP en total',
    icon: '🌟',
    color: 'purple',
    condition: (gs) => gs.xp >= 1000,
    xpReward: 100,
  },
  {
    id: 'level-up',
    title: 'Level Up!',
    description: 'Alcanza el nivel 5',
    icon: '⬆️',
    color: 'purple',
    condition: (gs) => gs.level >= 5,
    xpReward: 150,
  },
  {
    id: 'react-master',
    title: 'React Master',
    description: 'Alcanza el rango React Master',
    icon: '👑',
    color: 'purple',
    condition: (gs) => gs.xp >= 1000,
    xpReward: 300,
  },
  {
    id: 'star-collector',
    title: 'Star Collector',
    description: 'Acumula 10 estrellas',
    icon: '⭐',
    color: 'pink',
    condition: (gs) => (gs.stars || 0) >= 10,
    xpReward: 100,
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Completa todos los desafíos de Fix the Code y Lógica',
    icon: '🎯',
    color: 'pink',
    condition: (gs) => {
      const logic = gs.completedLogicChallenges || []
      return gs.completedChallenges.length >= 10 && logic.length >= 10
    },
    xpReward: 500,
  },
]

export default achievements