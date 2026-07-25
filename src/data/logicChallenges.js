const logicChallenges = [
  {
    id: "logic-001",
    title: "Filtrar Pares",
    description: "Completa la función `filtrarPares` que recibe un array de números y devuelve un nuevo array solo con los números pares.",
    difficulty: "easy",
    topic: "arrays",
    xpReward: 50,
    starterCode: `function filtrarPares(numeros) {
  // Tu código aquí
  // Usa el método .filter() o un bucle for
}

// Prueba
console.log(filtrarPares([1, 2, 3, 4, 5, 6])); // Debería mostrar: [2, 4, 6]`,
    solution: `function filtrarPares(numeros) {
  return numeros.filter(n => n % 2 === 0);
}

// Prueba
console.log(filtrarPares([1, 2, 3, 4, 5, 6])); // [2, 4, 6]`,
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6] },
      { input: [[10, 15, 20, 25]], expected: [10, 20] },
      { input: [[1, 3, 5]], expected: [] }
    ]
  },
  {
    id: "logic-002",
    title: "Sumar Elementos",
    description: "Completa la función `sumarArray` que recibe un array de números y devuelve la suma de todos sus elementos.",
    difficulty: "easy",
    topic: "arrays",
    xpReward: 50,
    starterCode: `function sumarArray(numeros) {
  // Tu código aquí
  // Usa .reduce() o un bucle for
}

// Prueba
console.log(sumarArray([1, 2, 3, 4, 5])); // Debería mostrar: 15`,
    solution: `function sumarArray(numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}

// Prueba
console.log(sumarArray([1, 2, 3, 4, 5])); // 15`,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: 15 },
      { input: [[10, 20, 30]], expected: 60 },
      { input: [[1]], expected: 1 },
      { input: [[]], expected: 0 }
    ]
  },
  {
    id: "logic-003",
    title: "Buscar en Inventario",
    description: "Completa la función `buscarProducto` que recibe un array de productos (objetos con nombre y precio) y un nombre a buscar. Debe devolver el producto si existe o null si no.",
    difficulty: "easy",
    topic: "arrays",
    xpReward: 50,
    starterCode: `function buscarProducto(inventario, nombreBuscado) {
  // Tu código aquí
  // Usa .find() para buscar por nombre
}

const productos = [
  { nombre: "Laptop", precio: 1000 },
  { nombre: "Mouse", precio: 25 },
  { nombre: "Teclado", precio: 50 }
];

// Prueba
console.log(buscarProducto(productos, "Mouse")); // Debería mostrar: { nombre: "Mouse", precio: 25 }
console.log(buscarProducto(productos, "Monitor")); // Debería mostrar: null`,
    solution: `function buscarProducto(inventario, nombreBuscado) {
  return inventario.find(p => p.nombre === nombreBuscado) || null;
}

const productos = [
  { nombre: "Laptop", precio: 1000 },
  { nombre: "Mouse", precio: 25 },
  { nombre: "Teclado", precio: 50 }
];

// Prueba
console.log(buscarProducto(productos, "Mouse")); // { nombre: "Mouse", precio: 25 }
console.log(buscarProducto(productos, "Monitor")); // null`,
    testCases: [
      { input: [[{ nombre: "A", precio: 10 }, { nombre: "B", precio: 20 }], "A"], expected: { nombre: "A", precio: 10 } },
      { input: [[{ nombre: "X", precio: 5 }], "Z"], expected: null }
    ]
  },
  {
    id: "logic-004",
    title: "Saludo Personalizado",
    description: "Completa la función `crearSaludo` que recibe un nombre y devuelve un saludo personalizado usando template strings.",
    difficulty: "medium",
    topic: "functions",
    xpReward: 50,
    starterCode: `function crearSaludo(nombre, edad) {
  // Tu código aquí
  // Devuelve: "Hola, me llamo [nombre] y tengo [edad] años."
}

// Prueba
console.log(crearSaludo("Ana", 15)); // Debería mostrar: "Hola, me llamo Ana y tengo 15 años."`,
    solution: `function crearSaludo(nombre, edad) {
  return \`Hola, me llamo \${nombre} y tengo \${edad} años.\`;
}

// Prueba
console.log(crearSaludo("Ana", 15)); // "Hola, me llamo Ana y tengo 15 años."`,
    testCases: [
      { input: ["Ana", 15], expected: "Hola, me llamo Ana y tengo 15 años." },
      { input: ["Carlos", 12], expected: "Hola, me llamo Carlos y tengo 12 años." },
      { input: ["María", 14], expected: "Hola, me llamo María y tengo 14 años." }
    ]
  },
  {
    id: "logic-005",
    title: "Contador de Vocales",
    description: "Completa la función `contarVocales` que recibe un string y devuelve la cantidad de vocales (a, e, i, o, u) que contiene.",
    difficulty: "medium",
    topic: "strings",
    xpReward: 50,
    starterCode: `function contarVocales(texto) {
  // Tu código aquí
  // Convierte a minúsculas y cuenta las vocales
}

// Prueba
console.log(contarVocales("Hola Mundo")); // Debería mostrar: 4`,
    solution: `function contarVocales(texto) {
  const vocales = "aeiou";
  return texto.toLowerCase().split('').filter(c => vocales.includes(c)).length;
}

// Prueba
console.log(contarVocales("Hola Mundo")); // 4`,
    testCases: [
      { input: ["Hola Mundo"], expected: 4 },
      { input: ["JavaScript"], expected: 3 },
      { input: ["xyz"], expected: 0 },
      { input: ["AEIOU"], expected: 5 }
    ]
  },
  {
    id: "logic-006",
    title: "Clase Player",
    description: "Completa la clase `Player` que tiene nombre, nivel y vida. Debe tener un método `atacar` que reduzca la vida del enemigo y un método `subirNivel` que aumente el nivel en 1.",
    difficulty: "medium",
    topic: "oop",
    xpReward: 50,
    starterCode: `class Player {
  constructor(nombre) {
    this.nombre = nombre;
    this.nivel = 1;
    this.vida = 100;
  }
  
  atacar(enemigo) {
    // Tu código aquí
    // Reduce la vida del enemigo en 10
  }
  
  subirNivel() {
    // Tu código aquí
    // Aumenta el nivel en 1
  }
}

// Prueba
const jugador = new Player("Heroe");
const enemigo = new Player("Goblin");
jugador.atacar(enemigo);
console.log(enemigo.vida); // Debería mostrar: 90
jugador.subirNivel();
console.log(jugador.nivel); // Debería mostrar: 2`,
    solution: `class Player {
  constructor(nombre) {
    this.nombre = nombre;
    this.nivel = 1;
    this.vida = 100;
  }
  
  atacar(enemigo) {
    enemigo.vida -= 10;
  }
  
  subirNivel() {
    this.nivel++;
  }
}

// Prueba
const jugador = new Player("Heroe");
const enemigo = new Player("Goblin");
jugador.atacar(enemigo);
console.log(enemigo.vida); // 90
jugador.subirNivel();
console.log(jugador.nivel); // 2`,
    testCases: [
      { input: ["Heroe", "Goblin"], expected: { vidaEnemigo: 90, nivelJugador: 2 } }
    ]
  },
  {
    id: "logic-007",
    title: "Clase Enemy",
    description: "Completa la clase `Enemy` que extiende de `Player`. El enemigo debe tener un tipo (\"goblin\", \"orc\", \"dragon\") y un método `rugir` que devuelva un mensaje según su tipo.",
    difficulty: "medium",
    topic: "oop",
    xpReward: 50,
    starterCode: `class Player {
  constructor(nombre) {
    this.nombre = nombre;
    this.vida = 100;
  }
}

class Enemy extends Player {
  constructor(nombre, tipo) {
    // Tu código aquí
    // Llama al constructor de Player con super()
    // Asigna this.tipo
  }
  
  rugir() {
    // Tu código aquí
    // Si es "dragon" devuelve "RAAAWR!"
    // Si es "orc" devuelve "GRRR!"
    // Si es "goblin" devuelve "¡Grr!"
  }
}

// Prueba
const dragon = new Enemy("Smaug", "dragon");
console.log(dragon.rugir()); // Debería mostrar: "RAAAWR!"
console.log(dragon.nombre); // Debería mostrar: "Smaug"`,
    solution: `class Player {
  constructor(nombre) {
    this.nombre = nombre;
    this.vida = 100;
  }
}

class Enemy extends Player {
  constructor(nombre, tipo) {
    super(nombre);
    this.tipo = tipo;
  }
  
  rugir() {
    if (this.tipo === "dragon") return "RAAAWR!";
    if (this.tipo === "orc") return "GRRR!";
    return "¡Grr!";
  }
}

// Prueba
const dragon = new Enemy("Smaug", "dragon");
console.log(dragon.rugir()); // "RAAAWR!"
console.log(dragon.nombre); // "Smaug"`,
    testCases: [
      { input: ["Smaug", "dragon"], expected: { rugido: "RAAAWR!", nombre: "Smaug" } },
      { input: ["Uruk", "orc"], expected: { rugido: "GRRR!", nombre: "Uruk" } },
      { input: ["Gobby", "goblin"], expected: { rugido: "¡Grr!", nombre: "Gobby" } }
    ]
  },
  {
    id: "logic-008",
    title: "Contador React",
    description: "Completa el componente React `Contador` que tiene un botón para incrementar y otro para decrementar el contador. El contador no debe bajar de 0.",
    difficulty: "hard",
    topic: "react",
    xpReward: 50,
    starterCode: `function Contador() {
  // Tu código aquí
  // Usa useState para el contador (inicia en 0)
  
  // Función incrementar: aumenta en 1
  
  // Función decrementar: disminuye en 1, pero no baja de 0
  
  return (
    <div>
      <h2>Contador: {contador}</h2>
      <button onClick={incrementar}>+</button>
      <button onClick={decrementar}>-</button>
    </div>
  );
}`,
    solution: `function Contador() {
  const [contador, setContador] = React.useState(0);
  
  function incrementar() {
    setContador(contador + 1);
  }
  
  function decrementar() {
    if (contador > 0) {
      setContador(contador - 1);
    }
  }
  
  return (
    <div>
      <h2>Contador: {contador}</h2>
      <button onClick={incrementar}>+</button>
      <button onClick={decrementar}>-</button>
    </div>
  );
}`,
    testCases: [
      { input: ["incrementar"], expected: 1 },
      { input: ["decrementar"], expected: 0 }
    ]
  },
  {
    id: "logic-009",
    title: "Props Correctas",
    description: "Completa el componente `TarjetaUsuario` que recibe props (nombre, edad, rol) y los muestra. Si no se pasa rol, debe mostrar 'Usuario' por defecto.",
    difficulty: "hard",
    topic: "react",
    xpReward: 50,
    starterCode: `function TarjetaUsuario(props) {
  // Tu código aquí
  // Desestructura nombre, edad, rol de props
  // Si rol no existe, usa "Usuario" como valor por defecto
  
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      <p>Edad: {edad}</p>
      <p>Rol: {rol}</p>
    </div>
  );
}

// Prueba
// <TarjetaUsuario nombre="Ana" edad={15} />
// Debería mostrar: Ana, 15, Usuario

// <TarjetaUsuario nombre="Carlos" edad={14} rol="Admin" />
// Debería mostrar: Carlos, 14, Admin`,
    solution: `function TarjetaUsuario({ nombre, edad, rol = "Usuario" }) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      <p>Edad: {edad}</p>
      <p>Rol: {rol}</p>
    </div>
  );
}

// Prueba
// <TarjetaUsuario nombre="Ana" edad={15} />
// Muestra: Ana, 15, Usuario

// <TarjetaUsuario nombre="Carlos" edad={14} rol="Admin" />
// Muestra: Carlos, 14, Admin`,
    testCases: [
      { input: [{ nombre: "Ana", edad: 15 }], expected: { nombre: "Ana", edad: 15, rol: "Usuario" } },
      { input: [{ nombre: "Carlos", edad: 14, rol: "Admin" }], expected: { nombre: "Carlos", edad: 14, rol: "Admin" } }
    ]
  },
  {
    id: "logic-010",
    title: "Ordenar Números",
    description: "Completa la función `ordenarNumeros` que recibe un array de números y lo devuelve ordenado de menor a mayor. No uses el método .sort() directamente.",
    difficulty: "hard",
    topic: "arrays",
    xpReward: 50,
    starterCode: `function ordenarNumeros(numeros) {
  // Tu código aquí
  // Implementa el algoritmo de ordenamiento de burbuja (bubble sort)
  // o cualquier otro algoritmo de ordenamiento
}

// Prueba
console.log(ordenarNumeros([3, 1, 4, 1, 5, 9, 2, 6])); // Debería mostrar: [1, 1, 2, 3, 4, 5, 6, 9]`,
    solution: `function ordenarNumeros(numeros) {
  const arr = [...numeros]; // Copia para no mutar el original
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Prueba
console.log(ordenarNumeros([3, 1, 4, 1, 5, 9, 2, 6])); // [1, 1, 2, 3, 4, 5, 6, 9]`,
    testCases: [
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9] },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
      { input: [[1, 2, 3]], expected: [1, 2, 3] },
      { input: [[]], expected: [] }
    ]
  }
];

export default logicChallenges;