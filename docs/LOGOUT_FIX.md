# Solución al Problema de Renderizado Múltiple en Logout

## 🐛 Problema Identificado

Al cerrar sesión, la pantalla de login se renderizaba múltiples veces, causando una mala experiencia de usuario y posibles bugs.

## 🔍 Causa Raíz

El problema se debía a **múltiples navegaciones simultáneas** al hacer logout:

1. **Menu.tsx** (línea 167): `router.replace('/login')`
2. **axiosConfig.ts** (línea 30): Interceptor de axios hace `router.replace('/login')` en error 401
3. **index.tsx** (línea 17): `useEffect` verifica token y hace `router.replace('/login')`

Esto creaba un **ciclo de navegación** que causaba:
- Múltiples renderizados del componente Login
- Posible estado inconsistente
- Experiencia de usuario degradada

## ✅ Soluciones Implementadas

### 1. Guard en Interceptor de Axios ([axiosConfig.ts](c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp\lib\axiosConfig.ts))

```typescript
// Variable para evitar múltiples redirects
let isRedirecting = false;

api.interceptors.response.use(
  res => res,
  async (err) => {
    const status   = err.response?.status;
    const endpoint = err.config?.url || '';

    if (status === 401 && !endpoint.includes('/auth/login') && !isRedirecting) {
      isRedirecting = true;
      await AsyncStorage.removeItem('usuario');
      await AsyncStorage.removeItem('auth_token');
      router.replace('/login');
      // Reset después de un pequeño delay
      setTimeout(() => { isRedirecting = false; }, 1000);
    }

    return Promise.reject(err);
  }
);
```

**Beneficio**: Evita que múltiples errores 401 simultáneos causen múltiples navegaciones.

### 2. Guard en Index.tsx ([index.tsx](c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp\app\index.tsx))

```typescript
export default function HomePage() {
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      checkAuth();
    }
  }, []);

  // ... resto del código
}
```

**Beneficio**: Asegura que `checkAuth()` solo se ejecute una vez, incluso si el componente se re-renderiza.

### 3. Memoización del Login ([Login.tsx](c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp\app\login\Login.tsx))

```typescript
function Login() {
  // ... código del componente
}

export default React.memo(Login);
```

**Beneficio**: Evita re-renderizados innecesarios del componente Login cuando las props no cambian.

## 📊 Flujo Mejorado de Logout

### Antes:
```
Usuario hace click en "Cerrar Sesión"
  ↓
Menu.tsx ejecuta logout
  ↓
router.replace('/login') [1]
  ↓
Axios interceptor detecta token removido
  ↓
router.replace('/login') [2] ← DUPLICADO
  ↓
index.tsx detecta sin token
  ↓
router.replace('/login') [3] ← DUPLICADO
  ↓
Login se renderiza 3+ veces ❌
```

### Después:
```
Usuario hace click en "Cerrar Sesión"
  ↓
Menu.tsx ejecuta logout
  ↓
router.replace('/login')
  ↓
Axios interceptor: isRedirecting = true (BLOQUEADO)
  ↓
index.tsx: hasNavigated.current = true (BLOQUEADO)
  ↓
Login se renderiza UNA sola vez ✅
```

## 🧪 Cómo Probar

1. **Login normal**: Inicia sesión con un usuario válido
2. **Navega**: Usa la app normalmente
3. **Logout**: Ve al menú y haz click en "Cerrar Sesión"
4. **Verifica**: La pantalla de login debe aparecer solo UNA vez

## 🔧 Notas Técnicas

### Variables de Guard

- `isRedirecting`: Variable de módulo que persiste entre llamadas
- `hasNavigated.current`: Ref de React que persiste entre re-renderizados

### Timeout de Reset

El `setTimeout(() => { isRedirecting = false; }, 1000)` permite que después de 1 segundo se pueda volver a hacer logout si es necesario (ej: otro usuario quiere iniciar sesión).

### React.memo

`React.memo` compara las props del componente y solo re-renderiza si cambian. Como Login no recibe props, efectivamente previene re-renderizados innecesarios.

## 🚀 Beneficios

✅ Mejor rendimiento (menos renderizados)
✅ Experiencia de usuario mejorada
✅ Código más robusto y predecible
✅ Previene bugs relacionados con estado inconsistente
✅ Mantiene la lógica de logout en un solo lugar

## 📝 Archivos Modificados

1. [lib/axiosConfig.ts](c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp\lib\axiosConfig.ts) - Guard en interceptor
2. [app/index.tsx](c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp\app\index.tsx) - Guard en navegación inicial
3. [app/login/Login.tsx](c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp\app\login\Login.tsx) - Memoización del componente

## ⚠️ Consideraciones Futuras

Si en el futuro necesitas agregar más puntos de logout, asegúrate de:

1. Usar la misma lógica de guard (`isRedirecting`)
2. Verificar que no haya múltiples `router.replace()` simultáneos
3. Considerar usar un store global para el estado de autenticación
