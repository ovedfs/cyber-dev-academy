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
    // Limpiar el código: solo quitamos comentarios, NO console.logs
    const cleanCode = userCode
      .replace(/\/\/.*$/gm, '') // Quitar comentarios de una línea
      .replace(/\/\*[\s\S]*?\*\//g, '') // Quitar comentarios multi-línea

    // Detectar si el código define una clase
    // Primero busca clase que hereda (la más específica), luego clase simple
    const classMatch = cleanCode.match(/class\s+(\w+)\s+extends/) || cleanCode.match(/class\s+(\w+)/)
    // Detectar si el código define una función
    const funcMatch = cleanCode.match(/function\s+(\w+)\s*\(/)

    if (classMatch) {
      // --- EVALUACIÓN DE CLASES ---
      const className = classMatch[1]

      // Ejecutar el código limpio para definir la clase en el ámbito
      const fn = new Function(cleanCode + `\nreturn ${className};`)
      const userClass = fn()

      // Si el desafío tiene un método evaluate personalizado, usarlo
      if (typeof challenge.evaluate === 'function') {
        const actualResults = challenge.evaluate(userClass, challenge.testCases)
        for (let i = 0; i < challenge.testCases.length; i++) {
          const testCase = challenge.testCases[i]
          const actual = actualResults[i]
          const passed = deepEqual(actual, testCase.expected)
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual,
            passed,
          })
        }
      } else {
        // Fallback: intentar instanciar y llamar métodos genéricamente
        for (const testCase of challenge.testCases) {
          try {
            const instance = new userClass(...testCase.input)
            // Si el test espera un objeto con propiedades, verificamos cada una
            if (typeof testCase.expected === 'object' && testCase.expected !== null && !Array.isArray(testCase.expected)) {
              const actual = {}
              for (const key of Object.keys(testCase.expected)) {
                actual[key] = instance[key]
              }
              const passed = deepEqual(actual, testCase.expected)
              results.push({
                input: testCase.input,
                expected: testCase.expected,
                actual,
                passed,
              })
            } else {
              // Si no, comparamos directamente la instancia
              const passed = deepEqual(instance, testCase.expected)
              results.push({
                input: testCase.input,
                expected: testCase.expected,
                actual: instance,
                passed,
              })
            }
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
      }
    } else if (funcMatch) {
      // --- EVALUACIÓN DE FUNCIONES (original) ---
      const funcName = funcMatch[1]

      // Ejecutar el código limpio para definir la función en el ámbito
      const fn = new Function(cleanCode + `\nreturn ${funcName};`)
      const userFunction = fn()

      for (const testCase of challenge.testCases) {
        try {
          const actual = userFunction(...testCase.input)
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
    } else {
      throw new Error('No se encontró una función o clase definida en tu código.')
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