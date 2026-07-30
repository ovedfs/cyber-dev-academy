const codeColors = {
  keyword: 'text-cyber-purple',
  string: 'text-cyber-green',
  number: 'text-cyber-yellow',
  comment: 'text-cyber-text/50 italic',
  operator: 'text-cyber-pink',
  function: 'text-cyber-cyan',
  bracket: 'text-cyber-text',
  method: 'text-cyber-blue',
}

// Palabras clave de JavaScript para resaltar
const KEYWORDS = new Set([
  'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for',
  'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this',
  'class', 'extends', 'import', 'export', 'default', 'from', 'async',
  'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof',
  'console', 'true', 'false', 'null', 'undefined', 'NaN', 'Array',
  'Object', 'String', 'Number', 'Boolean', 'Map', 'Set', 'Promise',
])

/**
 * Aplica resaltado de sintaxis básico a una línea de código
 * y devuelve un array de fragmentos con sus clases de color
 */
function highlightLine(line) {
  if (!line.trim()) return [{ text: line, color: '' }]

  const fragments = []
  let remaining = line

  // Patrones para identificar tokens
  const patterns = [
    // Strings (comillas dobles, simples o backticks)
    { regex: /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/, type: 'string' },
    // Comentarios de línea
    { regex: /(\/\/.*)/, type: 'comment' },
    // Números
    { regex: /\b(\d+\.?\d*)\b/, type: 'number' },
    // Palabras clave y funciones
    { regex: /\b(console)\b/, type: 'method' },
    { regex: /\b(let|const|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|default|from|async|await|try|catch|finally|throw|typeof|instanceof|of|in)\b/, type: 'keyword' },
    { regex: /\b(true|false|null|undefined|NaN)\b/, type: 'keyword' },
    // Operadores
    { regex: /(===?|!==?|=>|&&|\|\||[+\-*/%]=?|[<>]=?)/, type: 'operator' },
    // Paréntesis, corchetes, llaves
    { regex: /([{}()\[\]])/, type: 'bracket' },
    // Puntos (métodos)
    { regex: /(\.\w+)/, type: 'method' },
  ]

  while (remaining.length > 0) {
    let earliestMatch = null
    let earliestType = ''

    for (const { regex, type } of patterns) {
      const match = remaining.match(regex)
      if (match && match.index !== undefined) {
        // Si el match está en el índice 0 o hay texto antes, considerar
        if (earliestMatch === null || match.index < earliestMatch.index) {
          earliestMatch = match
          earliestType = type
        }
      }
    }

    if (earliestMatch && earliestMatch.index !== undefined) {
      // Texto antes del match
      if (earliestMatch.index > 0) {
        fragments.push({ text: remaining.slice(0, earliestMatch.index), color: '' })
      }
      // El match
      fragments.push({ text: earliestMatch[0], color: codeColors[earliestType] || '' })
      remaining = remaining.slice(earliestMatch.index + earliestMatch[0].length)
    } else {
      // No hay más matches, agregar el resto
      if (remaining) {
        fragments.push({ text: remaining, color: '' })
      }
      break
    }
  }

  return fragments
}

/**
 * Formatea una línea de código: indentación y resaltado
 */
function formatCodeLine(line) {
  const trimmed = line.trim()
  if (!trimmed) return { fragments: [], indent: 0 }

  // Calcular indentación basada en llaves
  const indent = line.length - line.trimStart().length
  const fragments = highlightLine(trimmed)

  return { fragments, indent }
}

/**
 * Procesa un bloque de código: divide en líneas, identa correctamente
 */
function processCodeBlock(code) {
  // Si el código ya tiene saltos de línea, procesar normalmente
  if (code.includes('\n')) {
    const rawLines = code.split('\n')
    let currentIndent = 0

    return rawLines.map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return { fragments: [], indent: 0 }

      // Si la línea empieza con } o ] o ), reducir indentación
      let displayIndent = currentIndent
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        displayIndent = Math.max(0, currentIndent - 1)
      }

      // Actualizar indentación para la siguiente línea
      const openCount = (trimmed.match(/[{[(]/g) || []).length
      const closeCount = (trimmed.match(/[}\])]/g) || []).length
      currentIndent = Math.max(0, currentIndent + openCount - closeCount)

      return { fragments: highlightLine(trimmed), indent: displayIndent }
    })
  }

  // Código en una sola línea: parsear caracter por caracter
  // para dividir correctamente por {, }, ; respetando strings
  const lines = []
  let current = ''
  let depth = 0
  let inString = false
  let stringChar = null

  for (let i = 0; i < code.length; i++) {
    const char = code[i]

    // Manejar strings
    if ((char === '"' || char === "'" || char === '`') && !inString) {
      inString = true
      stringChar = char
      current += char
    } else if (char === stringChar && inString) {
      // Verificar que no sea escapado
      if (i === 0 || code[i - 1] !== '\\') {
        inString = false
        stringChar = null
      }
      current += char
    } else if (!inString) {
      if (char === '{') {
        // Si hay contenido antes de la llave, empujarlo como línea
        if (current.trim()) {
          lines.push({ text: current.trim(), indent: depth })
        }
        // La llave va en su propia línea
        lines.push({ text: '{', indent: depth })
        depth++
        current = ''
      } else if (char === '}') {
        // Si hay contenido antes de cerrar, empujarlo
        if (current.trim()) {
          lines.push({ text: current.trim(), indent: depth })
        }
        depth = Math.max(0, depth - 1)
        // La llave de cierre va en su propia línea
        lines.push({ text: '}', indent: depth })
        current = ''
      } else if (char === ';') {
        current += ';'
        if (current.trim()) {
          lines.push({ text: current.trim(), indent: depth })
        }
        current = ''
      } else if (char === '[' || char === '(') {
        depth++
        current += char
      } else if (char === ']' || char === ')') {
        depth--
        current += char
      } else {
        current += char
      }
    } else {
      current += char
    }
  }

  // Lo que quede pendiente
  if (current.trim()) {
    lines.push({ text: current.trim(), indent: depth })
  }

  // Convertir a formato de fragmentos con resaltado
  return lines.map(({ text, indent }) => ({
    fragments: highlightLine(text),
    indent,
  }))
}

/**
 * Determina si un segmento de código es inline (palabra clave aislada)
 * o si debe mostrarse como bloque de código completo.
 * 
 * Reglas:
 * - Código multilínea → bloque
 * - Palabra clave o símbolo individual → inline
 * - Contiene punto y coma → bloque (sentencia completa)
 * - Control flow / función / clase → bloque
 * - Expresión corta (≤40 chars) → inline
 * - Largo → bloque
 */
function isInlineCode(content) {
  if (!content) return true
  if (content.includes('\n')) return false

  const trimmed = content.trim()

  // Palabra clave individual (let, const, if, return, map, etc.)
  const singleWordPattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
  // Símbolo aislado ({}, [], (), +, =>, etc.)
  const singleSymbolPattern = /^[{}()\[\]+\-*/%=<>!&|^~;:,.?'"`@#$]+$/

  if (singleWordPattern.test(trimmed) || singleSymbolPattern.test(trimmed)) return true

  // Sentencia completa con punto y coma → bloque
  if (trimmed.includes(';')) return false

  // Estructuras de control, función o clase → bloque
  if (/^(for|while|if|switch|function|class)\s*\(/.test(trimmed)) return false

  // Expresión corta (typeof x, x > 5, "Hola", etc.) → inline
  if (trimmed.length <= 40) return true

  // Por defecto, contenido largo → bloque
  return false
}

/**
 * FormattedQuestion - Renderiza preguntas con código formateado
 * 
 * Detecta bloques de código dentro de backticks `` `codigo` ``
 * y los renderiza con formato de bloque de código con sintaxis coloreada.
 * Las palabras clave aisladas se renderizan como inline code.
 */
export default function FormattedQuestion({ text }) {
  if (!text) return null

  // Dividir el texto en segmentos: texto normal y bloques de código
  const segments = []
  let remaining = text
  let idx = 0

  while (remaining.length > 0) {
    const codeStart = remaining.indexOf('`')
    
    if (codeStart === -1) {
      // No hay más código, agregar el resto como texto normal
      segments.push({ type: 'text', content: remaining })
      break
    }

    // Texto antes del código
    if (codeStart > 0) {
      segments.push({ type: 'text', content: remaining.slice(0, codeStart) })
    }

    // Encontrar el backtick de cierre
    const restAfterOpen = remaining.slice(codeStart + 1)
    const codeEnd = restAfterOpen.indexOf('`')

    if (codeEnd === -1) {
      // No hay cierre, tratar como texto normal
      segments.push({ type: 'text', content: remaining.slice(codeStart) })
      break
    }

    // Código entre backticks
    const code = restAfterOpen.slice(0, codeEnd)
    segments.push({ type: 'code', content: code })
    
    remaining = restAfterOpen.slice(codeEnd + 1)
  }

  return (
    <div className="font-mono text-base sm:text-lg text-cyber-text leading-relaxed">
      {segments.map((segment, i) => {
        if (segment.type === 'code') {
          // Determinar si es inline o bloque
          if (isInlineCode(segment.content)) {
            // Inline code: renderizar como <code> en línea
            return (
              <code
                key={i}
                className="px-1.5 py-0.5 bg-cyber-dark/60 border border-cyber-border/30 rounded text-sm font-mono text-cyber-cyan mx-1"
              >
                {segment.content}
              </code>
            )
          }

          // Block code: renderizar con el formato completo existente
          const codeLines = processCodeBlock(segment.content)
          
          return (
            <div
              key={i}
              className="my-4 bg-cyber-dark/80 border border-cyber-border/50 rounded-lg overflow-hidden"
            >
              {/* Barra de título del bloque de código */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-cyber-dark border-b border-cyber-border/30">
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-pink/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-yellow/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-green/80" />
                <span className="ml-2 text-[10px] text-cyber-text/40 font-mono uppercase tracking-wider">
                  JavaScript
                </span>
              </div>
              {/* Contenido del código */}
              <pre className="p-4 overflow-x-auto text-sm leading-6 m-0">
                <code>
                  {codeLines.map((line, lineIdx) => (
                    <div key={lineIdx} className="whitespace-pre">
                      {line.fragments.length > 0 ? (
                        <>
                          <span className="select-none text-cyber-text/20 mr-4 text-[10px] inline-block w-6 text-right">
                            {lineIdx + 1}
                          </span>
                          {'  '.repeat(line.indent)}
                          {line.fragments.map((frag, fragIdx) => (
                            <span key={fragIdx} className={frag.color || 'text-cyber-text/90'}>
                              {frag.text}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="select-none text-cyber-text/20 mr-4 text-[10px] inline-block w-6 text-right">
                          {lineIdx + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          )
        }

        // Texto normal
        return (
          <span key={i} className="text-cyber-text">
            {segment.content}
          </span>
        )
      })}
    </div>
  )
}