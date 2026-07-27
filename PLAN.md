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
- **Fase Actual:** Fase 5 (Lógica & Gamificación)
- **Última Tarea:** Mapa de Misiones (`MissionMap.jsx`) completado.
- **Próxima Tarea:** Zona de Lógica (`LogicLabView.jsx`).

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
- [ ] **Zona de Lógica (`LogicLabView.jsx`):** Vista de retos interactivos de algoritmos JS (arreglos, métodos, funciones) evaluando el resultado en tiempo real.
- [ ] **Sistema de Logros (`AchievementBadge.jsx`):** Galería de medallas/insignias guardadas en `localStorage` que se desbloquean al cumplir hitos (ej. 3 bugs corregidos, puntaje perfecto).
- [ ] **Audio/FX:** Integrar efectos de sonido con Howler.js (acierto, error, level up) y partículas Confetti al ganar.

### Fase 6: Optimización y Despliegue
- [ ] Pruebas en pantalla/laptops de resolución estándar
- [ ] Optimización de carga (Lazy loading para Monaco Editor)
- [ ] Configuración de script/workflow para despliegue (Vercel/GitHub Pages)

---

## 📝 Historial de Cambios
- **2026-07-26:** Finalizada Fase 4 (Monaco Editor, Sandbox, Validador y Pistas).
- **2026-07-27:** Completado Mapa de Misiones con 23 misiones en 3 módulos, nodos con estados bloqueado/desbloqueado/completado, barras de progreso y navegación integrada.
