# 📱 Configuración de la App con Expo Go

## 🔧 Configuración para desarrollo local

### 1. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

### 2. Obtener tu IP local

**En Windows:**
```bash
ipconfig
```
Busca la línea `Dirección IPv4` en la sección de tu adaptador de red activo.

**En Mac/Linux:**
```bash
ifconfig
# o
ip addr show
```

### 3. Actualizar el archivo `.env`

Edita el archivo `.env` y reemplaza la IP con la de tu computadora:

```env
EXPO_PUBLIC_API_URL=http://TU_IP:3000/api
```

**Ejemplo:**
```env
EXPO_PUBLIC_API_URL=http://192.168.100.174:3000/api
```

### 4. Asegúrate de que el servidor backend esté corriendo

El servidor debe estar corriendo en el puerto 3000:

```bash
cd ../../server
npm start
```

### 5. Reiniciar Expo

Después de cambiar las variables de entorno, reinicia el servidor de Expo:

```bash
# Detén el servidor con Ctrl+C y vuelve a iniciarlo
npx expo start
```

O limpia el cache:

```bash
npx expo start -c
```

### 6. Conectar desde tu teléfono

1. Asegúrate de que tu teléfono y computadora estén en la **misma red WiFi**
2. Abre la app Expo Go en tu teléfono
3. Escanea el código QR que aparece en la terminal

## ⚠️ Solución de problemas comunes

### Error 530 o "Network Error"

- **Verifica que ambos dispositivos estén en la misma red WiFi**
- **Verifica que el firewall no esté bloqueando el puerto 3000**
- **Usa la IP correcta** (la IP puede cambiar si te reconectas al WiFi)

En Windows, puedes permitir el puerto temporalmente:

```bash
# Permitir puerto 3000 (ejecutar como Administrador)
netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=3000
```

### La app no encuentra el servidor

Verifica en la consola de Expo que se muestre:
```
🌐 API URL configurada: http://TU_IP:3000/api
```

Si no aparece, reinicia Expo con cache limpio:
```bash
npx expo start -c
```

### Usar ngrok (alternativa)

Si no puedes conectarte por IP local, puedes usar ngrok:

1. Instala ngrok: https://ngrok.com/
2. Expón el puerto 3000:
   ```bash
   ngrok http 3000
   ```
3. Actualiza el `.env` con la URL de ngrok:
   ```env
   EXPO_PUBLIC_API_URL=https://tu-url.ngrok.io/api
   ```
4. Descomenta el header de ngrok en `lib/axiosConfig.ts`:
   ```typescript
   headers: {
     'ngrok-skip-browser-warning': 'true'
   }
   ```

## 🚀 Producción

Para compilar la app para producción, usa el archivo `.env.production`:

```env
EXPO_PUBLIC_API_URL=https://api.kjhjhkjhkj.shop/api
```

Y compila la app:
```bash
eas build --platform android
```
