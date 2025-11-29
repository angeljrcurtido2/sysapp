# 📱 Guía: Generar Build Local para Play Store

Esta guía te ayudará a generar un **APK** o **AAB** de tu aplicación React Native/Expo de forma local, sin usar EAS Build.

## 📋 Prerrequisitos

### 1. Android Studio y SDK
- ✅ Android Studio instalado
- ✅ Android SDK (API 34 recomendado)
- ✅ Android SDK Build-Tools
- ✅ Android Emulator (opcional, para pruebas)

### 2. Java Development Kit (JDK)
- ✅ JDK 17 o superior instalado
- ✅ Variable de entorno `JAVA_HOME` configurada

### 3. Variables de Entorno

Verifica que tengas estas variables configuradas:

```bash
# Windows PowerShell
$env:ANDROID_HOME
$env:JAVA_HOME

# Linux/Mac
echo $ANDROID_HOME
echo $JAVA_HOME
```

Si no están configuradas, agrégalas:

**Windows:**
```powershell
# En PowerShell como Administrador
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\TuUsuario\AppData\Local\Android\Sdk', 'User')
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'User')
```

**Linux/Mac:**
```bash
# Agregar a ~/.bashrc o ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 🔑 Paso 1: Generar Keystore (Firma de la App)

Para publicar en Play Store, necesitas firmar tu app con una clave privada.

### Generar nueva keystore:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore kontrolx-release-key.keystore -alias kontrolx -keyalg RSA -keysize 2048 -validity 10000
```

**Información a proporcionar:**
- **Password del keystore**: (¡Guárdalo en lugar seguro!)
- **Nombre y apellido**: Tu nombre o nombre de la empresa
- **Unidad organizativa**: Desarrollo, IT, etc.
- **Organización**: Nombre de tu empresa
- **Ciudad**: Tu ciudad
- **Estado/Provincia**: Tu estado
- **Código de país**: PY (Paraguay)

**⚠️ MUY IMPORTANTE:**
- Guarda el archivo `.keystore` en un lugar seguro
- Anota el password en un gestor de contraseñas
- ¡Si pierdes esta keystore, NO podrás actualizar tu app en Play Store!

### Ubicar la keystore:

Mueve el archivo generado a:
```
c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp\android\app\kontrolx-release-key.keystore
```

## 🛠️ Paso 2: Configurar Gradle

### 2.1 Crear archivo de credenciales

Crea el archivo `android/gradle.properties` con:

```properties
MYAPP_RELEASE_STORE_FILE=kontrolx-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=kontrolx
MYAPP_RELEASE_STORE_PASSWORD=tu_password_keystore
MYAPP_RELEASE_KEY_PASSWORD=tu_password_keystore
```

**⚠️ NO SUBIR ESTE ARCHIVO A GIT**

Agrega a `.gitignore`:
```
# Keystores
*.keystore
*.jks
gradle.properties
```

### 2.2 Configurar build.gradle

Edita `android/app/build.gradle`:

```gradle
android {
    ...
    defaultConfig {
        applicationId "com.angeljrcurtido.kontrolx"
        minSdkVersion 23
        targetSdkVersion 34
        versionCode 2
        versionName "1.0.1"
    }

    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 📦 Paso 3: Prebuild (Generar carpeta android nativa)

Expo necesita generar el código nativo de Android:

```bash
cd c:\SIS_VENTAS_NEXT\migracion_app_cliente\sysapp
npx expo prebuild --platform android --clean
```

Esto creará/actualizará la carpeta `android/`.

## 🏗️ Paso 4: Generar el Build

### Opción A: Generar AAB (Android App Bundle) - Recomendado para Play Store

```bash
cd android
./gradlew bundleRelease
```

**Windows (PowerShell):**
```powershell
cd android
.\gradlew.bat bundleRelease
```

El AAB se generará en:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Opción B: Generar APK (Para distribución directa)

```bash
cd android
./gradlew assembleRelease
```

**Windows (PowerShell):**
```powershell
cd android
.\gradlew.bat assembleRelease
```

El APK se generará en:
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🧪 Paso 5: Probar el Build

### Instalar APK en dispositivo físico:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Verificar firma del AAB:

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

## 📤 Paso 6: Subir a Play Store

### 6.1 Ir a Google Play Console

1. Accede a [Google Play Console](https://play.google.com/console)
2. Selecciona tu aplicación
3. Ve a **Producción** > **Crear nueva versión**

### 6.2 Subir AAB

1. Haz click en **Subir**
2. Selecciona `app-release.aab`
3. Completa los detalles de la versión
4. Revisa y lanza

### 6.3 Información requerida (primera vez)

- Nombre de la app: **KontrolX**
- Descripción corta: (máximo 80 caracteres)
- Descripción completa: (máximo 4000 caracteres)
- Screenshots: Mínimo 2 (1080x1920 o similar)
- Icono: 512x512 px
- Banner: 1024x500 px (opcional)
- Categoría: Business / Productivity
- Clasificación de contenido
- Política de privacidad (URL)

## 🚀 Scripts NPM Útiles

Agrega a `package.json`:

```json
{
  "scripts": {
    "prebuild:android": "npx expo prebuild --platform android --clean",
    "build:aab": "cd android && ./gradlew bundleRelease",
    "build:apk": "cd android && ./gradlew assembleRelease",
    "clean:android": "cd android && ./gradlew clean",
    "install:release": "adb install android/app/build/outputs/apk/release/app-release.apk"
  }
}
```

**Uso:**
```bash
npm run prebuild:android
npm run build:aab
npm run install:release
```

## ⚙️ Configuración Adicional de app.json

Actualiza `app.json` para builds:

```json
{
  "expo": {
    "android": {
      "package": "com.angeljrcurtido.kontrolx",
      "versionCode": 2,
      "permissions": [],
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon2.png",
        "backgroundColor": "#38bdf8"
      }
    }
  }
}
```

## 🔧 Solución de Problemas Comunes

### Error: "SDK location not found"

Crea `android/local.properties`:
```properties
sdk.dir=C:\\Users\\TuUsuario\\AppData\\Local\\Android\\Sdk
```

### Error: "JAVA_HOME is not set"

```bash
# Windows
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

### Error: "Task ':app:bundleRelease' failed"

Limpia el proyecto:
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

### Error de memoria en Gradle

Edita `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.configureondemand=true
```

### App crashea al abrir

Verifica los permisos en `AndroidManifest.xml` y que todas las dependencias nativas estén correctamente configuradas.

## 📊 Verificación Final

Antes de subir a Play Store, verifica:

- ✅ App firmada correctamente
- ✅ versionCode incrementado
- ✅ Todos los permisos necesarios declarados
- ✅ Iconos y splash screen configurados
- ✅ App probada en dispositivo físico
- ✅ No hay logs de desarrollo visibles
- ✅ URLs apuntan a producción (no localhost)

## 📝 Checklist de Versiones

Antes de cada build nuevo:

1. ✅ Incrementar `versionCode` en `build.gradle`
2. ✅ Actualizar `version` en `app.json`
3. ✅ Generar nuevo changelog
4. ✅ Probar en dispositivo
5. ✅ Generar AAB firmado
6. ✅ Subir a Play Store

## 🔐 Seguridad

**NUNCA subas a Git:**
- ❌ `*.keystore` o `*.jks`
- ❌ `gradle.properties` con contraseñas
- ❌ Archivos de firma

**Backup seguro:**
- ✅ Guarda keystore en 3 lugares seguros
- ✅ Usa gestor de contraseñas
- ✅ Considera usar Google Play App Signing

## 📚 Referencias

- [Expo Bare Workflow](https://docs.expo.dev/bare/overview/)
- [React Native Publishing](https://reactnative.dev/docs/signed-apk-android)
- [Google Play Console](https://support.google.com/googleplay/android-developer)
- [Android Developer Guide](https://developer.android.com/studio/publish)

## 🎯 Próximos Pasos

1. Genera tu keystore
2. Configura gradle.properties
3. Ejecuta prebuild
4. Genera AAB
5. Sube a Play Store Console
6. ¡Espera la aprobación!

---

**Tiempo estimado del proceso:**
- Primera vez: 2-3 horas (configuración + aprendizaje)
- Builds subsecuentes: 10-15 minutos
