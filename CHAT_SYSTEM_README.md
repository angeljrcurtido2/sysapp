# 💬 Sistema de Chat con IA - Documentación

## Descripción

Sistema de registro de ingresos mediante comandos de texto procesados con IA. Este sistema reemplaza el reconocimiento de voz por una interfaz de chat más simple y confiable.

## Características

- ✅ **Entrada de texto**: Escribe comandos en lenguaje natural
- ✅ **Procesamiento con IA**: Utiliza Ollama para extraer información
- ✅ **Sin permisos especiales**: No requiere acceso al micrófono
- ✅ **Funciona en todos los entornos**: Expo Go, APK, iOS
- ✅ **Comandos rápidos**: Ejemplos predefinidos para usar fácilmente
- ✅ **Interfaz intuitiva**: Modal con teclado optimizado

## Componentes

### 1. `ChatIngresoModal`

Modal principal para registrar ingresos mediante chat.

**Props:**
- `isOpen: boolean` - Controla la visibilidad del modal
- `onClose: () => void` - Callback al cerrar el modal
- `onIngresoRegistrado?: (ingreso: ParsedIncome) => void` - Callback cuando se registra un ingreso

**Ubicación:** `components/ChatIngresoModal.tsx`

### 2. `useTextToIncome` Hook

Hook para procesar texto y extraer información de ingresos.

**Retorna:**
```typescript
{
  parseTextToIncome: (text: string) => Promise<ParsedIncome | null>;
  isProcessing: boolean;
  error: string | null;
  lastParsedData: ParsedIncome | null;
}
```

**Ubicación:** `hooks/useTextToIncome.ts`

### 3. `EjemploChat`

Componente de ejemplo que muestra cómo usar el sistema.

**Ubicación:** `components/EjemploChat.tsx`

## Uso Básico

```tsx
import React, { useState } from 'react';
import ChatIngresoModal from './components/ChatIngresoModal';
import { ParsedIncome } from './hooks/useTextToIncome';

function MiComponente() {
  const [showModal, setShowModal] = useState(false);

  const handleIngresoRegistrado = (ingreso: ParsedIncome) => {
    console.log('Ingreso registrado:', ingreso);
    // Aquí guardarías en tu base de datos
  };

  return (
    <>
      <Button onPress={() => setShowModal(true)}>
        Registrar Ingreso
      </Button>

      <ChatIngresoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onIngresoRegistrado={handleIngresoRegistrado}
      />
    </>
  );
}
```

## Ejemplos de Comandos

El sistema entiende comandos en lenguaje natural como:

- "Registrar un ingreso de 150 dólares por venta de equipos"
- "Ingreso de 50 pesos por servicio técnico"
- "Anotar 75 dólares de reparación"
- "Venta de productos por 200 dólares"

## Estructura de Datos

### ParsedIncome

```typescript
interface ParsedIncome {
  monto: number;           // Monto del ingreso
  concepto: string;        // Descripción del ingreso
  tipo_movimiento: string; // Tipo de movimiento
  fecha?: string;          // Fecha (opcional)
  observaciones?: string;  // Observaciones adicionales
  confidence: number;      // Confianza del parseo (0-100)
}
```

## Backend - Endpoint

El sistema se comunica con el backend a través del endpoint:

```
POST /voice/parse-income
```

**Body:**
```json
{
  "text": "Registrar un ingreso de 150 dólares por venta de equipos"
}
```

**Response:**
```json
{
  "monto": 150,
  "concepto": "venta de equipos",
  "tipo_movimiento": "Ingreso",
  "confidence": 95
}
```

## Ventajas sobre el Sistema de Voz

1. **No requiere permisos**: Sin necesidad de acceso al micrófono
2. **Más preciso**: El usuario puede revisar y editar el texto antes de enviar
3. **Funciona en cualquier entorno**: No hay problemas de compatibilidad
4. **Más silencioso**: Útil en lugares donde no se puede hablar
5. **Historial visible**: El usuario puede copiar/pegar comandos anteriores
6. **Sin ruido ambiente**: No hay problemas con sonidos externos

## Configuración del Backend

El sistema utiliza el mismo endpoint que el sistema de voz anterior. Asegúrate de que tu backend tenga configurado:

1. Ollama instalado y ejecutándose
2. Modelo llama3.2 descargado
3. Endpoint `/voice/parse-income` activo

Ver documentación del backend para más detalles.

## Personalización

### Cambiar los comandos rápidos

Edita el array de ejemplos en `ChatIngresoModal.tsx`:

```tsx
{[
  "Tu comando personalizado 1",
  "Tu comando personalizado 2",
  "Tu comando personalizado 3",
].map((command, index) => (
  // ...
))}
```

### Cambiar el color del tema

Modifica los colores en el LinearGradient:

```tsx
<LinearGradient
  colors={["#tu-color-1", "#tu-color-2", "#tu-color-3"]}
  // ...
>
```

## Solución de Problemas

### El modal no se abre
- Verifica que `isOpen` esté en `true`
- Revisa la consola por errores

### El procesamiento falla
- Verifica que el backend esté ejecutándose
- Revisa que el endpoint `/voice/parse-income` esté disponible
- Verifica que Ollama esté activo

### El teclado cubre el input
- El componente usa `KeyboardAvoidingView`, asegúrate de no tener conflictos con otros componentes similares

## Migrando desde el Sistema de Voz

Si estás migrando desde el sistema de voz anterior:

1. Reemplaza `VoiceIngresoModal` por `ChatIngresoModal`
2. Reemplaza `useVoiceToIncome` por `useTextToIncome`
3. Las interfaces y el backend permanecen iguales
4. Los datos retornados son idénticos

### Ejemplo de migración:

**Antes:**
```tsx
import VoiceIngresoModal from './components/VoiceIngresoModal';

<VoiceIngresoModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onIngresoRegistrado={handleIngreso}
/>
```

**Después:**
```tsx
import ChatIngresoModal from './components/ChatIngresoModal';

<ChatIngresoModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onIngresoRegistrado={handleIngreso}
/>
```

## Próximas Mejoras

- [ ] Historial de comandos recientes
- [ ] Autocompletado de comandos comunes
- [ ] Sugerencias inteligentes mientras escribes
- [ ] Soporte para múltiples idiomas
- [ ] Plantillas de comandos personalizables

## Soporte

Para reportar problemas o sugerir mejoras, contacta al equipo de desarrollo.
