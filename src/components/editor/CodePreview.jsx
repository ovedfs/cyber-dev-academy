import { useState, useEffect, useRef, useCallback } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function CodePreview({ files, challengeId }) {
  const iframeRef = useRef(null)
  const [key, setKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceTimerRef = useRef(null)

  // Generar el HTML completo combinando todos los archivos
  const generateHTML = useCallback(() => {
    const html = files.html || ''
    const css = files.css || ''
    const js = files.js || ''

    // Si el HTML no tiene DOCTYPE, envolver en estructura básica
    let fullHTML = html
    if (!html.includes('<!DOCTYPE html>') && !html.includes('<html')) {
      fullHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`
    } else {
      // Siempre inyectar CSS inline (el sandbox no carga archivos externos)
      // Primero eliminar referencias a archivos externos CSS/JS
      fullHTML = fullHTML
        .replace(/<link[^>]*href=["'][^"']*styles\.css[^"']*["'][^>]*\/?>/gi, '')
        .replace(/<script[^>]*src=["'][^"']*script\.js[^"']*["'][^>]*><\/script>/gi, '')

      // Inyectar CSS antes de </head>
      if (css.trim()) {
        fullHTML = fullHTML.replace('</head>', `<style>\n${css}\n</style>\n</head>`)
      }

      // Inyectar JS antes de </body>
      if (js.trim() && !js.includes('// No se necesita JavaScript')) {
        fullHTML = fullHTML.replace('</body>', `<script>\n${js}\n<\/script>\n</body>`)
      }
    }

    return fullHTML
  }, [files])

  // Actualizar preview con debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setIsLoading(true)
    setError(null)

    debounceTimerRef.current = setTimeout(() => {
      setKey((prev) => prev + 1)
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [files, challengeId])

  // Manejar iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Manejar errores del iframe
  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    setError('Error al renderizar la vista previa')
  }, [])

  const fullHTML = generateHTML()

  return (
    <div className="flex flex-col h-full border border-cyber-border rounded-lg overflow-hidden bg-cyber-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-cyber-border bg-cyber-card">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-cyber-cyan">🔍 PREVIEW</span>
          <span className="font-mono text-[10px] text-cyber-text/40">(Hot Reload)</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <RefreshCw size={12} className="text-cyber-yellow animate-spin" aria-label="Actualizando..." />
          )}
          <button
            onClick={() => setKey((prev) => prev + 1)}
            className="font-mono text-xs text-cyber-cyan hover:text-cyber-green transition-colors border border-cyber-border rounded px-2 py-1"
            title="Forzar recarga"
          >
            ↻ RECARGAR
          </button>
        </div>
      </div>

      {/* Contenedor del iframe */}
      <div className="flex-1 relative bg-white">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/95 z-10">
            <div className="text-center p-4">
              <AlertTriangle className="mx-auto mb-2 text-cyber-pink" size={24} />
              <p className="font-mono text-sm text-cyber-pink">{error}</p>
            </div>
          </div>
        )}

        <iframe
          key={key}
          ref={iframeRef}
          title="Vista previa en vivo"
          srcDoc={fullHTML}
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />

        {/* Overlay de carga */}
        {isLoading && (
          <div className="absolute top-2 right-2">
            <RefreshCw size={14} className="text-cyber-cyan animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}