# 🚀 PLAN DE DESARROLLO ARQUITECTÓNICO & TÉCNICO
## **CyberDev Academy: Plataforma Gamificada de Aprendizaje Web y Programación**

---

## 📄 1. RESUMEN EJECUTIVO Y OBJETIVO DEL PROYECTO

**CyberDev Academy** es una aplicación web interactiva, educativa y gamificada con estética **Cyberpunk / Dark Mode Hacker**, diseñada para estudiantes de educación secundaria (12 a 15 años) con conocimientos iniciales en HTML, CSS, JavaScript, React básico y Git/GitHub.

La plataforma busca transformar la evaluación de conceptos teóricos y la práctica de programación en un entorno inmersivo tipo videojuego ("hackers en formación"). A través de dos simuladores de examen teóricos/técnicos de 25 preguntas aleatorias, un entorno de resolución de errores en código vivo (*Fix the Code*) alimentado por Monaco Editor (VS Code) con Hot Reload, y una zona de entrenamiento de lógica de algoritmos, los alumnos desarrollan destrezas de depuración y razonamiento computacional.

---

## 🛠️ 2. STACK TECNOLÓGICO Y HERRAMIENTAS

| Componente | Tecnología | Descripción / Utilidad |
| :--- | :--- | :--- |
| **Framework Base** | **React 18 + Vite** | Entorno de desarrollo ultrarrápido, estructura basada en componentes y compilación optimizada. |
| **Estilado & UI** | **Tailwind CSS + CSS Modules** | Paleta Cyberpunk customizada, efectos Neon Glow, animaciones de terminal. |
| **Editor de Código** | **Monaco Editor (`@monaco-editor/react`)** | Integración del motor nativo de Visual Studio Code para edición multitestaña de HTML, CSS y JS. |
| **Icons & Visuals** | **Lucide React + Canvas Confetti** | Iconografía tipo hacker/cyberpunk y efectos de partículas/animaciones de recompensa. |
| **Efectos de Sonido** | **Howler.js (`use-sound`)** | Retroalimentación auditiva tipo arcade para aciertos, errores, niveles completados y escritura en terminal. |
| **Generación de PDF** | **`html2pdf.js` / Native Print API** | Reportes detallados de resultados con semáforo de aciertos/errores, insignias y recomendaciones. |
| **Persistencia** | **Browser `localStorage`** | Guardado de progreso local, XP, insignias desbloqueadas, partidas guardadas y configuración de usuario. |
| **Hosting & CI/CD** | **Vercel / Netlify / GitHub Pages** | Integración continua con compilación automática desde el repositorio Git. |

---

## 🎨 3. GUÍA DE DISEÑO & IDENTIDAD VISUAL (CYBERPUNK HACKER)

### 3.1 Paleta de Colores (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',      // Fondo principal ultra oscuro
          card: '#12131c',      // Fondos de tarjetas / contenedores
          border: '#1f2438',    // Bordes sutiles de la interfaz
          green: '#00ff66',    // Neón principal (Éxito, XP, Aciertos)
          cyan: '#00e5ff',     // Neón secundario (Botones, Git/React)
          purple: '#9d00ff',   // Neón terciario (Retos de Lógica, Nivel Boss)
          pink: '#ff007f',     // Errores, Vidas perdidas, Avisos
          yellow: '#ffcc00'    // Medallas, Estrellas, Pistas/Tips
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

### 3.2 Elementos Tipográficos & UI
- **Estilo de Texto:** Fuentes monospaciadas en encabezados, botones con sombra neón (`glow-effect`), bordes biselados tipo interfaz de cibernave.
- **Microinteracciones:** Transiciones rápidas (150ms), sonido sintético al pulsar botones, barra de vida/XP con gradiente neón.

---

## 🏗️ 4. ESTRUCTURA ARQUITECTÓNICA DEL REPOSITORIO

```text
cyber-dev-academy/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD para GitHub Pages / Vercel
├── public/
│   ├── favicon.ico
│   ├── assets/
│   │   ├── badges/               # SVG de medallas y rangos hacker
│   │   └── sounds/               # Efectos MP3/WAV (success, error, levelup, click)
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/               # Componentes reutilizables de UI
│   │   │   ├── CyberButton.jsx   # Botón neón interactivo
│   │   │   ├── CyberCard.jsx     # Tarjeta con bordes relucientes
│   │   │   ├── Navbar.jsx        # Barra superior con XP, Nivel, Rango y Mute Sonido
│   │   │   ├── XPBar.jsx         # Barra de experiencia y progreso
│   │   │   └── Modal.jsx         # Ventanas emergentes de recompensa y tips
│   │   ├── editor/               # Módulo "Fix the Code"
│   │   │   ├── CodeEditor.jsx    # Componente Monaco Editor multi-pestaña (HTML/CSS/JS)
│   │   │   ├── CodePreview.jsx   # iFrame Sandbox con Hot Reload en tiempo real
│   │   │   └── BugValidator.js   # Script de inspección de solución y DOM
│   │   ├── exam/                 # Módulo de Simuladores de Examen
│   │   │   ├── ExamRunner.jsx    # Motor de renderizado de preguntas una a una
│   │   │   ├── QuestionCard.jsx  # Opción múltiple con animaciones
│   │   │   ├── ExamResults.jsx   # Dashboard de cierre con semáforo y calificación
│   │   │   └── PDFReport.jsx     # Plantilla imprimible para exportar a PDF
│   │   ├── campaign/             # Módulo Mapa de Misiones
│   │   │   ├── MissionMap.jsx    # Mapa de nodos estilo videojuego
│   │   │   ├── LevelNode.jsx     # Nodo de nivel (Bloqueado/Desbloqueado/Estrellas)
│   │   │   └── AchievementBadge.jsx # Medallas y tarjetas de logros
│   │   └── logic/                # Módulo de Lógica JS & React
│   │       ├── LogicSandbox.jsx  # Evaluador de expresiones y funciones JS
│   │       └── ChallengeCard.jsx # Presentación del problema de código
│   ├── data/                     # Bancos de Datos y Preguntas
│   │   ├── theoryBank.json       # +150 Preguntas: Conceptos de Programación
│   │   ├── webTechBank.json      # +150 Preguntas: HTML, CSS, JS, React, Git
│   │   ├── bugChallenges.js      # 10+ Misiones de "Fix the Code" con bugs
│   │   └── logicChallenges.js    # Ejercicios de Algoritmos y Métodos JS
│   ├── hooks/                    # Custom Hooks
│   │   ├── useLocalStorage.js    # Sincronización automática de estado local
│   │   ├── useSoundEffects.js    # Control global de sonidos de la app
│   │   ├── useGameProgress.js    # Gestión de XP, Nivel, Vidas, Estrellas
│   │   └── useExamEngine.js      # Lógica de selección aleatoria y timer
│   ├── utils/                    # Funciones Auxiliares
│   │   ├── randomizer.js         # Algoritmo de desorden de preguntas y opciones
│   │   ├── pdfExporter.js        # Función de conversión a PDF
│   │   └── evaluator.js          # Evaluador seguro de código JS/DOM
│   ├── views/                    # Vistas Principales
│   │   ├── HomeView.jsx          # Terminal de bienvenida y selección de modo
│   │   ├── ArenaExamsView.jsx    # Centro de Exámenes Teóricos y Técnicos
│   │   ├── FixTheCodeView.jsx    # Entorno de depuración en vivo
│   │   ├── LogicLabView.jsx      # Laboratorio de Algoritmos
│   │   └── ProfileView.jsx       # Rango Developer, Medallas y Estadísticas
│   ├── App.jsx                   # Enrutador principal y layout general
│   ├── index.css                 # Importación de Tailwind y estilos CSS neón
│   └── main.jsx
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md                     # Guía de instalación y contribución
```

---

## ⚙️ 5. DESGLOSE DETALLADO DE MÓDULOS Y FUNCIONALIDADES

### 5.1 Módulo 1: Arena de Exámenes Teóricos y Técnicos
- **Bancos de Datos:** 
  - `theoryBank.json`: 150+ preguntas de Variables, Tipos de datos, Control de flujo, Funciones, POO básica.
  - `webTechBank.json`: 150+ preguntas de HTML5 semantic elements, CSS Flexbox/Grid, DOM manipulation, React JSX/Props/State, Comandos Git (`commit`, `push`, `branch`).
- **Mecanismo de Selección Aleatoria (`randomizer.js`):**
  1. Selecciona 25 preguntas al azar ignorando las utilizadas en la sesión inmediata anterior.
  2. Mezcla (*Fisher-Yates Shuffle*) las 4 opciones de respuesta de cada pregunta.
  3. Garantiza diversidad de dificultad (10 fáciles, 10 intermedias, 5 avanzadas).
- **Interfaz de Examen:**
  - Renderizado de **1 pregunta por pantalla**.
  - Barra de avance (1/25 a 25/25).
  - Temporizador opcional de reto (ej. 30 minutos).
- **Dashboard de Resultados y PDF:**
  - **Semáforo:** Preguntas correctas (Verde Neón), Incorrectas (Rojo/Rosa Neón).
  - **Calificación:** Escala 0 a 100 y de 0.0 a 10.0.
  - **Rango Asignado:** ej. *Script Kiddie* (<60), *Web Developer Apprentice* (60-79), *Full-Stack Padawan* (80-89), *Cyber Master* (90-100).
  - **Generación PDF:** Botón "Guardar Reporte Oficial PDF" que compila los aciertos, las áreas a reforzar y el certificado firmado con estética hacker.

---

### 5.2 Módulo 2: Laboratorio "Fix the Code" (10+ Páginas con Bugs)
- **Interfaz Dividida (Split-Screen):**
  - **Panel Izquierdo:** Editor Monaco multi-pestaña (`index.html`, `styles.css`, `script.js`).
  - **Panel Derecho:** iFrame aislado (`sandbox`) con renderizado en vivo y *Hot Reload* debounced a 500ms tras dejar de escribir.
- **Sistema de Diagnóstico & Pistas:**
  - **Consola de Errores Hacker:** Muestra mensajes de error interpretados en lenguaje sencillo para estudiantes de secundaria.
  - **Botón de Tip/Pista:** Oculta pistas progresivas. El uso de pistas consume 15 XP del recompensa final.
- **Validación de Éxito:**
  - El sistema ejecuta pruebas automatizadas en el DOM del iFrame (ej. comprobar que existe un elemento `#titulo` con estilo `color: red` o que un botón ejecuta un evento `click`).
- **Feedback de Victoria:**
  - Al corregir el código correctamente, se dispara un efecto de confetti neón, sonido de victoria arcade, modal con los XP ganados y desbloqueo de la siguiente página.

---

### 5.3 Módulo 3: Zona de Algoritmos & Lógica (JS & React)
- Ejercicios orientados a la lógica de programación mediante fragmentos de código interactivos:
  - **Arreglos y Bucles:** Filtrar números pares, sumar elementos de una lista, buscar un ítem en un inventario.
  - **Funciones y POO:** Métodos que retornan saludos personalizados, clases simples de videojuegos (Player, Enemy).
  - **React Básico:** Corregir el estado de un contador, pasar correctamente `props` a un componente visual.

---

### 5.4 Módulo 4: Sistema de Gamificación y Persistencia
- **Puntos de Experiencia (XP):**
  - Examen completado con >80%: +200 XP.
  - Desafío "Fix the Code" resuelto: +100 XP (-15 XP por pista usada).
  - Reto de Lógica superado: +50 XP.
- **Insignias y Logros Desbloqueables:**
  - 🛡️ *Git Committer:* Responder correctamente 5 preguntas seguidas sobre Git.
  - ⚡ *Bug Hunter:* Corregir 3 páginas del laboratorio.
  - 🎓 *Cyber Graduate:* Obtener un puntaje perfecto (100/100) en cualquier simulador.
- **Guardado en LocalStorage:**
  - Salva el nivel del mapa, XP acumulado, estrellas por misión y estado de los simuladores para que el alumno no pierda su progreso al cerrar el navegador.

---

## 📅 6. FASES DE EJECUCIÓN DEL PROYECTO

```
[FASE 1] Cimientos & UI Base ──► [FASE 2] Bancos de Datos ──► [FASE 3] Arena de Exámenes 
                                                                     │
[FASE 6] CI/CD & Despliegue ◄── [FASE 5] Lógica & Gamificación ◄── [FASE 4] Fix the Code
```

### **Fase 1: Configuración del Entorno y UI Cyberpunk** ✅ *(Completada el 24/07/2026)*
- [x] Inicialización del repositorio Vite + React.
- [x] Instalación e integración de Tailwind CSS con paleta cyberpunk.
- [x] Creación de componentes base (`CyberButton`, `CyberCard`, `Navbar`, `XPBar`, `Modal`).
- [x] Configuración del estado global de gamificación y `localStorage` (`useLocalStorage`, `useGameProgress`).

### **Fase 2: Estructuración y Generación de Bancos de Datos**
- [ ] Creación de `theoryBank.json` (150+ preguntas teóricas de programación).
- [ ] Creación de `webTechBank.json` (150+ preguntas de HTML, CSS, JS, React, Git).
- [ ] Diseño de las 10 misiones para "Fix the Code" con código HTML/CSS/JS roto y scripts de validación.
- [ ] Creación de retos de lógica JS.

### **Fase 3: Desarrollo de la Arena de Exámenes**
- [ ] Implementación de `useExamEngine` y algoritmo de aleatorización.
- [ ] Construcción de la vista de preguntas una a una con animaciones.
- [ ] Desarrollo del Dashboard de resultados con semáforo y cálculo de calificación.
- [ ] Integración del módulo de exportación de reportes a PDF imprimibles.

### **Fase 4: Desarrollo del Laboratorio "Fix the Code"**
- [ ] Integración de Monaco Editor (`@monaco-editor/react`) con pestañas HTML/CSS/JS.
- [ ] Construcción del iFrame sandbox de renderizado con Hot Reload.
- [ ] Implementación del motor de verificación DOM/JS para solución de bugs.
- [ ] Sistema de pistas (Tips) con penalización de XP.

### **Fase 5: Módulo de Lógica, Mapa de Misiones y Gamificación**
- [ ] Implementación del mapa interactivo de misiones con nodos desbloqueables.
- [ ] Construcción de la zona de retos de lógica en JS.
- [ ] Sistema de insignias y medallas de logros.
- [ ] Integración de efectos de sonido y animaciones de victoria (confetti).

### **Fase 6: Pruebas, Optimización y Despliegue CI/CD**
- [ ] Pruebas de usabilidad y renderizado en pantallas de laptops de secundaria.
- [ ] Optimización de assets y lazy loading del Monaco Editor.
- [ ] Creación del flujo de despliegue automatizado a Vercel / Netlify.
- [ ] Documentación final en `README.md`.

---

## 🚀 7. GUÍA DE INSTALACIÓN Y COMANDOS RÁPIDOS

### Requisitos Previos
- Node.js >= 18.x
- Git >= 2.x

### Comandos de Inicialización
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/cyber-dev-academy.git
cd cyber-dev-academy

# 2. Instalar dependencias
npm install

# 3. Iniciar entorno de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

---
*Plan arquitectónico generado y listo para ejecución.*
