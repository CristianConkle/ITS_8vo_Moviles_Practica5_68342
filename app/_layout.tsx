import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'inactive' || state === 'background') {
        await AsyncStorage.removeItem('authToken');
        console.log('🔐 Token eliminado automáticamente al cerrar la app');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: 'Mis Notas' }} />
      <Stack.Screen name="create-note" options={{ title: 'Crear nueva nota' }} />
    </Stack>
  );
}
