/**
 * BugValidator - Motor de validación de soluciones para el laboratorio "Fix the Code"
 *
 * Evalúa las pruebas de validación definidas en cada desafío contra el código
 * del usuario (HTML, CSS, JS) y determina si la solución es correcta.
 *
 * Cada prueba consiste en una expresión JS que se evalúa contra las strings
 * de código. Las pruebas buscan patrones específicos en el texto del código.
 */

/**
 * Ejecuta todas las pruebas de validación para un desafío
 * @param {Object} challenge - El objeto del desafío (de bugChallenges)
 * @param {Object} userFiles - { html: string, css: string, js: string }
 * @returns {{ passed: boolean, results: Array<{description: string, passed: boolean}>, passedCount: number, totalCount: number }}
 */
export function validateChallenge(challenge, userFiles) {
  if (!challenge || !challenge.validation || !challenge.validation.tests) {
    return {
      passed: false,
      results: [],
      passedCount: 0,
      totalCount: 0,
    }
  }

  const tests = challenge.validation.tests
  const results = tests.map((test) => {
    try {
      const passed = evaluateTest(test, userFiles)
      return {
        description: test.description,
        passed,
      }
    } catch (error) {
      console.warn(`Error evaluando test: "${test.description}"`, error)
      return {
        description: test.description,
        passed: false,
        error: error.message,
      }
    }
  })

  const passedCount = results.filter((r) => r.passed).length
  const totalCount = results.length

  return {
    passed: passedCount === totalCount,
    results,
    passedCount,
    totalCount,
  }
}

/**
 * Evalúa una prueba individual
 * @param {Object} test - { description: string, test: string (expresión JS) }
 * @param {Object} userFiles - { html: string, css: string, js: string }
 * @returns {boolean}
 */
function evaluateTest(test, userFiles) {
  const { html, css, js } = userFiles

  // Crear un contexto con las variables disponibles para las pruebas
  // Las pruebas pueden usar: html, css, js como strings y funciones auxiliares
  const context = {
    html: html || '',
    css: css || '',
    js: js || '',
    // Funciones auxiliares para pruebas comunes
    includesAny: (str, patterns) => patterns.some((p) => str.includes(p)),
    includesAll: (str, patterns) => patterns.every((p) => str.includes(p)),
    countOccurrences: (str, substr) => (str.match(new RegExp(substr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length,
    matchesRegex: (str, regex) => new RegExp(regex).test(str),
    trim: (str) => str.trim(),
    toLowerCase: (str) => str.toLowerCase(),
  }

  // Evaluar la expresión de prueba en el contexto
  const fn = new Function(...Object.keys(context), `"use strict"; return (${test.test});`)
  const result = fn(...Object.values(context))

  return Boolean(result)
}

/**
 * Obtiene las diferencias entre el código actual y la solución esperada
 * @param {Object} challenge - El objeto del desafío
 * @param {Object} userFiles - { html: string, css: string, js: string }
 * @returns {{ hasDifferences: boolean, details: Array<{file: string, message: string}> }}
 */
export function getSolutionDiff(challenge, userFiles) {
  const details = []
  const solution = challenge.solution

  if (!solution) {
    return { hasDifferences: false, details: [] }
  }

  // Comparar HTML
  if (solution.html && userFiles.html !== solution.html) {
    details.push({
      file: 'html',
      message: 'El HTML no coincide exactamente con la solución esperada',
    })
  }

  // Comparar CSS
  if (solution.css && userFiles.css !== solution.css) {
    details.push({
      file: 'css',
      message: 'El CSS no coincide exactamente con la solución esperada',
    })
  }

  // Comparar JS
  if (solution.js && userFiles.js !== solution.js) {
    details.push({
      file: 'js',
      message: 'El JavaScript no coincide exactamente con la solución esperada',
    })
  }

  return {
    hasDifferences: details.length > 0,
    details,
  }
}

export default {
  validateChallenge,
  getSolutionDiff,
}