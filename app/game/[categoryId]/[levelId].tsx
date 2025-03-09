// app/game/[categoryId]/[levelId].tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Importa tu pantalla de introducción y la lógica del juego
import LevelIntro from '../LevelIntro'; // Ajusta la ruta si es necesario
import ResistenciaNivel1Game from '../ResistenciaNivel1Game'; // Ajusta la ruta según corresponda

export default function LevelScreen() {
  const { categoryId, levelId } = useLocalSearchParams();
  const router = useRouter();

  // Para este ejemplo, consideramos "1" como Resistencia y "1" como el Nivel 1
  const isResistenciaNivel1 = categoryId === '1' && levelId === '1';
  const [showIntro, setShowIntro] = useState(true);

  // Si no es Resistencia Nivel 1, mostramos un mensaje de "No implementado"
  if (!isResistenciaNivel1) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>Minijuego</Text>
          <Text style={styles.subtitle}>Categoría {categoryId} - Nivel {levelId}</Text>
          <Text style={styles.description}>
            No se ha implementado un minijuego para esta categoría y nivel.
          </Text>
        </View>
      </View>
    );
  }

  // Si es Resistencia Nivel 1, mostramos la pantalla de introducción o el juego según el estado.
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      {showIntro ? (
        <LevelIntro
          title="Nivel 1 - Resistencia"
          description="En este nivel deberás mantener tu trote estático sin detenerte. Trata de seguir en movimiento para obtener el mejor rendimiento. ¡Prepárate y comienza cuando estés listo!"
          onStart={() => setShowIntro(false)}
        />
      ) : (
        <ResistenciaNivel1Game />
      )}
    </View>
  );
}

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
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
