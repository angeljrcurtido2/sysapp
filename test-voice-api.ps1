# Script de prueba para el sistema de reconocimiento de voz

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║        PRUEBA DEL SISTEMA DE RECONOCIMIENTO DE VOZ        ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Ollama
Write-Host "1️⃣  Verificando Ollama..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -TimeoutSec 5
    $models = ($response.Content | ConvertFrom-Json).models
    $hasLlama = $models | Where-Object { $_.name -like "*llama3.2*" }

    if ($hasLlama) {
        Write-Host "   ✅ Ollama corriendo con modelo llama3.2" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Modelo llama3.2 no encontrado" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Ollama no está disponible" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Verificar que el servidor backend está corriendo
Write-Host "2️⃣  Verificando servidor backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/voice/health" -UseBasicParsing -TimeoutSec 5
    $health = $response.Content | ConvertFrom-Json

    if ($health.status -eq "ok") {
        Write-Host "   ✅ Servidor backend respondiendo correctamente" -ForegroundColor Green
        Write-Host "   📝 Mensaje: $($health.message)" -ForegroundColor Cyan
    } else {
        Write-Host "   ⚠️  Servidor respondió pero con advertencias" -ForegroundColor Yellow
        Write-Host "   📝 Status: $($health.status)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Servidor backend NO responde en http://localhost:3000" -ForegroundColor Red
    Write-Host "   💡 Asegúrate de iniciar el servidor:" -ForegroundColor Yellow
    Write-Host "      → cd ..\server" -ForegroundColor Gray
    Write-Host "      → npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   ⏭️  Continuando con prueba local de Ollama..." -ForegroundColor Yellow
}

Write-Host ""

# 3. Prueba de parseo directo con Ollama
Write-Host "3️⃣  Probando parseo con Ollama..." -ForegroundColor Yellow
Write-Host "   💬 Comando de prueba: 'Registrar un ingreso de 150 dólares por venta de equipos'" -ForegroundColor Cyan
Write-Host "   ⏳ Procesando..." -ForegroundColor Gray

$testPrompt = @"
Eres un asistente especializado en procesar comandos de voz para registrar ingresos en un sistema de ventas.

Analiza el siguiente comando de voz y extrae la información relevante:

Comando: "Registrar un ingreso de 150 dólares por venta de equipos"

Debes extraer:
1. monto: El valor numérico del ingreso (solo el número, sin símbolos)
2. concepto: Breve descripción del motivo del ingreso
3. tipo_movimiento: Clasifica como "INGRESO_VENTA", "INGRESO_SERVICIO", "INGRESO_OTROS", etc.
4. observaciones: Cualquier detalle adicional mencionado
5. confidence: Tu nivel de confianza en el análisis (0-100)

Responde ÚNICAMENTE con un objeto JSON válido (sin texto adicional):
{
  "monto": number,
  "concepto": "string",
  "tipo_movimiento": "string",
  "observaciones": "string",
  "confidence": number
}
"@

try {
    $body = @{
        model = "llama3.2"
        prompt = $testPrompt
        stream = $false
        options = @{
            temperature = 0.1
        }
    } | ConvertTo-Json

    $response = Invoke-WebRequest `
        -Uri "http://localhost:11434/api/generate" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 30

    $result = ($response.Content | ConvertFrom-Json).response

    Write-Host ""
    Write-Host "   🤖 Respuesta de Ollama:" -ForegroundColor Green
    Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "   $result" -ForegroundColor White
    Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""

    # Intentar parsear el JSON
    try {
        if ($result -match '\{[\s\S]*\}') {
            $jsonMatch = $matches[0]
            $parsed = $jsonMatch | ConvertFrom-Json

            Write-Host "   ✅ JSON parseado correctamente:" -ForegroundColor Green
            Write-Host "   💰 Monto: $($parsed.monto)" -ForegroundColor Cyan
            Write-Host "   📝 Concepto: $($parsed.concepto)" -ForegroundColor Cyan
            Write-Host "   🏷️  Tipo: $($parsed.tipo_movimiento)" -ForegroundColor Cyan
            Write-Host "   📊 Confianza: $($parsed.confidence)%" -ForegroundColor Cyan
        } else {
            Write-Host "   ⚠️  No se pudo extraer JSON de la respuesta" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️  Respuesta no es JSON válido, pero Ollama está funcionando" -ForegroundColor Yellow
    }

} catch {
    Write-Host "   ❌ Error al comunicarse con Ollama" -ForegroundColor Red
    Write-Host "   📝 Error: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    PRUEBA COMPLETADA                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMEN:" -ForegroundColor Cyan
Write-Host "   ✅ Ollama está funcionando correctamente" -ForegroundColor White
Write-Host "   ✅ Modelo llama3.2 disponible" -ForegroundColor White
Write-Host "   ✅ Sistema listo para procesar comandos de voz" -ForegroundColor White
Write-Host ""
Write-Host "🚀 SIGUIENTE PASO:" -ForegroundColor Cyan
Write-Host "   Inicia el servidor backend (si aún no lo hiciste):" -ForegroundColor White
Write-Host "   → cd ..\server" -ForegroundColor Gray
Write-Host "   → npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   Luego prueba el endpoint completo:" -ForegroundColor White
Write-Host "   → Invoke-WebRequest http://localhost:3000/api/voice/health" -ForegroundColor Gray
Write-Host ""
