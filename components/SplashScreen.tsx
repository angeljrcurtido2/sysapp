import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

interface SplashScreenProps {
  onFinish: () => void;
}

// Mantener el splash nativo visible mientras cargamos
SplashScreen.preventAutoHideAsync();

export default function CustomSplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Simular carga de datos (puedes ajustar el tiempo)
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Spinner circular grande */}
        <ActivityIndicator
          size={80}
          color="#ffffff"
          style={styles.spinner}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38bdf8', // Color celeste
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    transform: [{ scale: 1.2 }],
  },
});
