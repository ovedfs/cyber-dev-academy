const bugChallenges = [
  {
    id: "bug-001",
    title: "Etiqueta Perdida",
    description: "El documento HTML no tiene la declaración de tipo de documento ni la estructura básica correcta. Arregla el HTML para que sea un documento válido.",
    difficulty: "easy",
    topic: "html",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mi Página</title>
</head>
<body>
  <main>
    <h1>Bienvenido</h1>
    <p>Este es un párrafo de ejemplo.</p>
  </main>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #333;
}

p {
  color: #666;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Página</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main>
    <h1>Bienvenido</h1>
    <p>Este es un párrafo de ejemplo.</p>
  </main>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #333;
}

p {
  color: #666;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    validation: {
      tests: [
        { description: "El HTML debe tener <!DOCTYPE html>", test: "html.includes('<!DOCTYPE html>')" },
        { description: "El HTML debe tener <html lang=\"es\">", test: "html.includes('<html lang=\"es\">')" },
        { description: "El HTML debe tener <meta charset=\"UTF-8\">", test: "html.includes('<meta charset=\"UTF-8\">')" },
        { description: "El HTML debe tener <meta name=\"viewport\">", test: "html.includes('<meta name=\"viewport\"')" }
      ]
    },
    hints: [
      "Todo documento HTML5 debe comenzar con <!DOCTYPE html>",
      "La etiqueta <html> debe tener el atributo lang",
      "No olvides el meta viewport para diseño responsive"
    ]
  },
  {
    id: "bug-002",
    title: "Formulario Roto",
    description: "El formulario tiene varios errores: los labels no están asociados correctamente, falta el botón de envío y el método del formulario es incorrecto.",
    difficulty: "easy",
    topic: "html",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario de Contacto</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <form action="/enviar" method="GET">
    <label>Nombre</label>
    <input type="text" id="nombre" name="nombre">
    
    <label>Email</label>
    <input type="email" id="email" name="email">
    
    <label>Mensaje</label>
    <textarea id="mensaje" name="mensaje"></textarea>
    
    <input type="submit" value="Enviar">
  </form>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
}

input, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="submit"] {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario de Contacto</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <form action="/enviar" method="POST">
    <label for="nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre">
    
    <label for="email">Email</label>
    <input type="email" id="email" name="email">
    
    <label for="mensaje">Mensaje</label>
    <textarea id="mensaje" name="mensaje"></textarea>
    
    <button type="submit">Enviar</button>
  </form>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
}

input, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    validation: {
      tests: [
        { description: "Los labels deben tener atributo for", test: "html.includes('for=\"nombre\"') && html.includes('for=\"email\"') && html.includes('for=\"mensaje\"')" },
        { description: "El formulario debe usar method POST", test: "html.includes('method=\"POST\"')" },
        { description: "Debe usar <button> en lugar de input submit", test: "html.includes('<button type=\"submit\"')" }
      ]
    },
    hints: [
      "Los labels deben usar el atributo for para asociarse con su input",
      "Para enviar datos sensibles usa method POST",
      "Usa <button type=\"submit\"> en lugar de <input type=\"submit\">"
    ]
  },
  {
    id: "bug-003",
    title: "Colores Equivocados",
    description: "Los colores de la página no se ven correctamente. El fondo debería ser azul oscuro, el texto blanco y los botones deben tener un color de fondo naranja.",
    difficulty: "easy",
    topic: "css",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Colores</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Mi Página de Colores</h1>
    <p>Este es un texto de ejemplo.</p>
    <button class="btn">Click aquí</button>
  </div>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  background-color: lightblue;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: black;
}

p {
  color: gray;
  font-size: 18px;
}

.btn {
  background-color: yellow;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Colores</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Mi Página de Colores</h1>
    <p>Este es un texto de ejemplo.</p>
    <button class="btn">Click aquí</button>
  </div>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  background-color: #1a1a2e;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #ffffff;
}

p {
  color: #cccccc;
  font-size: 18px;
}

.btn {
  background-color: #ff6600;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    validation: {
      tests: [
        { description: "El fondo debe ser azul oscuro (#1a1a2e)", test: "css.includes('#1a1a2e')" },
        { description: "El h1 debe ser blanco (#ffffff)", test: "css.includes('color: #ffffff') || css.includes('color:white')" },
        { description: "El botón debe tener fondo naranja (#ff6600)", test: "css.includes('#ff6600')" }
      ]
    },
    hints: [
      "Usa códigos HEX para colores precisos",
      "El fondo del body debe ser #1a1a2e",
      "El botón debe tener background-color: #ff6600"
    ]
  },
  {
    id: "bug-004",
    title: "Flexbox Fallido",
    description: "El layout flexbox no funciona correctamente. Los elementos deberían estar centrados horizontalmente, en una fila, con espacio entre ellos y wrapping cuando no quepan.",
    difficulty: "medium",
    topic: "css",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Flexbox</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="flex-container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
  </div>
</body>
</html>`,
      css: `.flex-container {
  display: inline-flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex-wrap: nowrap;
  gap: 5px;
  padding: 20px;
  background-color: #f0f0f0;
}

.item {
  background-color: #007bff;
  color: white;
  padding: 20px;
  font-size: 24px;
  border-radius: 5px;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Flexbox</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="flex-container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
  </div>
</body>
</html>`,
      css: `.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #f0f0f0;
}

.item {
  background-color: #007bff;
  color: white;
  padding: 20px;
  font-size: 24px;
  border-radius: 5px;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    validation: {
      tests: [
        { description: "El contenedor debe tener display: flex", test: "css.includes('display: flex')" },
        { description: "La dirección debe ser row", test: "css.includes('flex-direction: row')" },
        { description: "Debe tener justify-content: center", test: "css.includes('justify-content: center')" },
        { description: "Debe tener flex-wrap: wrap", test: "css.includes('flex-wrap: wrap')" }
      ]
    },
    hints: [
      "Cambia display: inline-flex a display: flex",
      "La dirección debe ser row, no column",
      "Usa justify-content: center y flex-wrap: wrap"
    ]
  },
  {
    id: "bug-005",
    title: "Grid Desalineado",
    description: "El grid CSS no está configurado correctamente. Debe tener 3 columnas iguales con un gap de 15px y los elementos deben estar centrados.",
    difficulty: "medium",
    topic: "css",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>CSS Grid</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="grid-container">
    <div class="grid-item">A</div>
    <div class="grid-item">B</div>
    <div class="grid-item">C</div>
    <div class="grid-item">D</div>
    <div class="grid-item">E</div>
    <div class="grid-item">F</div>
  </div>
</body>
</html>`,
      css: `.grid-container {
  display: inline-grid;
  grid-template-columns: 100px 200px 300px;
  grid-template-rows: auto;
  gap: 5px;
  padding: 20px;
  background-color: #f0f0f0;
}

.grid-item {
  background-color: #9d00ff;
  color: white;
  padding: 20px;
  font-size: 24px;
  text-align: center;
  border-radius: 5px;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>CSS Grid</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="grid-container">
    <div class="grid-item">A</div>
    <div class="grid-item">B</div>
    <div class="grid-item">C</div>
    <div class="grid-item">D</div>
    <div class="grid-item">E</div>
    <div class="grid-item">F</div>
  </div>
</body>
</html>`,
      css: `.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: 15px;
  padding: 20px;
  background-color: #f0f0f0;
}

.grid-item {
  background-color: #9d00ff;
  color: white;
  padding: 20px;
  font-size: 24px;
  text-align: center;
  border-radius: 5px;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    validation: {
      tests: [
        { description: "El contenedor debe tener display: grid", test: "css.includes('display: grid')" },
        { description: "Debe tener 3 columnas iguales con fr", test: "css.includes('1fr 1fr 1fr') || css.includes('repeat(3, 1fr)')" },
        { description: "El gap debe ser 15px", test: "css.includes('gap: 15px')" }
      ]
    },
    hints: [
      "Cambia display: inline-grid a display: grid",
      "Usa 1fr para columnas iguales: grid-template-columns: 1fr 1fr 1fr",
      "Aumenta el gap a 15px"
    ]
  },
  {
    id: "bug-006",
    title: "Selector Fantasma",
    description: "Los enlaces no cambian de color cuando pasas el mouse sobre ellos. Deberían volverse verdes y tener un subrayado. Además, el primer elemento de la lista debe tener un color especial.",
    difficulty: "medium",
    topic: "css",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Selectores</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav>
    <ul>
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Servicios</a></li>
      <li><a href="#">Contacto</a></li>
    </ul>
  </nav>
</body>
</html>`,
      css: `nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  padding: 5px 10px;
}

/* FALTA: hover state */
/* FALTA: first-child style */`,
      js: `// No se necesita JavaScript para este desafío`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Selectores</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav>
    <ul>
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Servicios</a></li>
      <li><a href="#">Contacto</a></li>
    </ul>
  </nav>
</body>
</html>`,
      css: `nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  padding: 5px 10px;
}

nav ul li a:hover {
  color: #00ff66;
  text-decoration: underline;
}

nav ul li:first-child a {
  color: #9d00ff;
  font-weight: bold;
}`,
      js: `// No se necesita JavaScript para este desafío`
    },
    validation: {
      tests: [
        { description: "Debe existir la pseudoclase :hover para los enlaces", test: "css.includes('a:hover')" },
        { description: "El hover debe cambiar color a verde", test: "css.includes('color: #00ff66') || css.includes('color: #00ff66')" },
        { description: "Debe existir :first-child para el primer li", test: "css.includes(':first-child')" }
      ]
    },
    hints: [
      "Usa la pseudoclase :hover para cambiar el estilo al pasar el mouse",
      "El primer hijo se selecciona con :first-child",
      "Combina selectores: nav ul li:first-child a"
    ]
  },
  {
    id: "bug-007",
    title: "DOM Desaparecido",
    description: "El JavaScript debería crear un nuevo elemento <p> con el texto 'Hola Mundo' y agregarlo al div con id 'contenido', pero no funciona.",
    difficulty: "medium",
    topic: "dom",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>DOM</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="contenido">
    <h1>Mi Página</h1>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
}`,
      js: `// Obtener el contenedor
const contenedor = document.getElementById('contenido');

// Crear un nuevo párrafo
const parrafo = document.createElement('p');

// Asignar el texto
parrafo.textContent = 'Hola Mundo';

// Agregar al contenedor
contenedor.appendChild(parrafo);`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>DOM</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="contenido">
    <h1>Mi Página</h1>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
}`,
      js: `// Obtener el contenedor
const contenedor = document.getElementById('contenido');

// Crear un nuevo párrafo
const parrafo = document.createElement('p');

// Asignar el texto
parrafo.textContent = 'Hola Mundo';

// Agregar al contenedor
contenedor.appendChild(parrafo);`
    },
    validation: {
      tests: [
        { description: "El script debe usar document.getElementById", test: "js.includes('document.getElementById')" },
        { description: "El script debe usar document.createElement", test: "js.includes('document.createElement')" },
        { description: "El script debe usar appendChild", test: "js.includes('appendChild')" }
      ]
    },
    hints: [
      "Usa document.getElementById('contenido') para obtener el contenedor",
      "Crea el elemento con document.createElement('p')",
      "Agrega el elemento al DOM con contenedor.appendChild(parrafo)"
    ]
  },
  {
    id: "bug-008",
    title: "Evento Sin Reacción",
    description: "El botón debería mostrar una alerta con el texto del input cuando se hace clic, pero no funciona. Arregla el event listener.",
    difficulty: "medium",
    topic: "dom",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Eventos</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Entrada de Texto</h1>
    <input type="text" id="nombreInput" placeholder="Escribe tu nombre">
    <button id="saludarBtn">Saludar</button>
    <p id="resultado"></p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

input, button {
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}`,
      js: `const input = document.getElementById('nombreInput');
const boton = document.getElementById('saludarBtn');
const resultado = document.getElementById('resultado');

// FALTA: Agregar event listener al botón
// Debe mostrar: "Hola, [nombre]!" en el párrafo resultado`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Eventos</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Entrada de Texto</h1>
    <input type="text" id="nombreInput" placeholder="Escribe tu nombre">
    <button id="saludarBtn">Saludar</button>
    <p id="resultado"></p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

input, button {
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}`,
      js: `const input = document.getElementById('nombreInput');
const boton = document.getElementById('saludarBtn');
const resultado = document.getElementById('resultado');

boton.addEventListener('click', function() {
  const nombre = input.value;
  resultado.textContent = 'Hola, ' + nombre + '!';
});`
    },
    validation: {
      tests: [
        { description: "Debe usar addEventListener en el botón", test: "js.includes('addEventListener')" },
        { description: "Debe leer el valor del input", test: "js.includes('input.value') || js.includes('nombreInput.value')" },
        { description: "Debe mostrar el resultado en el párrafo", test: "js.includes('resultado.textContent') || js.includes('resultado.innerHTML')" }
      ]
    },
    hints: [
      "Usa boton.addEventListener('click', function() { ... })",
      "Dentro de la función, obtén el valor del input con input.value",
      "Asigna el texto al párrafo con resultado.textContent"
    ]
  },
  {
    id: "bug-009",
    title: "Array Fuera de Control",
    description: "La función debe filtrar los números pares de un array y devolver un nuevo array solo con los pares. Pero la función actual tiene errores.",
    difficulty: "hard",
    topic: "dom",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Arrays</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Filtrar Pares</h1>
    <p>Array original: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</p>
    <p>Resultado: <span id="resultado"></span></p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}`,
      js: `const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Función con errores
function filtrarPares(arr) {
  let resultado = [];
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] % 2 = 0) {
      resultado.push(arr[i]);
    }
  }
  return resultado;
}

const resultado = document.getElementById('resultado');
const pares = filtrarPares(numeros);
resultado.textContent = pares.join(', ');`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Arrays</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Filtrar Pares</h1>
    <p>Array original: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</p>
    <p>Resultado: <span id="resultado"></span></p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}`,
      js: `const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Función corregida
function filtrarPares(arr) {
  let resultado = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      resultado.push(arr[i]);
    }
  }
  return resultado;
}

const resultado = document.getElementById('resultado');
const pares = filtrarPares(numeros);
resultado.textContent = pares.join(', ');`
    },
    validation: {
      tests: [
        { description: "La condición del for debe ser i < arr.length (no <=)", test: "js.includes('i < arr.length')" },
        { description: "La comparación debe ser === (no =)", test: "js.includes('% 2 === 0')" },
        { description: "El resultado debe mostrar los pares: 2,4,6,8,10", test: "js.includes('2, 4, 6, 8, 10') || js.includes('2,4,6,8,10')" }
      ]
    },
    hints: [
      "El bucle for debe usar i < arr.length, no i <= arr.length",
      "La comparación debe ser === no = (un solo = es asignación)",
      "Los números pares son divisibles por 2: n % 2 === 0"
    ]
  },
  {
    id: "bug-010",
    title: "React Sin Estado",
    description: "El componente React tiene un contador que debería incrementarse al hacer clic en el botón, pero no funciona porque el estado no se actualiza correctamente.",
    difficulty: "hard",
    topic: "react",
    xpReward: 100,
    files: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>React Contador</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    function Contador() {
      const [contador, setContador] = React.useState(0);
      
      function incrementar() {
        contador = contador + 1;
      }
      
      return (
        <div>
          <h1>Contador: {contador}</h1>
          <button onClick={incrementar}>Incrementar</button>
        </div>
      );
    }
    
    ReactDOM.createRoot(document.getElementById('root')).render(<Contador />);
  </script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}`,
      js: `// El código está en el HTML como type="text/babel"`
    },
    solution: {
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>React Contador</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    function Contador() {
      const [contador, setContador] = React.useState(0);
      
      function incrementar() {
        setContador(contador + 1);
      }
      
      return (
        <div>
          <h1>Contador: {contador}</h1>
          <button onClick={incrementar}>Incrementar</button>
        </div>
      );
    }
    
    ReactDOM.createRoot(document.getElementById('root')).render(<Contador />);
  </script>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}`,
      js: `// El código está en el HTML como type="text/babel"`
    },
    validation: {
      tests: [
        { description: "Debe usar setContador para actualizar el estado", test: "html.includes('setContador(contador + 1)')" },
        { description: "No debe asignar directamente a contador", test: "!html.includes('contador = contador')" }
      ]
    },
    hints: [
      "En React, no puedes asignar directamente al estado: contador = contador + 1 es incorrecto",
      "Debes usar la función setContador que devuelve useState",
      "La forma correcta es: setContador(contador + 1)"
    ]
  }
];

export default bugChallenges;