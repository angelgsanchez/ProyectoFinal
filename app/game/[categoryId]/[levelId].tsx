// app/game/[categoryId]/[levelId].tsx

//angel yo
import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Importa tus componentes de introducción y de juego
import LevelIntro from '../LevelIntro';
import ResistenciaNivel1Game from '../ResistenciaNivel1Game';
import VelocidadNivel1Game from '../VelocidadNivel1Game';

function getGameInfo(categoryId: string, levelId: string) {
  switch (categoryId) {
    case '1': // Resistencia
      switch (levelId) {
        case '1':
          return {
            title: 'Nivel 1 - Resistencia',
            description:
              'En este nivel deberás mantener tu trote estático sin detenerte. Trata de seguir en movimiento para obtener el mejor rendimiento. ¡Prepárate y comienza cuando estés listo!',
            gameComponent: <ResistenciaNivel1Game />,
          };
        default:
          return null;
      }
    case '5': // Velocidad
      switch (levelId) {
        case '1':
          return {
            title: 'Nivel 1 - Velocidad',
            description:
              'En este minijuego de velocidad, deberás realizar saltos de tijera con el teléfono en la mano. Cada salto se contará y sonará un beep. ¡Tienes 30 segundos para lograr la mayor cantidad de repeticiones!',
            gameComponent: <VelocidadNivel1Game />,
          };
        default:
          return null;
      }
    default:
      return null;
  }
}

export default function LevelScreen() {
  const { categoryId, levelId } = useLocalSearchParams();
  const router = useRouter();

  const gameInfo = getGameInfo(categoryId as string, levelId as string);
  const [showIntro, setShowIntro] = useState(true);

  if (!gameInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      {showIntro ? (
        <LevelIntro
          title={gameInfo.title}
          description={gameInfo.description}
          onStart={() => setShowIntro(false)}
        />
      ) : (
        gameInfo.gameComponent
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10, // Separa un poco del área de notificaciones
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
