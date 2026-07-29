import { useMemo, useCallback } from 'react'
import achievements from '../data/achievementsBank'

/**
 * Hook personalizado para gestionar la lógica de logros.
 * Verifica condiciones de desbloqueo contra el estado actual del juego.
 */
export default function useAchievements(gameState, addBadge, addXP) {
  // Determinar qué logros están desbloqueados según el estado actual
  const unlockedAchievements = useMemo(() => {
    return achievements.filter((a) => a.condition(gameState))
  }, [gameState])

  // IDs de logros desbloqueados
  const unlockedIds = useMemo(
    () => new Set(unlockedAchievements.map((a) => a.id)),
    [unlockedAchievements]
  )

  // Logros bloqueados (no se cumple la condición aún)
  const lockedAchievements = useMemo(
    () => achievements.filter((a) => !unlockedIds.has(a.id)),
    [unlockedIds]
  )

  // Verificar si hay logros nuevos por desbloquear
  const checkNewAchievements = useCallback(() => {
    const newlyUnlocked = achievements.filter(
      (a) => a.condition(gameState) && !gameState.badges.includes(a.id)
    )

    for (const achievement of newlyUnlocked) {
      addBadge(achievement.id)
      if (achievement.xpReward) {
        addXP(achievement.xpReward)
      }
    }

    return newlyUnlocked
  }, [gameState, addBadge, addXP])

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    unlockedIds,
    totalAchievements: achievements.length,
    unlockedCount: unlockedAchievements.length,
    checkNewAchievements,
  }
}