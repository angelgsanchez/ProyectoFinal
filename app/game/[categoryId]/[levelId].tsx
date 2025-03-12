import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Importa tus componentes de introducción y de juego
import LevelIntro from '../LevelIntro';
import ResistenciaNivel1Game from '../ResistenciaNivel1Game';
import VelocidadNivel1Game from '../VelocidadNivel1Game';
import FuerzaNivel1Game from '../FuerzaNivel1Game';
import EquilibrioGame from '../EquilibrioGame';

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
    case '2': // Fuerza
      switch (levelId) {
        case '1':
          return {
            title: 'Nivel 1 - Fuerza',
            description:
              'En este minijuego de Fuerza, se cuentan tus sentadillas basadas en el movimiento del teléfono. Cuando bajes el dispositivo (simulando una sentadilla), se reproducirá la animación y se contará la repetición.',
            gameComponent: <FuerzaNivel1Game />,
          };
        default:
          return null;
      }
    case '3': // Velocidad
      switch (levelId) {
        case '1':
          return {
            title: 'Nivel 1 - Velocidad',
            description:
              'En este minijuego de Velocidad, deberás realizar saltos de tijera con el teléfono en la mano. Cada salto se contará y sonará un beep. ¡Tienes 30 segundos para lograr la mayor cantidad de repeticiones!',
            gameComponent: <VelocidadNivel1Game />,
          };
        default:
          return null;
      }
    case '4': // Equilibrio
      switch (levelId) {
        case '1':
          return {
            title: 'Nivel 1 - Equilibrio',
            description:
              'En este minijuego de Equilibrio, si te mueves, pierdes 1 vida y, al perder las 3 vidas, se acaba el tiempo. ¡Trata de llegar al mayor tiempo posible!',
            gameComponent: <EquilibrioGame />,
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
    // Aseguramos que se respete el área de la barra de notificaciones:
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
