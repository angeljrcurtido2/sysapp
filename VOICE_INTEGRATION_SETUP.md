# 🎤 Configuración del Módulo de Reconocimiento de Voz con Ollama

## 📋 Resumen
Se ha creado un sistema completo de reconocimiento de voz que permite registrar ingresos mediante comandos de voz, utilizando Ollama para procesamiento inteligente con IA.

---

## 🚀 Instalación de Dependencias

### Frontend (React Native/Expo)
```bash
cd c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp
npm install @react-native-voice/voice expo-linear-gradient
```

### Backend (Node.js)
```bash
cd c:\SIS_VENTAS_NEXT\migracion_app_cliente\server
npm install axios
```

---

## ⚙️ Configuración del Backend

### 1. Agregar la ruta de voz en `server/server.js`

**Añadir el import (después de línea 33):**
```javascript
import voiceRoutes from './routes/Voice/voiceRoutes.js';
```

**Registrar la ruta (después de línea 102, donde están los otros `app.use`):**
```javascript
app.use('/api/voice', voiceRoutes);
```

### 2. Configurar variables de entorno en `server/.env`

Agregar estas líneas al archivo `.env`:
```env
# Configuración de Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Modelos recomendados:
- `llama3.2` (ligero, rápido)
- `mistral` (balanceado)
- `deepseek-r1` (más preciso, pero más pesado)

---

## 🤖 Instalación y Configuración de Ollama

### Windows:

1. **Descargar Ollama:**
   ```bash
   # Visita: https://ollama.com/download
   # O descarga directamente desde PowerShell:
   winget install Ollama.Ollama
   ```

2. **Iniciar Ollama:**
   ```bash
   ollama serve
   ```

3. **Descargar modelo (en otra terminal):**
   ```bash
   ollama pull llama3.2
   ```

4. **Verificar que funciona:**
   ```bash
   ollama list
   ollama run llama3.2 "Hola, cómo estás?"
   ```

### Linux/Mac:

```bash
# Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Iniciar servicio
ollama serve

# Descargar modelo
ollama pull llama3.2

# Verificar
ollama list
```

---

## 📱 Configuración de Permisos (React Native)

### Android - `android/app/src/main/AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### iOS - `ios/YourApp/Info.plist`
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Esta aplicación necesita acceso al micrófono para reconocimiento de voz</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Esta aplicación necesita acceso al reconocimiento de voz para registrar ingresos</string>
```

---

## 💡 Uso del Componente

### Ejemplo básico:

```tsx
import VoiceRecognition from '../components/VoiceRecognition';
import { useVoiceToIncome } from '../hooks/useVoiceToIncome';
import { useState } from 'react';
import ModalSuccess from '../components/ModalSuccess';

function IngresosVarios() {
  const { parseVoiceToIncome, isProcessing } = useVoiceToIncome();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleVoiceResult = async (text: string) => {
    console.log("Texto reconocido:", text);

    // Procesar con Ollama
    const parsedData = await parseVoiceToIncome(text);

    if (parsedData) {
      console.log("Datos parseados:", parsedData);

      // Aquí puedes registrar el ingreso automáticamente
      // await registrarIngreso(parsedData);

      setSuccessMessage(`Ingreso de $${parsedData.monto} registrado: ${parsedData.concepto}`);
      setShowSuccess(true);
    }
  };

  return (
    <View>
      <VoiceRecognition
        onResult={handleVoiceResult}
        onError={(error) => console.error(error)}
        placeholder="Di algo como: 'Registrar un ingreso de 150 dólares por venta de equipos'"
        enableProcessing={isProcessing}
      />

      <ModalSuccess
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
        title="¡Ingreso Registrado!"
      />
    </View>
  );
}
```

---

## 🎯 Ejemplos de Comandos de Voz

El sistema puede entender frases como:

- ✅ "Registrar un ingreso de 150 dólares por venta de equipos"
- ✅ "Ingreso de 50 pesos por servicio técnico"
- ✅ "Anotar 75 dólares por concepto de reparación"
- ✅ "Venta de productos por 200 dólares"
- ✅ "Cobro de servicio 120 pesos"

El modelo Ollama extraerá automáticamente:
- **Monto**: El valor numérico
- **Concepto**: Descripción del ingreso
- **Tipo**: Clasificación automática (VENTA, SERVICIO, OTROS)
- **Confianza**: Nivel de certeza del análisis (0-100)

---

## 🔧 Estructura de Archivos Creados

```
sysapp/
├── components/
│   ├── VoiceRecognition.tsx          # Componente de reconocimiento de voz
│   └── ModalSuccess.tsx               # Modal rediseñado (ya existía)
└── hooks/
    └── useVoiceToIncome.ts            # Hook para integración con Ollama

server/
├── controllers/
│   └── Voice/
│       └── voiceController.js         # Lógica de procesamiento con Ollama
└── routes/
    └── Voice/
        └── voiceRoutes.js             # Rutas API de voz
```

---

## 🧪 Pruebas

### 1. Verificar que Ollama está corriendo:
```bash
curl http://localhost:11434/api/tags
```

### 2. Probar endpoint de salud:
```bash
curl http://localhost:3000/api/voice/health
```

### 3. Probar parseo manual (requiere token de autenticación):
```bash
curl -X POST http://localhost:3000/api/voice/parse-income \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"text": "Registrar un ingreso de 150 dólares por venta de equipos"}'
```

---

## 🎨 Características Incluidas

### Componente VoiceRecognition:
- ✨ Animaciones suaves con ondas expansivas
- 🎤 Botón de micrófono con gradiente animado
- 🔴 Indicador visual de "Escuchando..."
- 📝 Muestra el texto reconocido en tiempo real
- ⚡ Soporte para auto-cierre
- 🎯 Feedback visual del estado

### Backend con Ollama:
- 🤖 Procesamiento inteligente con IA local
- 🔄 Fallback parser si Ollama falla
- ✅ Validación automática de datos
- 📊 Nivel de confianza en el análisis
- 🌐 Sin dependencia de servicios cloud

---

## 🐛 Troubleshooting

### Error: "Ollama no está disponible"
```bash
# Iniciar Ollama
ollama serve
```

### Error: "Model not found"
```bash
# Descargar el modelo
ollama pull llama3.2
```

### Error de permisos de micrófono (Android):
```bash
# Reinstalar app con permisos
npx expo run:android
```

### Backend no responde:
```bash
# Verificar que el servidor está corriendo
cd c:\SIS_VENTAS_NEXT\migracion_app_cliente\server
npm run dev
```

---

## 🚀 Próximos Pasos

1. ✅ Instalar dependencias
2. ✅ Configurar Ollama
3. ✅ Agregar rutas al servidor
4. ✅ Probar el componente
5. 🎯 Integrar con tu módulo de ingresos existente
6. 🎨 Personalizar mensajes y estilos según necesites

---

## 📞 Soporte

Si tienes problemas:
- Verifica que Ollama esté corriendo: `ollama serve`
- Revisa los logs del servidor Node.js
- Asegúrate de tener los permisos de micrófono habilitados
- Prueba primero con el endpoint de salud: `/api/voice/health`

---

**¡Listo! Ya tienes un sistema completo de reconocimiento de voz con IA local.** 🎉
