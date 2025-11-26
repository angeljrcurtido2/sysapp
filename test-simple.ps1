Write-Host "Probando sistema de reconocimiento de voz..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Ollama
Write-Host "1. Verificando Ollama..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing
    Write-Host "   OK - Ollama corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ERROR - Ollama no disponible" -ForegroundColor Red
}

Write-Host ""

# Test 2: Backend
Write-Host "2. Verificando servidor backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/voice/health" -UseBasicParsing
    Write-Host "   OK - Backend respondiendo" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   ERROR - Backend no responde" -ForegroundColor Red
    Write-Host "   Inicia el servidor: cd ..\server; npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Prueba completada!" -ForegroundColor Green
