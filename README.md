# 🚀 CyberDev Academy

**Plataforma gamificada de práctica de programación web para estudiantes de secundaria**

CyberDev Academy es una aplicación web interactiva con estética **cyberpunk** diseñada para que estudiantes de educación secundaria (12-15 años) practiquen y refuercen sus conocimientos de programación web de forma divertida y motivante.

> ⚠️ **Nota:** La estética cyberpunk/dark mode es únicamente visual y busca hacer la interfaz atractiva para los alumnos. La plataforma **no** está relacionada con ciberseguridad, hacking ni ningún tema similar. Su único propósito es la enseñanza de programación web.

---

## ✨ Funcionalidades

- **📝 Simuladores de Examen** — Preguntas aleatorias sobre HTML, CSS, JavaScript, React y Git para evaluar conocimientos teóricos y técnicos.
- **🔧 Fix the Code** — Entorno interactivo con editor de código en vivo (Monaco Editor) para corregir errores en páginas web reales.
- **🧩 Lógica de Programación** — Ejercicios prácticos de algoritmos, funciones, arreglos y POO en JavaScript y React.
- **🏆 Gamificación** — Sistema de niveles, XP, rangos e insignias que motiva el progreso continuo.
- **📄 Reportes PDF** — Generación de reportes imprimibles con resultados, aciertos y áreas de mejora.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Framework** | React 18 + Vite |
| **Estilado** | Tailwind CSS (paleta cyberpunk personalizada) |
| **Editor de Código** | Monaco Editor (VS Code en el navegador) |
| **Iconos** | Lucide React |
| **Confetti/Animaciones** | Canvas Confetti |
| **Sonidos** | Howler.js / use-sound |
| **Persistencia** | localStorage del navegador |
| **PDF** | html2pdf.js |

---

## 📦 Instalación y Uso

### Requisitos previos
- Node.js >= 18.x
- Git >= 2.x

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/cyber-dev-academy.git
cd cyber-dev-academy

# 2. Instalar dependencias
npm install

# 3. Iniciar entorno de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Compilar para producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
cyber-dev-academy/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/          # Componentes React
│   │   ├── common/          #   UI reutilizable (botones, tarjetas, navbar)
│   │   ├── editor/          #   Módulo Fix the Code
│   │   ├── exam/            #   Módulo de exámenes
│   │   ├── campaign/        #   Mapa de misiones
│   │   └── logic/           #   Ejercicios de lógica
│   ├── data/                # Bancos de preguntas y desafíos
│   ├── hooks/               # Custom hooks (progreso, sonidos, etc.)
│   ├── utils/               # Utilidades (aleatorización, evaluación, PDF)
│   ├── views/               # Vistas principales de la aplicación
│   ├── App.jsx              # Componente raíz
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Punto de entrada
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🏅 Sistema de Rangos

| Rango | XP Mínimo |
| :--- | :--- |
| 🌱 Web Explorer | 0 XP |
| 🧩 HTML Padawan | 200 XP |
| 🎨 CSS Apprentice | 500 XP |
| ⚡ JS Developer | 800 XP |
| 🚀 React Master | 1000 XP |

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un *issue* o *pull request* para sugerir cambios o mejoras.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT.