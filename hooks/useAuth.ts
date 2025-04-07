// hooks/useAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export async function login(username: string, password: string) {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
    id: 0,
    roles: []
  });

  const token = response.data.token;
  console.log('🟢 Token recibido al iniciar sesión:', token);

  await AsyncStorage.setItem('token', token);
  return token;
}

export async function register(username: string, password: string) {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    password,
    id: 0,
    roles: []
  });

  const token = response.data.token;
  console.log('🧪 Token recibido al registrarse:', token);

  await AsyncStorage.setItem('token', token);
  return token;
}

export async function getToken() {
  const token = await AsyncStorage.getItem('token');
  console.log('📦 Token actual desde AsyncStorage:', token);
  return token;
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  console.log('🔒 Sesión cerrada, token eliminado');
}
