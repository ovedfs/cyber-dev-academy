/**
 * Evalúa el código del usuario contra los casos de prueba de un desafío de lógica.
 * @param {Object} challenge - El objeto del desafío (con testCases, solution, etc.)
 * @param {string} userCode - El código escrito por el usuario
 * @returns {Object} { passed, passedCount, totalCount, results, logs, error }
 */
export function evaluateLogicChallenge(challenge, userCode) {
  const results = []
  const logs = []
  let error = null

  // Capturar console.log
  const originalLog = console.log
  console.log = (...args) => {
    logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
  }

  try {
    // Extraer la función del código del usuario
    // Evaluamos el código completo y luego buscamos la función definida
    const fn = new Function(
      ...challenge.testCases[0].input.map((_, i) => `arg${i}`),
      userCode
        .replace(/\/\/.*$/gm, '') // Quitar comentarios de una línea
        .replace(/\/\*[\s\S]*?\*\//g, '') // Quitar comentarios multi-línea
        .replace(/console\.log\(.*?\)/g, '') // Quitar console.logs
        .replace(/function\s+\w+\s*\(([^)]*)\)\s*{/, 'return function($1) {')
    )

    for (const testCase of challenge.testCases) {
      try {
        const actual = fn(...testCase.input)
        const passed = deepEqual(actual, testCase.expected)
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual,
          passed,
        })
      } catch (testError) {
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: testError.message,
        })
      }
    }
  } catch (evalError) {
    error = evalError.message
  } finally {
    console.log = originalLog
  }

  const passedCount = results.filter((r) => r.passed).length
  const totalCount = challenge.testCases.length

  return {
    passed: passedCount === totalCount && !error,
    passedCount,
    totalCount,
    results,
    logs,
    error,
  }
}

/**
 * Comparación profunda entre dos valores (soporta objetos, arrays, primitivos).
 */
function deepEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((val, i) => deepEqual(val, b[i]))
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every((key) => deepEqual(a[key], b[key]))
  }

  return false
}