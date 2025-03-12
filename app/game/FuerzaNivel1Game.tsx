// app/components/FuerzaNivel1Game.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabaseClient';
import { updateAchievementProgress } from '@/lib/achievementsService';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Array de frames para la animación de sentadillas (6 frames: 0-2 para bajada y 3-5 para subida)
const SQUAT_FRAMES = [
  require('../../assets/images/sentadilla/0.gif'),
  require('../../assets/images/sentadilla/1.gif'),
  require('../../assets/images/sentadilla/2.gif'),
  require('../../assets/images/sentadilla/3.gif'),
  require('../../assets/images/sentadilla/4.gif'),
  require('../../assets/images/sentadilla/5.gif'),
];

export default function FuerzaNivel1Game() {
  const router = useRouter();

  // Estado para el índice del frame actual
  const [frameIndex, setFrameIndex] = useState(0);
  // Contador de repeticiones
  const [repCount, setRepCount] = useState(0);
  // Estado para controlar si se está animando (para evitar toques simultáneos)
  const [animating, setAnimating] = useState(false);
  // Estado para saber si el juego ha finalizado
  const [gameEnded, setGameEnded] = useState(false);

  // Estados para la detección del movimiento (usando acelerómetro)
  const [baseline, setBaseline] = useState<number | null>(null);
  const [isDown, setIsDown] = useState(false);
  const DELTA_THRESHOLD = 0.16; // Ajusta este umbral según tus pruebas

  // Referencia para el intervalo de animación
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para reproducir la animación completa de sentadilla
  const startAnimation = () => {
    if (animating || gameEnded) return;
    setAnimating(true);
    setFrameIndex(0);
    let step = 0;
    const delayTimeout = setTimeout(() => {
      animationIntervalRef.current = setInterval(() => {
        step++;
        if (step <= 5) {
          setFrameIndex(step);
        } else {
          clearInterval(animationIntervalRef.current!);
          setAnimating(false);
          setFrameIndex(0); // Regresa a la pose inicial
          setRepCount((prev) => prev + 1);
        }
      }, 150);
    }, 200); // Retraso de 200 ms
    return () => clearTimeout(delayTimeout);
  };

  // Lógica de acelerómetro para detectar movimiento
  useEffect(() => {
    const subscription = Accelerometer.addListener((data) => {
      const yValue = data.y;
      if (baseline === null) {
        setBaseline(yValue);
        return;
      }
      // Detecta bajada: cuando el valor de Y es menor que baseline - DELTA_THRESHOLD
      if (!isDown && yValue < baseline - DELTA_THRESHOLD) {
        setIsDown(true);
      }
      // Detecta subida: cuando el valor vuelve a acercarse a baseline (por encima de baseline - DELTA_THRESHOLD/2)
      else if (isDown && yValue > baseline - DELTA_THRESHOLD / 2) {
        if (!animating && !gameEnded) {
          startAnimation();
        }
        setIsDown(false);
      }
    });
    Accelerometer.setUpdateInterval(200);
    return () => subscription.remove();
  }, [baseline, isDown, animating, gameEnded]);

  // Función para finalizar el juego
  const endGame = () => {
    setGameEnded(true);
  };

  // Cuando el juego finaliza, actualizar el logro en Supabase
  useEffect(() => {
    if (gameEnded) {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Categoría "2" para Fuerza, nivel 1, valor acumulativo
          updateAchievementProgress(user.id, '2', 1, repCount, true);
        }
      })();
    }
  }, [gameEnded, repCount]);

  // Pantalla final: se muestra cuando el usuario presiona "Finalizar"
  if (gameEnded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>¡Juego Finalizado!</Text>
          <Text style={styles.resultText}>Repeticiones: {repCount}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={() => router.back()}>
            <Text style={styles.restartButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Mapa de fondo */}
      <Image
        source={require('../../assets/images/map3.jpeg')}
        style={styles.background}
      />
      {/* Barra superior con contador y botón "Finalizar" */}
      <View style={styles.topBar}>
        <Text style={styles.counterText}>Repeticiones: {repCount}</Text>
        <TouchableOpacity style={styles.endButton} onPress={endGame}>
          <Text style={styles.endButtonText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
      {/* Área principal para detectar toques */}
      <TouchableWithoutFeedback onPress={startAnimation}>
        <View style={styles.container}>
          <Text style={styles.title}>Sentadillas</Text>
          <Image source={SQUAT_FRAMES[frameIndex]} style={styles.character} />
          <Text style={styles.hint}>Toca la pantalla para realizar la sentadilla</Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  background: {
    position: 'absolute',
    width: SCREEN_W,
    height: SCREEN_H,
    resizeMode: 'cover',
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  endButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 11,
  },
  endButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    position: 'absolute',
    top: 70,
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
  },
  character: {
    position: 'absolute',
    bottom: 25, // Ubica al personaje en la "carretera" del fondo
    width: 300,
    height: 300,
    resizeMode: 'contain',
    left: SCREEN_W / 2 - 125,
  },
  hint: {
    position: 'absolute',
    bottom: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 24,
    color: '#FF4757',
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
  },
  restartButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  animatedMapContainer: {
    width: SCREEN_W,
    height: SCREEN_H,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  scrollingContainer: {
    flexDirection: 'row',
  },
  timerOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 11,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    padding: 16,
  },
  warningText: {
    fontSize: 32,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
