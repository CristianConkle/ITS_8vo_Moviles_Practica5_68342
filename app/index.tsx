import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import useNotes from '../hooks/useNotes';
import { auth } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();

  /*
  // 🔐 Limpieza de token (TEMPORAL, solo para reiniciar app y forzar login)
  useFocusEffect(
    useCallback(() => {
      const resetToken = async () => {
        await AsyncStorage.removeItem('authToken');
        console.log('🧹 Token eliminado manualmente');
        router.replace('/login');
      };

      resetToken();
    }, [])
  );
  */

  // 🔒 Lógica real de autenticación y carga (esto se ejecutará normalmente después)
  useFocusEffect(
    useCallback(() => {
      const checkAuthAndLoad = async () => {
        const token = await auth.getToken();
        if (!token) {
          router.replace('/login');
          return;
        }

        try {
          await loadNotes();
        } catch (e) {
          console.warn('Token inválido o expirado. Cerrando sesión...');
          await auth.logout();
          router.replace('/login');
        }
      };
      checkAuthAndLoad();
    }, [loadNotes])
  );

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la nota');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>No hay notas creadas</Text>
        ) : (
          notes.map(note => (
            <Card key={note.id} style={styles.card}>
              <Card.Title title={note.titulo} titleStyle={styles.cardTitle} />
              <Card.Content>
                <Text numberOfLines={3} ellipsizeMode="tail" style={styles.cardContent}>
                  {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 200)}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <IconButton icon="pencil" size={24} onPress={() => handleEditNote(note.id)} style={styles.actionButton} />
                <IconButton icon="delete" size={24} onPress={() => handleDeleteNote(note.id)} style={styles.actionButton} />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-note')}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutFab}
        onPress={() => {
          Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Cerrar sesión',
              style: 'destructive',
              onPress: async () => {
                await auth.logout();
                router.replace('/login');
              }
            }
          ]);
        }}
      >
        <MaterialIcons name="logout" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    color: '#555',
    marginTop: 8,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  actionButton: {
    margin: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  logoutFab: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#d32f2f',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  }
});
