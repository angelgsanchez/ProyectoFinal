// app/game/VelocidadNivel1Game.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabaseClient';
import { updateAchievementProgress } from '@/lib/achievementsService';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Umbral para detectar un salto (ajusta este valor según pruebas)
const JUMP_THRESHOLD = 2.5;

// Array de frames del corredor (0.gif a 13.gif)
const RUNNER_FRAMES = [
  require('../../assets/images/velocidad/0.gif'),
  require('../../assets/images/velocidad/1.gif'),
  require('../../assets/images/velocidad/2.gif'),
  require('../../assets/images/velocidad/3.gif'),
  require('../../assets/images/velocidad/4.gif'),
  require('../../assets/images/velocidad/5.gif'),
  require('../../assets/images/velocidad/6.gif'),
  require('../../assets/images/velocidad/7.gif'),
  require('../../assets/images/velocidad/8.gif'),
  require('../../assets/images/velocidad/9.gif'),
  require('../../assets/images/velocidad/10.gif'),
  require('../../assets/images/velocidad/11.gif'),
  require('../../assets/images/velocidad/12.gif'),
  require('../../assets/images/velocidad/13.gif'),
];

export default function VelocidadNivel1Game() {
  // Estado del juego
  const [testStarted] = useState(true); // Asumimos que el juego inicia al cargar
  const [raceEnded, setRaceEnded] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [canCount, setCanCount] = useState(true);
  const [soundBeep, setSoundBeep] = useState<Audio.Sound | null>(null);

  // Cargar el sonido beep.mp3
  useEffect(() => {
    async function loadBeep() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/images/velocidad/beep.mp3')
        );
        setSoundBeep(sound);
      } catch (error) {
        console.log('Error loading beep sound:', error);
      }
    }
    loadBeep();
    return () => {
      if (soundBeep) soundBeep.unloadAsync();
    };
  }, []);

  // Animar los frames del corredor cada 100ms con un pequeño retraso para evitar titileo
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    const delayTimeout = setTimeout(() => {
      animationInterval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % RUNNER_FRAMES.length);
      }, 100);
    }, 200);
    return () => {
      clearTimeout(delayTimeout);
      clearInterval(animationInterval);
    };
  }, []);

  // Detección de saltos mediante acelerómetro
  useEffect(() => {
    if (testStarted && !raceEnded) {
      const subscription = Accelerometer.addListener((data) => {
        const totalAccel = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
        if (totalAccel > JUMP_THRESHOLD && canCount) {
          setRepCount((prev) => prev + 1);
          setCanCount(false);
          if (soundBeep) {
            (async () => {
              const status = await soundBeep.getStatusAsync();
              if (status.isLoaded) {
                await soundBeep.setPositionAsync(0);
                await soundBeep.playAsync();
              }
            })();
          }
          // Cooldown de 1 segundo para evitar múltiples conteos rápidos
          setTimeout(() => setCanCount(true), 1000);
        }
      });
      Accelerometer.setUpdateInterval(100);
      return () => subscription.remove();
    }
  }, [testStarted, raceEnded, canCount, soundBeep]);

  // Al finalizar el juego (por ejemplo, cuando se acaben los 30 seg) se actualiza el logro en Supabase.
  // En este ejemplo, usamos el repCount para la actualización.
  useEffect(() => {
    if (raceEnded) {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Para Velocidad (categoría "3"), el logro no es acumulativo
          updateAchievementProgress(user.id, '3', 1, repCount, false);
        }
      })();
    }
  }, [raceEnded, repCount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {raceEnded ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>¡Prueba Terminada!</Text>
          <Text style={styles.resultText}>Repeticiones: {repCount}</Text>
        </View>
      ) : (
        <>
          {/* Fondo */}
          <Image
            source={require('../../assets/images/velocidadBackground.jpg')}
            style={styles.background}
          />
          {/* Contador de repeticiones */}
          <View style={styles.repCounterOverlay}>
            <Text style={styles.repCounterText}>Reps: {repCount}</Text>
          </View>
          {/* Corredor animado */}
          <Image
            source={RUNNER_FRAMES[frameIndex]}
            style={styles.runner}
          />
        </>
      )}
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
  repCounterOverlay: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 11,
  },
  repCounterText: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  runner: {
    position: 'absolute',
    width: 300,
    height: 300,
    bottom: 50,
    left: SCREEN_W / 2 - 125,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
