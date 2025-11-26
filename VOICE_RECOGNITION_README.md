# 🎤 Reconocimiento de Voz - Registro de Ingresos

## ✅ Cambios Realizados

Se ha actualizado el sistema de reconocimiento de voz para usar **reconocimiento real** en lugar del simulador de Expo Go.

### Archivos Modificados/Creados:

1. **`components/VoiceRecognitionNative.tsx`** (NUEVO)
   - Componente de reconocimiento de voz que usa `@react-native-voice/voice`
   - Funciona con micrófono real en builds nativos
   - Incluye animaciones visuales y feedback en tiempo real
   - Muestra resultados parciales mientras hablas

2. **`components/VoiceIngresoModal.tsx`** (MODIFICADO)
   - Ahora importa `VoiceRecognitionNative` en lugar de `VoiceRecognitionExpo`
   - Procesa el texto capturado y lo envía al backend para análisis con IA

3. **`plugins/withVoicePermissions.js`** (NUEVO)
   - Plugin de Expo que agrega automáticamente el permiso `RECORD_AUDIO` al AndroidManifest.xml
   - Asegura que la app tenga acceso al micrófono

4. **`app.json`** (MODIFICADO)
   - Agregado permiso `RECORD_AUDIO` en la sección android
   - Agregado plugin `./plugins/withVoicePermissions.js`

---

## 🚀 Cómo Funciona

### Flujo del Reconocimiento de Voz:

```
Usuario presiona botón →
  Solicita permiso de micrófono →
    Inicia grabación →
      Reconoce voz en español (es-ES) →
        Envía texto al backend →
          IA procesa con Ollama →
            Extrae datos (monto, concepto, etc.) →
              Usuario confirma y registra
```

### Características:

- ✅ **Reconocimiento en Tiempo Real**: Muestra resultados parciales mientras hablas
- ✅ **Idioma Español**: Configurado para reconocer español (es-ES)
- ✅ **Animaciones Visuales**: Ondas expansivas y pulsaciones mientras escucha
- ✅ **Ejemplos Rápidos**: Botones con frases de ejemplo para testing
- ✅ **Manejo de Errores**: Mensajes claros para errores comunes (permiso denegado, tiempo agotado, etc.)

---

## 📱 Testing en el APK

### Paso 1: Generar nuevo build con reconocimiento de voz

```bash
eas build --platform android --profile production
```

### Paso 2: Instalar el APK en tu dispositivo Android

1. Descarga el APK generado
2. Instala en tu dispositivo
3. Al abrir por primera vez, la app solicitará permiso de micrófono

### Paso 3: Probar el reconocimiento de voz

1. Ve a **Movimientos → Registrar por Voz** (o donde esté el botón)
2. Presiona el botón azul del micrófono
3. Di una frase como:
   - "Registrar 150 dólares por venta de equipos"
   - "Ingreso de 50 pesos por servicio técnico"
   - "Anotar 75 dólares de reparación"
4. El texto aparecerá en verde cuando se reconozca
5. El backend procesará el texto con IA
6. Revisa los datos extraídos y confirma

---

## 🔧 Configuración

### Permisos de Android

El permiso `RECORD_AUDIO` se agrega automáticamente mediante:

1. **app.json**:
```json
"android": {
  "permissions": [
    "RECORD_AUDIO"
  ]
}
```

2. **Plugin withVoicePermissions.js**:
   - Asegura que el permiso esté en el AndroidManifest.xml
   - Se ejecuta durante el build

### Idioma de Reconocimiento

Configurado en [VoiceRecognitionNative.tsx:178](components/VoiceRecognitionNative.tsx#L178):

```typescript
await Voice.start("es-ES"); // Español
```

Para cambiar el idioma, modifica el código:
- `"en-US"` - Inglés (Estados Unidos)
- `"es-MX"` - Español (México)
- `"es-AR"` - Español (Argentina)
- etc.

---

## ⚠️ Importante

### NO funciona en Expo Go

El reconocimiento de voz **REQUIERE** un build nativo. No funcionará en:
- ❌ Expo Go
- ❌ Expo Dev Client sin build

### SÍ funciona en:

- ✅ APK generado con `eas build`
- ✅ Build nativo local con `npx expo run:android`
- ✅ Dispositivos Android físicos con micrófono
- ✅ Emuladores Android con micrófono configurado

---

## 🐛 Solución de Problemas

### Error: "Permiso de micrófono denegado"

**Solución**: Ve a Configuración → Apps → KontrolX → Permisos → Habilita Micrófono

### Error: "No se detectó voz"

**Causas posibles**:
- Micrófono bloqueado o cubierto
- Volumen de voz muy bajo
- Ruido de fondo muy alto

**Solución**: Habla más fuerte y claro, en un ambiente tranquilo

### Error: "Tiempo de espera agotado"

**Causa**: No se detectó ninguna voz durante 3-5 segundos

**Solución**: Empieza a hablar inmediatamente después de presionar el botón

### El texto se reconoce mal

**Solución**:
- Habla despacio y claro
- Usa frases completas y naturales
- Evita muletillas y pausas largas

---

## 🎯 Ejemplos de Frases que Funcionan Bien

✅ **Buenas**:
- "Registrar un ingreso de 150 dólares por venta de equipos"
- "Ingreso de 50 pesos por servicio técnico"
- "Anotar 75 dólares de reparación de computadora"

❌ **Malas**:
- "Eh... mmm... como que... 150... creo"
- "Ciento cincuenta" (sin contexto)
- Hablar muy rápido o muy bajo

---

## 📊 Integración con Backend

El texto reconocido se envía al endpoint:

```
POST /voice/parse-income
Body: { text: "Registrar 150 dólares por venta" }
```

El backend usa Ollama para extraer:
- `monto`: 150
- `concepto`: "venta"
- `tipo_movimiento`: "INGRESO"
- `confidence`: 85

---

## 🔄 Próximos Pasos

Si quieres mejorar el sistema:

1. **Agregar más idiomas**: Modificar el componente para seleccionar idioma
2. **Reconocimiento continuo**: Permitir hablar múltiples comandos sin reiniciar
3. **Entrenar modelo de IA**: Mejorar la precisión del parsing con más ejemplos
4. **Feedback de voz**: Usar `expo-speech` para responder con voz

---

## 📝 Notas Finales

- El componente antiguo `VoiceRecognitionExpo.tsx` aún existe pero ya no se usa
- Puedes eliminarlo si quieres limpiar el código
- O mantenerlo como fallback para testing en Expo Go

---

**¡Listo para probar! 🎉**

Genera el nuevo build y prueba el reconocimiento de voz real en tu dispositivo Android.
