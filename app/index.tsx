import { useEffect, useRef } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function HomePage() {
  const hasNavigated = useRef(false);

  console.log('🏠 HomePage rendered, hasNavigated:', hasNavigated.current);

  useEffect(() => {
    console.log('🏠 HomePage useEffect triggered');
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    console.log('🔐 Checking auth...');
    try {
      const token = await AsyncStorage.getItem("auth_token");
      console.log('🔐 Token found:', token ? 'YES' : 'NO');
      if (token) {
        console.log('➡️ Navigating to /dashboard');
        router.replace("/dashboard");
      } else {
        console.log('➡️ Navigating to /login');
        router.replace("/login");
      }
    } catch (error) {
      console.log('❌ Error checking auth, navigating to /login');
      router.replace("/login");
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
