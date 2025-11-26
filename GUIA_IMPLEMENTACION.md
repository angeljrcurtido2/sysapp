# 🎤 Guía de Implementación - Reconocimiento de Voz

## ✅ Estado Actual

- ✅ Backend configurado y funcionando
- ✅ Ollama instalado con modelo llama3.2
- ✅ Componentes frontend creados
- ✅ Dependencias instaladas
- ✅ Hook actualizado para usar tu configuración de axios

---

## 🚀 Cómo Usar en tu App

### Opción 1: Pantalla Completa de Demostración

Ya creé una pantalla de ejemplo en:
```
app/movimiento/ingreso/voz.tsx
```

**Para acceder:**
```tsx
// Navega desde cualquier parte de tu app
import { router } from 'expo-router';

router.push('/movimiento/ingreso/voz');
```

O agrega un botón en tu menú/sidebar:
```tsx
<Pressable onPress={() => router.push('/movimiento/ingreso/voz')}>
  <Text>🎤 Registro por Voz</Text>
</Pressable>
```

---

### Opción 2: Integrar en Pantalla Existente

Puedes agregar el modal de voz a cualquier pantalla:

```tsx
import { useState } from 'react';
import VoiceIngresoModal from '../../../components/VoiceIngresoModal';
import type { ParsedIncome } from '../../../hooks/useVoiceToIncome';

export default function MiPantalla() {
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const handleIngresoRegistrado = async (ingreso: ParsedIncome) => {
    console.log('📊 Datos del ingreso:', ingreso);

    // Aquí puedes guardar el ingreso usando tu API
    // Por ejemplo:
    // await api.post('/ingresos', {
    //   monto: ingreso.monto,
    //   concepto: ingreso.concepto,
    //   tipo: ingreso.tipo_movimiento,
    //   fecha: new Date().toISOString()
    // });
  };

  return (
    <>
      {/* Tu contenido existente */}

      {/* Botón para abrir reconocimiento de voz */}
      <Pressable onPress={() => setShowVoiceModal(true)}>
        <Text>🎤 Registrar por Voz</Text>
      </Pressable>

      {/* Modal de voz */}
      <VoiceIngresoModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onIngresoRegistrado={handleIngresoRegistrado}
      />
    </>
  );
}
```

---

### Opción 3: Solo el Componente de Reconocimiento

Si solo quieres el componente de reconocimiento sin el modal completo:

```tsx
import VoiceRecognition from '../../../components/VoiceRecognition';
import { useVoiceToIncome } from '../../../hooks/useVoiceToIncome';

export default function MiComponente() {
  const { parseVoiceToIncome, isProcessing, error } = useVoiceToIncome();

  const handleVoiceResult = async (text: string) => {
    console.log('🎤 Texto reconocido:', text);

    const parsedData = await parseVoiceToIncome(text);
    if (parsedData) {
      console.log('✅ Datos extraídos:', parsedData);
      // Usar los datos
    }
  };

  return (
    <VoiceRecognition
      onResult={handleVoiceResult}
      onError={(error) => console.error('Error:', error)}
      placeholder="Di algo como: 'Registrar 150 dólares por venta'"
      enableProcessing={isProcessing}
    />
  );
}
```

---

## 📱 Permisos Requeridos

### Android

Asegúrate de tener estos permisos en `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS

Agrega esto a `ios/YourApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Necesitamos acceso al micrófono para reconocimiento de voz</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Necesitamos acceso al reconocimiento de voz para registrar ingresos</string>
```

---

## 🧪 Probar la Implementación

### 1. Asegúrate que el backend esté corriendo

```powershell
# En terminal 1
cd C:\SIS_VENTAS_NEXT\server
npm run dev
```

### 2. Verifica que Ollama esté funcionando

```powershell
# En PowerShell
Invoke-WebRequest https://api.kjhjhkjhkj.shop/api/voice/health
```

### 3. Ejecuta tu app

```bash
# En terminal 2
cd C:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp
npx expo start
```

### 4. Prueba el reconocimiento de voz

Navega a `/movimiento/ingreso/voz` o usa el componente donde lo agregaste.

---

## 🎯 Ejemplos de Comandos de Voz

Di frases naturales como:

- ✅ "Registrar un ingreso de 150 dólares por venta de equipos"
- ✅ "Ingreso de 50 pesos por servicio técnico"
- ✅ "Anotar 75 dólares de reparación"
- ✅ "Venta de productos por 200 dólares"

El sistema extraerá automáticamente:
```typescript
{
  monto: 150,
  concepto: "Venta de equipos",
  tipo_movimiento: "INGRESO_VENTA",
  confidence: 95,
  fecha: "2025-11-22T00:00:00.000Z"
}
```

---

## 🔧 Configuración Avanzada

### Cambiar el idioma

```tsx
<VoiceRecognition
  language="en-US"  // Cambiar a inglés
  onResult={handleResult}
/>
```

### Personalizar el título y mensajes

```tsx
<VoiceIngresoModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onIngresoRegistrado={handleIngreso}
  // Puedes extender el componente para aceptar más props
/>
```

---

## 📊 Estructura de Datos

```typescript
interface ParsedIncome {
  monto: number;              // Valor numérico
  concepto: string;           // Descripción breve
  tipo_movimiento: string;    // INGRESO_VENTA | INGRESO_SERVICIO | INGRESO_OTROS
  observaciones?: string;     // Texto original completo
  fecha?: string;             // ISO timestamp
  confidence: number;         // 0-100 (nivel de confianza)
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module Voice"

```bash
npm install @react-native-voice/voice
npx expo prebuild
```

### Error de permisos de micrófono

```bash
# Reinstalar la app
npx expo run:android
# o
npx expo run:ios
```

### Backend no responde

Verifica que:
1. El servidor esté corriendo (`npm run dev`)
2. La URL en `axiosConfig.ts` sea correcta
3. Tengas conexión a internet (si usas ngrok/cloudflare)

---

## 🎨 Componentes Disponibles

### VoiceRecognition
Componente base de reconocimiento de voz con animaciones.

### VoiceIngresoModal
Modal completo con vista previa de datos y confirmación.

### EjemploVoz
Pantalla completa de ejemplo con historial.

### ModalSuccess
Modal de éxito rediseñado con animaciones.

---

## ✅ Checklist de Implementación

- [ ] Backend corriendo en `https://api.kjhjhkjhkj.shop`
- [ ] Ollama funcionando con modelo llama3.2
- [ ] Dependencias instaladas (`@react-native-voice/voice`, `expo-linear-gradient`)
- [ ] Permisos configurados (Android/iOS)
- [ ] Hook `useVoiceToIncome` actualizado con tu axios
- [ ] Componente agregado a tu pantalla
- [ ] Probado en dispositivo/emulador

---

## 🚀 ¡Listo para Usar!

Tu app ahora tiene reconocimiento de voz con IA local.

**Accede a la demo:**
```tsx
router.push('/movimiento/ingreso/voz');
```

**O integra el modal:**
```tsx
<VoiceIngresoModal {...props} />
```

¡Disfruta del reconocimiento de voz! 🎤✨
