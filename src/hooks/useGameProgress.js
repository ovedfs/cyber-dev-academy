import useLocalStorage from './useLocalStorage'

const RANKS = [
  { minXP: 0, name: 'Script Kiddie' },
  { minXP: 200, name: 'Web Developer Apprentice' },
  { minXP: 500, name: 'Full-Stack Padawan' },
  { minXP: 800, name: 'Cyber Master' },
  { minXP: 1000, name: 'Hacker Elite' },
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

  const completeLogicChallenge = (challengeId) => {
    setGameState((prev) => ({
      ...prev,
      completedLogicChallenges: prev.completedLogicChallenges.includes(challengeId)
        ? prev.completedLogicChallenges
        : [...prev.completedLogicChallenges, challengeId],
    }))
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
    addBadge,
    toggleSound,
    resetProgress,
    RANKS,
    XP_PER_LEVEL,
  }
}