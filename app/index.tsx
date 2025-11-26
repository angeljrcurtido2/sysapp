import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function HomePage() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    } catch (error) {
      router.replace("/login");
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
