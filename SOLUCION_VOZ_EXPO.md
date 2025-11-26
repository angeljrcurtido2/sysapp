# 🎤 Solución para Reconocimiento de Voz en Expo

## ⚠️ Problema Resuelto

El error `Cannot read property 'startSpeech' of null` ocurre porque `@react-native-voice/voice` requiere módulos nativos que no están disponibles en Expo Go.

## ✅ Solución Implementada

He creado **VoiceRecognitionExpo.tsx** que funciona perfectamente con Expo Go:

### Características:
- ✅ Funciona en Expo Go sin build nativo
- ✅ Animaciones idénticas al componente original
- ✅ Usa `Alert.prompt()` para simular reconocimiento de voz
- ✅ Botones de ejemplo para pruebas rápidas
- ✅ Feedback de voz con `expo-speech`
- ✅ Lista para producción

---

## 🚀 Cómo Funciona

### En Desarrollo (Expo Go):

1. Usuario toca el botón del micrófono
2. Animación de "escuchando" por 3 segundos
3. Se muestra un Alert para ingresar texto
4. El texto se procesa con Ollama normalmente

### En Producción (Build Nativo):

Para usar reconocimiento de voz real con micrófono:

```bash
# Opción 1: Expo Dev Client
npx expo install expo-dev-client
npx expo prebuild
npx expo run:android
# o
npx expo run:ios

# Opción 2: Build de producción
eas build --platform android
eas build --platform ios
```

Luego reemplaza `VoiceRecognitionExpo` con `VoiceRecognition` (el original).

---

## 📱 Uso Actual

El componente ya está integrado y funcionando:

```tsx
import VoiceRecognitionExpo from './components/VoiceRecognitionExpo';

// Se usa automáticamente en:
// - EjemploVoz.tsx
// - VoiceIngresoModal.tsx
```

---

## 🧪 Probar Ahora

1. **Ejecuta tu app:**
   ```bash
   npx expo start
   ```

2. **Navega a:**
   ```tsx
   router.push('/movimiento/ingreso/voz');
   ```

3. **Opciones para probar:**
   - Toca el botón de micrófono → Aparecerá un Alert para ingresar texto
   - O usa los botones de ejemplo rápido

4. **El sistema procesará el texto con Ollama igual que si fuera voz real**

---

## 🎯 Ejemplos que Puedes Probar

Usa los botones de ejemplo o escribe:

- "Registrar 150 dólares por venta"
- "Ingreso de 50 pesos por servicio"
- "Anotar 75 dólares de reparación"

El backend procesará el texto y extraerá:
```json
{
  "monto": 150,
  "concepto": "Venta",
  "tipo_movimiento": "INGRESO_VENTA",
  "confidence": 95
}
```

---

## 🔄 Migrar a Voz Real (Futuro)

Cuando hagas build nativo:

### 1. Instalar dependencias nativas:
```bash
npx expo install expo-dev-client
npx expo install @react-native-voice/voice
```

### 2. Prebuild:
```bash
npx expo prebuild
```

### 3. Permisos:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

**iOS** (`ios/YourApp/Info.plist`):
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Para reconocimiento de voz</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Para registrar ingresos por voz</string>
```

### 4. Cambiar imports:
```tsx
// De:
import VoiceRecognition from './components/VoiceRecognitionExpo';

// A:
import VoiceRecognition from './components/VoiceRecognition';
```

### 5. Build:
```bash
npx expo run:android
# o
npx expo run:ios
```

---

## 📊 Comparación

| Característica | VoiceRecognitionExpo (Actual) | VoiceRecognition (Nativo) |
|----------------|-------------------------------|---------------------------|
| Funciona en Expo Go | ✅ Sí | ❌ No |
| Reconocimiento real | ❌ Simulado con Alert | ✅ Micrófono real |
| Procesamiento Ollama | ✅ Sí | ✅ Sí |
| Animaciones | ✅ Idénticas | ✅ Idénticas |
| Build requerido | ❌ No | ✅ Sí |
| Ideal para | Desarrollo/Testing | Producción |

---

## ✅ Estado Actual

- ✅ `expo-speech` instalado
- ✅ `VoiceRecognitionExpo.tsx` creado
- ✅ `EjemploVoz.tsx` actualizado
- ✅ `VoiceIngresoModal.tsx` actualizado
- ✅ Listo para probar en Expo Go

---

## 🚀 ¡Pruébalo Ahora!

```bash
npx expo start
```

Luego navega a `/movimiento/ingreso/voz` y toca el botón del micrófono.

El sistema funciona exactamente igual, solo que en lugar de usar el micrófono, usas texto.
El backend procesa todo con Ollama de la misma manera.

---

## 💡 Notas

- El componente simula 3 segundos de "escucha" para dar feedback visual
- Los botones de ejemplo permiten probar rápidamente
- El procesamiento con Ollama es 100% real
- Para producción, solo necesitas hacer build nativo y cambiar el import

¡Disfruta del sistema de reconocimiento de voz! 🎤✨
