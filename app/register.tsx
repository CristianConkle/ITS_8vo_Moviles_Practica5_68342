import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo válido');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Contraseña muy corta', 'Debe tener al menos 8 caracteres');
      return;
    }

    try {
      await auth.register(email, password);
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error al registrar', 'No se pudo crear la cuenta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: '#111', // fondo tipo consola
    },
    title: {
      fontSize: 24,
      fontWeight: '900',
      marginBottom: 24,
      textAlign: 'center',
      color: '#33ff57',
      letterSpacing: 2,
      textTransform: 'uppercase',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 2,
    },
    input: {
      backgroundColor: '#222',
      borderRadius: 2,
      padding: 12,
      marginBottom: 16,
      fontSize: 14,
      color: '#aaa',
      borderWidth: 2,
      borderColor: '#33ff57',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#33ff57',
      padding: 14,
      borderRadius: 2,
      alignItems: 'center',
      marginTop: 10,
      borderWidth: 2,
      borderColor: '#0f0',
    },
    buttonText: {
      color: '#111',
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    linkText: {
      marginTop: 24,
      textAlign: 'center',
      color: '#aaa',
      fontSize: 12,
      fontWeight: '600',
      textDecorationLine: 'underline',
    }
  });
  