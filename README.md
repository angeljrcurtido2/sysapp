# KontrolX - Sistema de Ventas

Aplicación móvil de sistema de ventas desarrollada con Expo y React Native.

## Características Principales

- Sistema de gestión de clientes
- Gestión de productos y categorías
- Registro de ventas y movimientos
- Proveedores y facturación
- Dashboard con métricas
- **Sistema de Chat con IA para registro de ingresos**

## Sistema de Chat con IA

La aplicación incluye un sistema de chat inteligente que permite registrar ingresos mediante comandos de texto en lenguaje natural procesados con IA.

Para más información, consulta la [documentación del sistema de chat](CHAT_SYSTEM_README.md).

## Instalación

1. Instalar dependencias

   ```bash
   npm install
   ```

2. Configurar variables de entorno

   Copia el archivo `.env.example` a `.env` y configura las variables necesarias.

3. Iniciar la aplicación

   ```bash
   npx expo start
   ```

## Desarrollo

En el output de Expo, encontrarás opciones para abrir la app en:

- [Build de desarrollo](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

El proyecto usa [file-based routing](https://docs.expo.dev/router/introduction) con expo-router.

## Estructura del Proyecto

```
sysapp/
├── app/              # Rutas y pantallas de la app
├── components/       # Componentes reutilizables
├── hooks/           # Custom hooks
├── services/        # Servicios API
├── store/           # Estado global (Zustand)
├── utils/           # Utilidades
├── lib/             # Configuraciones (axios, etc.)
└── ui/              # Componentes UI base
```

## Documentación Adicional

- [Sistema de Chat con IA](CHAT_SYSTEM_README.md)
- [Guía de Implementación](GUIA_IMPLEMENTACION.md)
- [Estructura del Proyecto](ESTRUCTURA_CORREGIDA.md)
- [Configuración](CONFIGURACION.md)

## Tecnologías

- **Expo** - Framework de desarrollo
- **React Native** - UI móvil
- **TypeScript** - Tipado estático
- **Zustand** - Gestión de estado
- **Axios** - Cliente HTTP
- **NativeWind** - Estilos con Tailwind CSS
- **Expo Router** - Navegación

## Scripts Disponibles

- `npm start` - Iniciar servidor de desarrollo
- `npm run android` - Ejecutar en Android
- `npm run ios` - Ejecutar en iOS
- `npm run web` - Ejecutar en web
- `npm run lint` - Ejecutar linter

## Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Licencia

Proyecto privado - Todos los derechos reservados
