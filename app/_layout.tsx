import { Stack } from "expo-router";
import { useState } from "react";
import "../global.css";
import CustomSplashScreen from "../components/SplashScreen";


export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  if (!appReady) {
    return <CustomSplashScreen onFinish={() => setAppReady(true)} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default'
      }}
    >
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
      <Stack.Screen name="login/index" options={{ title: "Login" }} />
      <Stack.Screen name="dashboard/index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="productos/index" options={{ title: "Productos" }} />
      <Stack.Screen name="ventas/index" options={{ title: "Ventas" }} />
      <Stack.Screen name="compras/index" options={{ title: "Compras" }} />
      <Stack.Screen name="menu/index" options={{ title: "Menú" }} />
      <Stack.Screen name="configuracion/index" options={{ title: "Configuración" }} />
      <Stack.Screen name="notificacion/email" options={{ title: "Configuración Email" }} />
    </Stack>
  );
}