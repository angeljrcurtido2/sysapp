# Script para eliminar el archivo 'nul'
$path = "\\?\$PWD\nul"
if (Test-Path $path) {
    Remove-Item -Path $path -Force
    Write-Host "✅ Archivo 'nul' eliminado exitosamente"
} else {
    Write-Host "⚠️ Archivo 'nul' no encontrado"
}
