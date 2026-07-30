import { useCallback, useRef } from 'react'
import { playCorrectSound, playErrorSound, playLevelUpSound, playClickSound } from '../utils/soundGenerator'

/**
 * Hook personalizado para reproducir efectos de sonido
 * Respeta la configuración soundEnabled del gameState
 */
export default function useSound(soundEnabled = true) {
  const enabledRef = useRef(soundEnabled)
  enabledRef.current = soundEnabled

  const playCorrect = useCallback(() => {
    if (enabledRef.current) playCorrectSound()
  }, [])

  const playError = useCallback(() => {
    if (enabledRef.current) playErrorSound()
  }, [])

  const playLevelUp = useCallback(() => {
    if (enabledRef.current) playLevelUpSound()
  }, [])

  const playClick = useCallback(() => {
    if (enabledRef.current) playClickSound()
  }, [])

  return {
    playCorrect,
    playError,
    playLevelUp,
    playClick,
  }
}