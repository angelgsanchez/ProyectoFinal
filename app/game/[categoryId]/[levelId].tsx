// app/game/[categoryId]/[levelId].tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Importa tu componente con la lógica del nivel
import ResistenciaNivel1Game from '../ResistenciaNivel1Game';
// Ajusta la ruta según dónde hayas colocado el archivo

export default function LevelScreen() {
  const { categoryId, levelId } = useLocalSearchParams();
  const router = useRouter();

  // Si es categoría 1, nivel 1 => mostrar ResistenciaNivel1Game
  if (categoryId === '1' && levelId === '1') {
    return <ResistenciaNivel1Game />;
  }

  // Caso contrario => "No implementado"
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Minijuego</Text>
        <Text style={styles.subtitle}>
          Categoría {categoryId} - Nivel {levelId}
        </Text>
        <Text style={styles.description}>
          No se ha implementado un minijuego para esta categoría y nivel.
        </Text>
      </View>
    </View>
  );
}

// Estilos minimalistas
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
