import useLocalStorage from './useLocalStorage'

const RANKS = [
  { minXP: 0, name: 'Web Explorer' },
  { minXP: 200, name: 'HTML Padawan' },
  { minXP: 500, name: 'CSS Apprentice' },
  { minXP: 800, name: 'JS Developer' },
  { minXP: 1000, name: 'React Master' },
]

const XP_PER_LEVEL = 1000

export default function useGameProgress() {
  const [gameState, setGameState] = useLocalStorage('cyberdev_progress', {
    xp: 0,
    level: 1,
    stars: 0,
    completedExams: [],
    completedChallenges: [],
    completedLogicChallenges: [],
    badges: [],
    soundEnabled: true,
  })

  const addXP = (amount) => {
    setGameState((prev) => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      }
    })
  }

  const getRank = () => {
    const currentXP = gameState.xp
    let rank = RANKS[0].name
    for (const r of RANKS) {
      if (currentXP >= r.minXP) rank = r.name
    }
    return rank
  }

  const getXPInLevel = () => {
    return gameState.xp % XP_PER_LEVEL
  }

  const completeExam = (examId, score) => {
    setGameState((prev) => ({
      ...prev,
      completedExams: [
        ...prev.completedExams.filter((e) => e.id !== examId),
        { id: examId, score, date: new Date().toISOString() },
      ],
    }))
  }

  const completeChallenge = (challengeId) => {
    setGameState((prev) => ({
      ...prev,
      completedChallenges: prev.completedChallenges.includes(challengeId)
        ? prev.completedChallenges
        : [...prev.completedChallenges, challengeId],
    }))
  }

  // Helper para normalizar completedLogicChallenges (soporta objetos {id, code} o strings legacy)
  const getNormalizedLogicIds = (list) => {
    return list.map((item) => (typeof item === 'string' ? item : item.id))
  }

  const getLogicChallengeCode = (challengeId) => {
    const entry = gameState.completedLogicChallenges.find(
      (item) => (typeof item === 'string' ? item : item.id) === challengeId
    )
    return entry && typeof entry === 'object' ? entry.code : null
  }

  const completeLogicChallenge = (challengeId, userCode = '') => {
    setGameState((prev) => {
      const normalized = getNormalizedLogicIds(prev.completedLogicChallenges)
      if (normalized.includes(challengeId)) {
        // Actualizar código si ya existe
        return {
          ...prev,
          completedLogicChallenges: prev.completedLogicChallenges.map((item) => {
            const id = typeof item === 'string' ? item : item.id
            return id === challengeId ? { id: challengeId, code: userCode } : item
          }),
        }
      }
      return {
        ...prev,
        completedLogicChallenges: [
          ...prev.completedLogicChallenges,
          { id: challengeId, code: userCode },
        ],
      }
    })
  }

  const addBadge = (badgeId) => {
    setGameState((prev) => ({
      ...prev,
      badges: prev.badges.includes(badgeId)
        ? prev.badges
        : [...prev.badges, badgeId],
    }))
  }

  const toggleSound = () => {
    setGameState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }))
  }

  const resetProgress = () => {
    setGameState({
      xp: 0,
      level: 1,
      stars: 0,
      completedExams: [],
      completedChallenges: [],
      completedLogicChallenges: [],
      badges: [],
      soundEnabled: true,
    })
  }

  return {
    gameState,
    addXP,
    getRank,
    getXPInLevel,
    completeExam,
    completeChallenge,
    completeLogicChallenge,
    getLogicChallengeCode,
    addBadge,
    toggleSound,
    resetProgress,
    RANKS,
    XP_PER_LEVEL,
  }
}