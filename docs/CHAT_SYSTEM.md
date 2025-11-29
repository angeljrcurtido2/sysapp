# Sistema de Chat para Ingresos y Egresos

Este sistema permite registrar ingresos y egresos mediante texto natural, utilizando **Ollama** como motor de procesamiento de lenguaje natural (NLP).

## 🎯 Características

- ✅ Registro de **ingresos** mediante texto natural
- ✅ Registro de **egresos** mediante texto natural
- ✅ Procesamiento con **Ollama AI** (modelo llama3.2)
- ✅ Parser de fallback cuando Ollama no está disponible
- ✅ Validación de movimientos de caja abiertos
- ✅ Soporte para usuarios y funcionarios
- ✅ Interfaz móvil optimizada con React Native

## 📁 Estructura de Archivos

### Frontend (React Native)

```
sysapp/
├── components/
│   ├── ChatIngresoModal.tsx       # Modal para registrar ingresos
│   ├── ChatEgresoModal.tsx        # Modal para registrar egresos
│   ├── EjemploChat.tsx            # Ejemplo de uso (ingresos)
│   └── EjemploChatEgreso.tsx      # Ejemplo de uso (egresos)
├── hooks/
│   ├── useTextToIncome.ts         # Hook para procesamiento de ingresos
│   └── useTextToExpense.ts        # Hook para procesamiento de egresos
└── services/
    └── api.ts                     # Cliente API
```

### Backend (Node.js/Express)

```
server/
├── controllers/
│   └── Voice/
│       ├── voiceController.js     # Controlador principal
│       └── chatController.js      # (Deprecado - usar voiceController)
├── models/
│   └── Movimiento/
│       ├── Ingreso.js             # Modelo de ingresos
│       └── Egreso.js              # Modelo de egresos
└── routes/
    └── Voice/
        └── voiceRoutes.js         # Rutas del sistema
```

## 🚀 Uso

### Ingresos

```typescript
import ChatIngresoModal from '../components/ChatIngresoModal';

<ChatIngresoModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onIngresoRegistrado={(data) => {
    console.log('Ingreso registrado:', data);
  }}
/>
```

**Ejemplos de comandos:**

- "Registrar 2000 guaraníes por venta"
- "Ingreso de 150 dólares por servicio técnico"
- "Cobro de 50000 gs"

### Egresos

```typescript
import ChatEgresoModal from '../components/ChatEgresoModal';

<ChatEgresoModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onEgresoRegistrado={(data) => {
    console.log('Egreso registrado:', data);
  }}
/>
```

**Ejemplos de comandos:**

- "Egreso de 30000 por pago de servicios"
- "Compra de insumos por 50000 guaraníes"
- "Gastos varios 20000 gs"
- "Pago de alquiler 150000"

## 📡 API Endpoints

### Ingresos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/voice/parse-income` | Solo parsea el texto (no registra) |
| POST | `/voice/register-income` | Parsea Y registra en BD |

### Egresos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/voice/parse-expense` | Solo parsea el texto (no registra) |
| POST | `/voice/register-expense` | Parsea Y registra en BD |

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/voice/health` | Verifica estado de Ollama |

## 🔧 Configuración

### Variables de entorno

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Tipos de Movimiento

**Ingresos:**
```javascript
TIPO_INGRESO_MAP = {
  INGRESO_VENTA: 1,        // Ingresos por venta
  INGRESO_SERVICIO: 2,     // Ingresos por servicio
  INGRESO_OTROS: 3,        // Otros ingresos
}
```

**Egresos:**
```javascript
TIPO_EGRESO_MAP = {
  EGRESO_COMPRA: 1,        // Egresos por compra
  EGRESO_GASTO: 2,         // Egresos por gasto
  EGRESO_OTROS: 3,         // Otros egresos
}
```

⚠️ **Importante:** Verifica que estos IDs coincidan con tu tabla `tipo_ingreso` y `tipo_egreso` en la base de datos.

## 🧠 Procesamiento con Ollama

El sistema utiliza Ollama para procesar texto natural y extraer:

- **monto**: Valor numérico del movimiento
- **concepto**: Descripción breve del motivo
- **tipo_movimiento**: Clasificación automática
- **observaciones**: Detalles adicionales
- **confidence**: Nivel de confianza (0-100)

### Parser de Fallback

Cuando Ollama no está disponible, el sistema usa un parser basado en regex:

```javascript
// Busca patrones como:
// "150 dólares", "50000 gs", "2000 guaraníes"
const montoMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:dólares?|pesos?|guaraníes?|gs|...)/i);
```

## 🔐 Autenticación

Todos los endpoints requieren autenticación mediante JWT:

```javascript
router.post("/register-income", verifyToken, parseAndRegisterIncome);
```

El sistema identifica automáticamente:
- `idusuarios` - Usuario administrador
- `idfuncionario` - Funcionario

## ⚡ Flujo de Registro

1. Usuario ingresa texto en el modal
2. Frontend envía texto a `/register-income` o `/register-expense`
3. Backend parsea con Ollama (o fallback)
4. Backend valida movimiento de caja abierto
5. Backend crea registro en tabla `ingresos` o `egresos`
6. Backend responde con datos completos + ID del registro
7. Frontend muestra confirmación

## 📊 Estructura de Datos

### ParsedIncome

```typescript
interface ParsedIncome {
  monto: number;
  concepto: string;
  tipo_movimiento: string;
  fecha?: string;
  observaciones?: string;
  confidence: number;
  idingreso?: number;
  idtipo_ingreso?: number;
  idmovimiento?: number;
  hora?: string;
  message?: string;
}
```

### ParsedExpense

```typescript
interface ParsedExpense {
  monto: number;
  concepto: string;
  tipo_movimiento: string;
  fecha?: string;
  observaciones?: string;
  confidence: number;
  idegreso?: number;
  idtipo_egreso?: number;
  idmovimiento?: number;
  hora?: string;
  message?: string;
}
```

## 🐛 Troubleshooting

### Error: "Ollama no está disponible"

```bash
# Iniciar Ollama
ollama serve

# Verificar que el modelo está instalado
ollama list

# Si no está, instalar llama3.2
ollama pull llama3.2
```

### Error: "No hay movimiento de caja abierto"

El usuario debe tener un movimiento de caja abierto antes de registrar ingresos/egresos.

### Error: "Usuario no autenticado"

Verifica que el token JWT esté incluido en los headers:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 📝 Migraciones de Voz a Texto

Este sistema reemplaza completamente el reconocimiento de voz anterior:

**Eliminado:**
- ❌ `@react-native-voice/voice`
- ❌ `expo-speech`
- ❌ `VoiceIngresoModal.tsx`
- ❌ `useVoiceToIncome.ts`
- ❌ Permisos de `RECORD_AUDIO`

**Nuevo:**
- ✅ `ChatIngresoModal.tsx` (entrada de texto)
- ✅ `ChatEgresoModal.tsx` (entrada de texto)
- ✅ `useTextToIncome.ts`
- ✅ `useTextToExpense.ts`
- ✅ Procesamiento con Ollama AI

## 🎨 Personalización

### Cambiar el prompt de Ollama

Edita `voiceController.js`:

```javascript
const prompt = `Tu prompt personalizado aquí...`;
```

### Agregar nuevos tipos de movimiento

1. Actualiza `TIPO_INGRESO_MAP` o `TIPO_EGRESO_MAP`
2. Modifica el prompt de Ollama para reconocer nuevas categorías
3. Actualiza el parser de fallback

## 📚 Referencias

- [Ollama Documentation](https://ollama.ai/docs)
- [React Native Docs](https://reactnative.dev/)
- [Express.js Guide](https://expressjs.com/)
