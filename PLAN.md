# 🚀 PLAN DE DESARROLLO ARQUITECTÓNICO & TÉCNICO
## **CyberDev Academy: Plataforma Gamificada de Práctica de Programación Web**

---

## 📄 1. RESUMEN EJECUTIVO Y OBJETIVO DEL PROYECTO

**CyberDev Academy** es una aplicación web interactiva, educativa y gamificada con estética **Cyberpunk / Dark Mode**, diseñada para estudiantes de educación secundaria (12 a 15 años) con conocimientos iniciales en HTML, CSS, JavaScript, React básico y Git/GitHub.

La plataforma busca transformar la evaluación de conceptos teóricos y la práctica de programación en un entorno inmersivo tipo videojuego ("programadores en formación"). A través de dos simuladores de examen teóricos/técnicos de 25 preguntas aleatorias, un entorno de resolución de errores en código vivo (*Fix the Code*) alimentado por Monaco Editor (VS Code) con Hot Reload, y una zona de entrenamiento de lógica de algoritmos, los alumnos desarrollan destrezas de depuración y razonamiento computacional.

---

## 🛠️ 2. STACK TECNOLÓGICO Y HERRAMIENTAS

| Componente | Tecnología | Descripción / Utilidad |
| :--- | :--- | :--- |
| **Framework Base** | **React 18 + Vite** | Entorno de desarrollo ultrarrápido, estructura basada en componentes y compilación optimizada. |
| **Estilado & UI** | **Tailwind CSS + CSS Modules** | Paleta Cyberpunk customizada, efectos Neon Glow, animaciones de terminal. |
| **Editor de Código** | **Monaco Editor (`@monaco-editor/react`)** | Integración del motor nativo de Visual Studio Code para edición multitestaña de HTML, CSS y JS. |
| **Icons & Visuals** | **Lucide React + Canvas Confetti** | Iconografía cyberpunk y efectos de partículas/animaciones de recompensa. |
| **Efectos de Sonido** | **Howler.js (`use-sound`)** | Retroalimentación auditiva tipo arcade para aciertos, errores, niveles completados y escritura en terminal. |
| **Generación de PDF** | **`html2pdf.js` / Native Print API** | Reportes detallados de resultados con semáforo de aciertos/errores, insignias y recomendaciones. |
| **Persistencia** | **Browser `localStorage`** | Guardado de progreso local, XP, insignias desbloqueadas, partidas guardadas y configuración de usuario. |
| **Hosting & CI/CD** | **Vercel / Netlify / GitHub Pages** | Integración continua con compilación automática desde el repositorio Git. |

---

## 🎨 3. GUÍA DE DISEÑO & IDENTIDAD VISUAL (CYBERPUNK)

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
│   │   ├── badges/               # SVG de medallas y rangos
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
  - **Rango Asignado:** ej. *Web Explorer* (<60), *HTML Padawan* (60-79), *CSS Apprentice* (80-89), *JS Developer* (90-100).
  - **Generación PDF:** Botón "Guardar Reporte Oficial PDF" que compila los aciertos, las áreas a reforzar y el certificado de logro.

---

### 5.2 Módulo 2: Laboratorio "Fix the Code" (10+ Páginas con Bugs)
- **Interfaz Dividida (Split-Screen):**
  - **Panel Izquierdo:** Editor Monaco multi-pestaña (`index.html`, `styles.css`, `script.js`).
  - **Panel Derecho:** iFrame aislado (`sandbox`) con renderizado en vivo y *Hot Reload* debounced a 500ms tras dejar de escribir.
- **Sistema de Diagnóstico & Pistas:**
  - **Consola de Errores:** Muestra mensajes de error interpretados en lenguaje sencillo para estudiantes de secundaria.
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
  - 🎓 *Web Graduate:* Obtener un puntaje perfecto (100/100) en cualquier simulador.
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

### **Fase 2: Estructuración y Generación de Bancos de Datos** ✅ *(Completada el 25/07/2026)*
- [x] Creación de `theoryBank.json` (150+ preguntas teóricas de programación).
- [x] Creación de `webTechBank.json` (150+ preguntas de HTML, CSS, JS, React, Git).
- [x] Diseño de las 10 misiones para "Fix the Code" con código HTML/CSS/JS roto y scripts de validación.
- [x] Creación de retos de lógica JS.
**Importante:** Para determinar los topicos de los bancos de datos revisar el **Anexo 1** al final de este documento.

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

## 📚 8. ANEXO 1 "Temario Detallado por Módulo y Tecnología"

### 1. 🧠 Programación Básica (Conceptos Generales)
*Orientado al Simulador Teórico de Fundamentos y Desafíos de Lógica.*

* **Variables y Constantes:**
  * Declaración con `let` y `const` (y diferencias históricas con `var`).
  * Alcance (*Scope*): Bloque vs. Función vs. Global.
  * Convenciones de nombre y buenas prácticas (*camelCase*, nombres descriptivos).
* **Tipos de Datos Primarios:**
  * Primitivos: `String`, `Number`, `Boolean`, `null`, `undefined`.
  * Verificación de tipos con el operador `typeof`.
* **Operadores Básicos:**
  * Aritméticos: `+`, `-`, `*`, `/`, `%` (módulo).
  * Asignación: `=`, `+=`, `-=`, `*=`, `/=`.
  * Comparación e Igualdad: `==`, `===` (estricta), `!=`, `!==`, `>`, `<`, `>=`, `<=`.
  * Lógicos: `&&` (AND), `||` (OR), `!` (NOT).
* **Estructuras de Control / Condicionales:**
  * Control de flujo con `if`, `else if` y `else`.
  * Operador ternario (`condicion ? valor1 : valor2`).
  * Selección múltiple con `switch` y `case`.
* **Ciclos y Bucle Iterativo:**
  * Bucle `for` clásico (inicialización, condición, incremento).
  * Bucle `while` y concepto de bucle infinito.
  * Control de ciclos: `break` y `continue`.
* **Funciones:**
  * Declaración de funciones tradicionales vs. Funciones flecha (*Arrow Functions*).
  * Parámetros, argumentos y valores por defecto.
  * Retorno de valores con la palabra clave `return`.
* **Estructuras de Datos Iniciales:**
  * **Arreglos (*Arrays*):** Creación, índices, acceso a elementos y propiedad `.length`.
  * **Objetos Literales:** Clave-valor, acceso con notación de punto (`objeto.propiedad`) y corchetes (`objeto['propiedad']`).
* **Introducción a POO (Programación Orientada a Objetos):**
  * Conceptos fundamentales: Clase (*Class*), Objeto / Instancia, Propiedades y Métodos.
  * Uso básico de la palabra clave `this` y el método `constructor()`.

---

### 2. 🌐 HTML5 (Estructura Web)
*Orientado al Simulador Técnico Web y Laboratorio "Fix the Code".*

* **Estructura Documental Básica:**
  * Anuncio de tipo de documento: `<!DOCTYPE html>`.
  * Elementos raíz y metadatos: `<html>`, `<head>`, `<body>`, `<meta charset="UTF-8">`, `<title>`.
  * Inclusión de recursos externos: `<link rel="stylesheet" ...>` y `<script src="...">`.
* **Etiquetas Semánticas:**
  * Estructuración del maquetado: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
  * Importancia de la semántica para SEO y accesibilidad.
* **Contenido y Jerarquía de Texto:**
  * Encabezados principales y secundarios: `<h1>` a `<h6>`.
  * Estructuración de párrafos: `<p>`, `<br>`, `<hr>`.
  * Listas: Ordenadas (`<ol>`), desordenadas (`<ul>`) e ítems (`<li>`).
  * Énfasis de texto: `<strong>`, `<em>`, `<span>`.
* **Multimedia y Enlaces:**
  * Hipervínculos: `<a href="..." target="_blank">` y anclas locales.
  * Inserción de imágenes: `<img src="..." alt="...">` (uso obligatorio del atributo `alt`).
  * Audio y Video básico: `<audio>`, `<video>`, `<source>`.
* **Formularios Interactivos:**
  * Elemento `<form>` y atributos `action` y `method`.
  * Controles de entrada: `<input>` (tipos: `text`, `password`, `email`, `number`, `checkbox`, `radio`, `submit`, `color`, `date`).
  * Etiquetas de campo y selección: `<label>`, `<textarea>`, `<select>`, `<option>`, `<button>`.
* **Identificadores y Clases:**
  * Reglas de atributos: `id` (único e irrepetible por página) vs `class` (reutilizable).

---

### 3. 🎨 CSS3 (Estilos y Diseño)
*Orientado al Simulador Técnico Web y Laboratorio "Fix the Code".*

* **Sintaxis y Métodos de Inserción:**
  * Estilos en línea, hoja interna (`<style>`) y hoja externa (`.css`).
  * Estructura de reglas: `selector { propiedad: valor; }`.
* **Selectores y Especificidad:**
  * Selectores básicos: Etiqueta, Clase (`.mi-clase`), ID (`#mi-id`).
  * Selectores combinados y universales (`*`, `div p`).
  * Pseudoclases interactivas: `:hover`, `:active`, `:focus`, `:first-child`, `:nth-child()`.
* **Modelo de Caja (*Box Model*):**
  * Áreas de la caja: Contenido (`content`), Relleno (`padding`), Borde (`border`), Margen (`margin`).
  * Control de dimensiones: `width`, `height`, `max-width`, `min-width`.
  * Modificación del cálculo de caja: `box-sizing: border-box`.
* **Colores, Tipografías y Fondos:**
  * Representación de color: Nombre, Nombres HEX (`#ff0000`), RGB (`rgb(255, 0, 0)`), RGBA/HSLA.
  * Estilos de texto: `font-family`, `font-size`, `font-weight`, `text-align`, `text-decoration`, `line-height`.
  * Propiedades de fondo: `background-color`, `background-image`, `background-size`.
* **Posicionamiento y Layout:**
  * Comportamiento de flujo: `display` (`block`, `inline`, `inline-block`, `none`).
  * Posicionamiento CSS: `position` (`static`, `relative`, `absolute`, `fixed`, `sticky`), `top`, `right`, `bottom`, `left`, `z-index`.
* **Flexbox (Caja Flexible):**
  * Contenedor Padre: `display: flex`, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap`.
  * Elementos Hijos: `flex-grow`, `flex-shrink`, `flex-basis`.
* **CSS Grid (Rejilla Básica):**
  * Contenedor Padre: `display: grid`, `grid-template-columns`, `grid-template-rows`, `gap`.
  * Uso de la unidad de fracción `fr` y función `repeat()`.
* **Unidades de Medida y Responsive Design:**
  * Absolutas (`px`) vs Relativas (`%`, `em`, `rem`, `vw`, `vh`).
  * Adaptabilidad: Consultas de medios básicas (`@media (max-width: 768px) { ... }`).

---

### 4. ⚡ JavaScript Moderno & DOM (Lógica Dinámica)
*Orientado a Simuladores, Fix the Code y Zona de Lógica.*

* **Manipulación y Selección del DOM:**
  * Métodos de selección: `document.getElementById()`, `document.querySelector()`, `document.querySelectorAll()`.
  * Lectura y modificación de contenido: `.textContent`, `.innerHTML`, `.value` (para inputs).
  * Estilos y Clases CSS: `.style.propiedad`, `.classList.add()`, `.classList.remove()`, `.classList.toggle()`.
  * Modificación de atributos: `.setAttribute()`, `.getAttribute()`.
* **Manejo de Eventos (*Event Listeners*):**
  * Escuchadores de eventos: `element.addEventListener('evento', callback)`.
  * Eventos comunes: `click`, `submit`, `input`, `change`, `keydown`, `keyup`, `DOMContentLoaded`.
  * Control de comportamiento por defecto: `event.preventDefault()`.
* **Métodos de Arrays Avanzados:**
  * Iteración y transformación: `.forEach()`, `.map()`.
  * Filtro y búsqueda: `.filter()`, `.find()`, `.includes()`, `.some()`, `.every()`.
  * Mutación de arreglos: `.push()`, `.pop()`, `.shift()`, `.unshift()`, `.splice()`.
* **Template Literals y Strings:**
  * Cadenas interpoladas con backticks (`` `Hola ${nombre}` ``).
  * Métodos de String: `.toLowerCase()`, `.toUpperCase()`, `.includes()`, `.trim()`, `.slice()`.
* **Formatos de Datos (JSON):**
  * Estructura JSON vs Objeto JS.
  * Conversión: `JSON.parse()` y `JSON.stringify()`.

---

### 5. ⚛️ React Básico (Componentes e Interfaz Reactiva)
*Orientado al Simulador Técnico Web y Ejercicios de Lógica.*

* **Conceptos Fundamentales:**
  * Filosofía de React: Arquitectura basada en Componentes.
  * Concepto de SPA (*Single Page Application*) y Virtual DOM.
* **Sintaxis JSX:**
  * Reglas de formato: Un único elemento raíz (o Fragment `<>...</>`), cierre de todas las etiquetas.
  * Diferencias con HTML: `className` en lugar de `class`, `htmlFor` en lugar de `for`.
  * Evaluación de expresiones JS dentro de JSX usando llaves `{}`.
* **Componentes y Propiedades (*Props*):**
  * Creación de Componentes Funcionales.
  * Paso y recepción de datos a través de `props`.
  * Desestructuración de *props* (`function MiComponente({ titulo, subtitulo })`).
  * Propiedad especial `children`.
* **Estado en React (`useState`):**
  * Importación y declaración del hook: `const [valor, setValor] = useState(valorInicial);`.
  * Concepto de Reactividad y Re-renderizado.
  * Actualización correcta del estado en eventos.
* **Manejo de Eventos en React:**
  * Atributos de evento sintéticos: `onClick`, `onChange`, `onSubmit`.
  * Binding de funciones y paso de parámetros.
* **Renderizado Condicional y Listas:**
  * Muestreo condicional mediante operador ternario `? :` y operador `&&`.
  * Renderizado de listas mediante `.map()`.
  * Importancia y uso del atributo `key` en listas iteradas.

---

### 6. 🐙 Git & GitHub (Control de Versiones y Colaboración)
*Orientado al Simulador Técnico Web.*

* **Conceptos Fundamentales:**
  * ¿Qué es un Sistema de Control de Versiones (VCS)?
  * Repositorio Local vs Repositorio Remoto.
  * Las 3 áreas de Git: Directorio de Trabajo (*Working Directory*), Área de Preparación (*Staging Area*) y Repositorio (*Git Directory/.git*).
* **Comandos Esenciales en Terminal:**
  * `git init`: Inicialización de un nuevo repositorio.
  * `git status`: Inspección del estado de los archivos (modificados, rastreados, no rastreados).
  * `git add <archivo>` / `git add .`: Preparación de cambios para el commit.
  * `git commit -m "Mensaje"`: Creación de un punto de restauración en el historial.
  * `git log` / `git log --oneline`: Visualización del historial de versiones.
* **Manejo de Ramas (*Branches*):**
  * Concepto de rama principal (`main` / `master`) y ramas de características (*feature branches*).
  * `git branch`: Listar o crear ramas.
  * `git checkout <rama>` / `git switch <rama>`: Moverse entre ramas.
  * `git merge`: Fusión básica de ramas.
* **Flujo de Trabajo con GitHub:**
  * `git clone <URL>`: Clondación de repositorios remotos.
  * `git remote add origin <URL>`: Vinculación con repositorios remotos.
  * `git push -u origin <rama>`: Enviar cambios al servidor remoto.
  * `git pull`: Descargar e integrar cambios remotos.
* **Buenas Prácticas:**
  * Mensajes de *commit* claros, concisos y descriptivos.
  * Uso y configuración del archivo `.gitignore` (exclusión de `node_modules`, `.env`, etc.).

---
*Plan arquitectónico generado y listo para ejecución.*
