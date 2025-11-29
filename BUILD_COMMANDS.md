# 🚀 Comandos Rápidos para Build

## 📋 Requisitos Previos (Solo Primera Vez)

### 1. Verificar instalación de herramientas:
```bash
# Verificar Java
java -version

# Verificar Android SDK
echo $env:ANDROID_HOME

# Verificar ADB
adb version
```

### 2. Generar Keystore (SOLO UNA VEZ):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore kontrolx-release-key.keystore -alias kontrolx -keyalg RSA -keysize 2048 -validity 10000
```

**Mover keystore a:**
```
android/app/kontrolx-release-key.keystore
```

### 3. Crear gradle.properties:
Crear archivo: `android/gradle.properties`

```properties
MYAPP_RELEASE_STORE_FILE=kontrolx-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=kontrolx
MYAPP_RELEASE_STORE_PASSWORD=TU_PASSWORD_AQUI
MYAPP_RELEASE_KEY_PASSWORD=TU_PASSWORD_AQUI
```

---

## 🏗️ Proceso de Build (Cada Vez)

### Paso 1: Generar código nativo
```bash
npm run prebuild:android
```

**O manualmente:**
```bash
npx expo prebuild --platform android --clean
```

### Paso 2A: Generar AAB (Para Play Store) ⭐ RECOMENDADO
```bash
npm run build:aab
```

**O manualmente:**
```bash
cd android
gradlew.bat bundleRelease
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

### Paso 2B: Generar APK (Para distribución directa)
```bash
npm run build:apk
```

**O manualmente:**
```bash
cd android
gradlew.bat assembleRelease
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

---

## 🧪 Probar el APK

### Instalar en dispositivo conectado:
```bash
npm run install:release
```

**O manualmente:**
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Ver logs en tiempo real:
```bash
adb logcat | findstr "KontrolX"
```

---

## 🔧 Limpieza (Si hay errores)

### Limpiar build de Android:
```bash
npm run clean:android
```

**O manualmente:**
```bash
cd android
gradlew.bat clean
```

### Limpiar todo (node_modules + android):
```bash
rm -rf node_modules
rm -rf android
npm install
npm run prebuild:android
```

---

## 📦 Subir a Play Store

1. **Ir a:** [Google Play Console](https://play.google.com/console)
2. **Seleccionar:** Tu app
3. **Ir a:** Producción → Crear nueva versión
4. **Subir:** `app-release.aab`
5. **Completar:** Notas de la versión
6. **Enviar para revisión**

---

## ✅ Checklist Antes de Cada Build

- [ ] Incrementar `versionCode` en `android/app/build.gradle`
- [ ] Actualizar `version` en `app.json`
- [ ] Probar app en desarrollo (npm start)
- [ ] Verificar que no haya console.logs de debug
- [ ] Verificar URLs apuntan a producción
- [ ] Ejecutar `npm run prebuild:android`
- [ ] Ejecutar `npm run build:aab`
- [ ] Probar AAB/APK en dispositivo real

---

## 🐛 Solución de Problemas

### Error: "SDK location not found"
```bash
# Crear android/local.properties
echo "sdk.dir=C:\\Users\\TuUsuario\\AppData\\Local\\Android\\Sdk" > android/local.properties
```

### Error: "JAVA_HOME is not set"
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

### Error: "Execution failed for task ':app:bundleRelease'"
```bash
cd android
gradlew.bat clean
gradlew.bat bundleRelease
```

### App crashea al iniciar
```bash
# Ver logs
adb logcat | findstr "AndroidRuntime"
```

---

## 📊 Información de la App

- **Nombre:** KontrolX
- **Package:** com.angeljrcurtido.kontrolx
- **Version:** 1.0.1
- **VersionCode:** 2

---

## ⏱️ Tiempo Estimado

- **Primera vez (con configuración):** 2-3 horas
- **Builds subsecuentes:** 10-15 minutos
  - Prebuild: 3-5 min
  - Build AAB: 5-10 min
  - Test: 2-3 min

---

## 📞 Ayuda Adicional

- **Documentación completa:** Ver `docs/BUILD_ANDROID_LOCAL.md`
- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
