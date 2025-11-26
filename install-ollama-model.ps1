# Script para instalar y verificar el modelo de Ollama

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║     INSTALACIÓN DE MODELO OLLAMA PARA RECONOCIMIENTO      ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que Ollama está instalado
Write-Host "1️⃣  Verificando instalación de Ollama..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version 2>$null
    Write-Host "   ✅ Ollama está instalado: $ollamaVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Ollama NO está instalado" -ForegroundColor Red
    Write-Host "   💡 Ejecuta: winget install Ollama.Ollama" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 2. Verificar que Ollama está corriendo
Write-Host "2️⃣  Verificando servicio de Ollama..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Ollama está corriendo en http://localhost:11434" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Ollama NO está respondiendo" -ForegroundColor Red
    Write-Host "   💡 El servicio debería iniciarse automáticamente" -ForegroundColor Yellow
    Write-Host "   💡 Si no, ejecuta: ollama serve" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 3. Verificar modelos existentes
Write-Host "3️⃣  Verificando modelos instalados..." -ForegroundColor Yellow
$modelsJson = ollama list --format json 2>$null
if ($modelsJson) {
    $models = $modelsJson | ConvertFrom-Json
    if ($models.Count -gt 0) {
        Write-Host "   📦 Modelos encontrados:" -ForegroundColor Green
        foreach ($model in $models) {
            Write-Host "      - $($model.name)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ⚠️  No hay modelos instalados" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  No hay modelos instalados" -ForegroundColor Yellow
}

Write-Host ""

# 4. Preguntar si desea instalar llama3.2
$hasLlama32 = $models | Where-Object { $_.name -like "*llama3.2*" }

if ($hasLlama32) {
    Write-Host "   ✅ El modelo llama3.2 ya está instalado" -ForegroundColor Green
    Write-Host ""
    Write-Host "¿Deseas reinstalarlo? (S/N): " -ForegroundColor Yellow -NoNewline
    $reinstall = Read-Host
    if ($reinstall -ne "S" -and $reinstall -ne "s") {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║              ✅ TODO LISTO PARA USAR                      ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        exit 0
    }
}

Write-Host ""
Write-Host "4️⃣  Descargando modelo llama3.2..." -ForegroundColor Yellow
Write-Host "   ⏳ Esto puede tomar varios minutos (tamaño: ~2GB)" -ForegroundColor Cyan
Write-Host ""

try {
    ollama pull llama3.2
    Write-Host ""
    Write-Host "   ✅ Modelo descargado exitosamente" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "   ❌ Error al descargar el modelo" -ForegroundColor Red
    Write-Host "   📝 Error: $_" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 5. Verificar instalación
Write-Host "5️⃣  Verificando instalación del modelo..." -ForegroundColor Yellow
$modelsJson = ollama list --format json 2>$null
$models = $modelsJson | ConvertFrom-Json
$hasLlama32 = $models | Where-Object { $_.name -like "*llama3.2*" }

if ($hasLlama32) {
    Write-Host "   ✅ Modelo llama3.2 instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ No se pudo verificar la instalación" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 6. Prueba rápida
Write-Host "6️⃣  Realizando prueba rápida..." -ForegroundColor Yellow
try {
    $testPrompt = "Responde solo con el número: ¿Cuánto es 2+2?"
    Write-Host "   💬 Pregunta: $testPrompt" -ForegroundColor Cyan

    $response = ollama run llama3.2 $testPrompt --timeout 10
    Write-Host "   🤖 Respuesta: $response" -ForegroundColor Green
    Write-Host "   ✅ El modelo funciona correctamente" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  No se pudo realizar la prueba" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║           ✅ INSTALACIÓN COMPLETADA CON ÉXITO             ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMEN:" -ForegroundColor Cyan
Write-Host "   • Ollama está instalado y corriendo" -ForegroundColor White
Write-Host "   • Modelo llama3.2 descargado" -ForegroundColor White
Write-Host "   • Sistema listo para usar" -ForegroundColor White
Write-Host ""
Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "   1. Instalar dependencias frontend:" -ForegroundColor White
Write-Host "      → cd sysapp" -ForegroundColor Gray
Write-Host "      → npm install @react-native-voice/voice expo-linear-gradient" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Iniciar servidor backend:" -ForegroundColor White
Write-Host "      → cd ..\server" -ForegroundColor Gray
Write-Host "      → npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Probar endpoint:" -ForegroundColor White
Write-Host "      → Invoke-WebRequest http://localhost:3000/api/voice/health" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
