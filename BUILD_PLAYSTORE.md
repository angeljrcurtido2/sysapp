# Generar Build para Play Store - KontrolX

## Información del Proyecto
- **App Name**: KontrolX
- **Package**: com.angeljrcurtido.kontrolx
- **Version**: 1.0.1
- **EAS Project ID**: 8df20f1e-9199-4743-909c-55614aa37243

## Pasos para Generar el Build

### 1. Verificar que estés autenticado en EAS
```bash
eas whoami
```

Si no estás autenticado:
```bash
eas login
```

### 2. Limpiar builds anteriores (opcional pero recomendado)
```bash
npm run clean:android
```

### 3. Generar el Build AAB para Play Store

**Opción A: Build en la nube con EAS (Recomendado)**
```bash
eas build --platform android --profile production
```

Este comando:
- Genera un Android App Bundle (.aab)
- Lo hace en los servidores de EAS
- Firma automáticamente la app
- Te da un link para descargar el .aab cuando termine

**Opción B: Build local**
```bash
npm run prebuild:android
npm run build:aab
```

El AAB se generará en:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### 4. Monitorear el Build (si usaste EAS)
```bash
eas build:list
```

O visita: https://expo.dev/accounts/[tu-usuario]/projects/sysapp/builds

### 5. Descargar el AAB
Una vez completado el build, EAS te dará un link de descarga.

### 6. Subir a Play Store

1. Ve a [Google Play Console](https://play.google.com/console)
2. Selecciona tu app (KontrolX)
3. Ve a **Producción** → **Crear nueva versión**
4. Sube el archivo `.aab` que descargaste
5. Completa la información de la versión
6. Envía para revisión

## Verificar Versión Antes del Build

Asegúrate de actualizar la versión en `app.json` si es necesario:
```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

**Nota**: `versionCode` debe incrementarse en cada build nuevo que subas a Play Store.

## Comandos Útiles

```bash
# Ver información de tu proyecto EAS
eas project:info

# Cancelar un build en progreso
eas build:cancel

# Ver logs de un build específico
eas build:view [BUILD_ID]

# Listar todos los builds
eas build:list --platform android

# Generar APK para pruebas (no para Play Store)
eas build --platform android --profile production-apk
```

## Troubleshooting

### Si el build falla:

1. **Verifica las credenciales**:
```bash
eas credentials
```

2. **Limpia el cache**:
```bash
npm run clean:android
rm -rf node_modules
npm install
```

3. **Verifica que no haya errores de TypeScript**:
```bash
npm run lint
```

### Si necesitas generar nuevas credenciales:
```bash
eas credentials
```
Selecciona: Android → Production → Keystore → Generate new keystore

## Notas Importantes

- La primera vez que hagas un build, EAS te preguntará si quieres que genere las credenciales automáticamente. Di que SÍ.
- El build puede tardar 10-20 minutos.
- Play Store requiere AAB (no APK) para apps nuevas desde agosto 2021.
- Cada versión debe tener un `versionCode` mayor que la anterior.
- Asegúrate de remover todos los `console.log` de producción antes del build final.
