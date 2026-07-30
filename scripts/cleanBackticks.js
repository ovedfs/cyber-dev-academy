const fs = require('fs')
const path = require('path')

const files = [
  path.join(__dirname, '..', 'src', 'data', 'theoryBank.json'),
  path.join(__dirname, '..', 'src', 'data', 'webTechBank.json'),
]

function cleanBackticks(str) {
  if (typeof str !== 'string') return str
  // Remove backticks from the string
  return str.replace(/`/g, '')
}

function processFile(filePath) {
  console.log(`📄 Procesando: ${filePath}`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  
  let totalOptions = 0
  let cleanedOptions = 0

  for (const item of data) {
    if (item.options && Array.isArray(item.options)) {
      item.options = item.options.map((opt) => {
        totalOptions++
        if (typeof opt === 'string' && opt.includes('`')) {
          cleanedOptions++
          return cleanBackticks(opt)
        }
        return opt
      })
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`   ✅ Limpiadas ${cleanedOptions}/${totalOptions} opciones con backticks`)
}

for (const file of files) {
  processFile(file)
}

console.log('\n🎉 ¡Limpieza completada!')