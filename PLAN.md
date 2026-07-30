# 🚀 PLAN DE PROYECTO

## 📄 Resumen & Objetivo
Plataforma gamificada con estética cyberpunk para evaluar y ejercitar conceptos de programación web en estudiantes.

---

## 🛠️ Stack & Convenciones
- **Core:** React 18 + Vite + Tailwind CSS
- **Modulos:** Monaco Editor (`@monaco-editor/react`), Lucide React, Howler.js
- **Persistencia:** `localStorage`
- **Estilo de código:** Functional Components, Custom Hooks, Tailwind utilities, JS Moderno (sin TS).

---

## 📌 Estado del Proyecto
- **Fase Actual:** Fase 5 (Lógica & Gamificación) — ✅ COMPLETADA
- **Última Tarea:** Audio/FX (sonidos y confetti) completado.
- **Próxima Tarea:** Fase 6 — Optimización y Despliegue.

---

## 📅 Roadmap de Desarrollo

### Fase 1: Cimientos y UI Base
- [x] Configuración inicial Vite + React + Tailwind
- [x] Componentes base UI (CyberButton, CyberCard, Navbar, XPBar, Modal)
- [x] Custom Hooks (`useLocalStorage`, `useGameProgress`)

### Fase 2: Bancos de Datos
- [x] Crear `theoryBank.json` y `webTechBank.json`
- [x] Crear misiones para "Fix the Code" y retos de lógica

### Fase 3: Arena de Exámenes
- [x] Motor de examen aleatorio (`useExamEngine`)
- [x] UI de preguntas y navegación una a una
- [x] Dashboard de resultados con semáforo y exportador PDF

### Fase 4: Laboratorio "Fix the Code"
- [x] Integración de Monaco Editor multi-pestaña
- [x] Sandbox iFrame con Hot Reload
- [x] Motor de validación (`BugValidator`) y sistema de pistas

### Fase 5: Lógica & Gamificación (📍 EN PROGRESO)
- [x] **Mapa de Misiones (`MissionMap.jsx`):** Renderizar nodos estilo videojuego con estados (bloqueado/desbloqueado/estrellas) vinculados al XP del usuario.
- [x] **Zona de Lógica (`LogicLabView.jsx`):** Vista de retos interactivos de algoritmos JS (arreglos, métodos, funciones) evaluando el resultado en tiempo real con Monaco Editor, motor de evaluación, tips pedagógicos y consola de resultados.
- [x] **Sistema de Logros (`AchievementBadge.jsx`):** Galería de medallas/insignias guardadas en `localStorage` que se desbloquean al cumplir hitos (ej. 3 bugs corregidos, puntaje perfecto).
- [x] **Audio/FX:** Integrar efectos de sonido con Howler.js (acierto, error, level up) y partículas Confetti al ganar.

### 🔧 Correcciones Pre-Fase 6
- [x] **Logo como enlace al home:** Navbar ahora tiene botón que navega al inicio.
- [x] **Backticks en respuestas:** Limpiar opciones con backticks en bancos de preguntas.
- [x] **Tipos de examen invertidos:** Intercambiar bancos theoryBank ↔ webTechBank.
- [x] **Separar pregunta de código:** Mejorar espaciado en FormattedQuestion.
- [ ] **Formato for loop:** Corregir parser para que no divida `for(...)` en líneas.
- [ ] **Clases en LogicLab:** Evaluador debe soportar `class` además de `function`.
- [ ] **Mapa de Misiones:** Corregir contador de exámenes completados.

### Fase 6: Optimización y Despliegue
- [ ] Pruebas en pantalla/laptops de resolución estándar
- [ ] Optimización de carga (Lazy loading para Monaco Editor)
- [ ] Configuración de script/workflow para despliegue (Vercel/GitHub Pages)

---

## 📝 Historial de Cambios
- **2026-07-26:** Finalizada Fase 4 (Monaco Editor, Sandbox, Validador y Pistas).
- **2026-07-27:** Completado Mapa de Misiones con 23 misiones en 3 módulos, nodos con estados bloqueado/desbloqueado/completado, barras de progreso y navegación integrada.
- **2026-07-27:** Completada Zona de Lógica con 10 retos JS, Monaco Editor, evaluador con test cases, tips pedagógicos y consola redimensionable.
- **2026-07-28:** Persistencia de código solución en desafíos de lógica + libre elección de desafíos + compatibilidad con datos legacy en localStorage.
- **2026-07-28:** Completado Sistema de Logros: 14 logros, hook useAchievements, galería con filtros, tooltips, barra de progreso, banner de nuevos logros y tarjeta de acceso en home.
- **2026-07-29:** Completado Audio/FX: sonidos procedurales con Web Audio API (correcto, error, level up, click) + confetti en exámenes, desafíos, lógica y logros. Finalizada Fase 5.
- **2026-07-29:** Corrección #1: Logo CyberDev como enlace al home (Navbar + App).
- **2026-07-29:** Corrección #2: Backticks eliminados de opciones en theoryBank.json y webTechBank.json. Scripts de limpieza pendientes de eliminar.
- **2026-07-29:** Corrección #3: Tipos de examen invertidos — Examen Teórico ahora usa webTechBank y Examen Técnico Web usa theoryBank.
- **2026-07-29:** Corrección #4: Separar pregunta de código en FormattedQuestion — inline code para palabras clave aisladas, block code para código multilínea/completo.
