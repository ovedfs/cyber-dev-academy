import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Hook para manejar paneles redimensionables con drag handles
 * @param {Object} options
 * @param {number} options.initialLeftWidth - Porcentaje inicial del panel izquierdo (0-100)
 * @param {number} options.initialRightWidth - Porcentaje inicial del panel derecho (0-100)
 * @param {number} options.minWidth - Porcentaje mínimo para cada panel
 * @param {string} options.direction - 'horizontal' | 'vertical'
 * @returns {Object} - { leftSize, rightSize, handleProps, collapsed, toggleCollapse }
 */
export default function useResizablePanel({
  initialLeftWidth = 50,
  initialRightWidth = 50,
  minWidth = 15,
  direction = 'horizontal',
} = {}) {
  const [leftSize, setLeftSize] = useState(initialLeftWidth)
  const [rightSize, setRightSize] = useState(initialRightWidth)
  const [isDragging, setIsDragging] = useState(false)
  const [collapsed, setCollapsed] = useState({ left: false, right: false })
  const containerRef = useRef(null)
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, right: 0 })

  // Manejar inicio del drag
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: leftSize,
      right: rightSize,
    }
  }, [leftSize, rightSize])

  // Manejar movimiento del drag
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    if (direction === 'horizontal') {
      const totalWidth = rect.width
      const deltaX = e.clientX - dragStartRef.current.x
      const deltaPercent = (deltaX / totalWidth) * 100

      const newLeft = Math.max(minWidth, Math.min(100 - minWidth, dragStartRef.current.left + deltaPercent))
      const newRight = 100 - newLeft

      setLeftSize(newLeft)
      setRightSize(newRight)
    } else {
      // Vertical: ajustar altura del panel superior
      const totalHeight = rect.height
      const deltaY = e.clientY - dragStartRef.current.y
      const deltaPercent = (deltaY / totalHeight) * 100

      const newTop = Math.max(minWidth, Math.min(100 - minWidth, dragStartRef.current.left + deltaPercent))
      const newBottom = 100 - newTop

      setLeftSize(newTop)
      setRightSize(newBottom)
    }
  }, [isDragging, minWidth, direction])

  // Manejar fin del drag
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
    }
  }, [isDragging])

  // Registrar event listeners globales
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp, direction])

  // Toggle colapso de un panel
  const toggleCollapse = useCallback((side) => {
    setCollapsed((prev) => {
      const newCollapsed = { ...prev }
      if (side === 'left') {
        newCollapsed.left = !prev.left
      } else if (side === 'right') {
        newCollapsed.right = !prev.right
      }
      return newCollapsed
    })
  }, [])

  return {
    leftSize,
    rightSize,
    isDragging,
    collapsed,
    containerRef,
    handleMouseDown,
    toggleCollapse,
    setLeftSize,
    setRightSize,
  }
}