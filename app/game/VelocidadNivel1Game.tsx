// app/game/VelocidadNivel1Game.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import Cronometro from './Cronometro';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Umbral para detectar un salto (valor a calibrar)
const JUMP_THRESHOLD = 2.5;

// Array de frames del corredor (suponiendo que tienes 14 imágenes, de 0.gif a 13.gif)
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
  // Eliminamos la lógica de intro porque ya se muestra en el archivo dinámico ([levelId].tsx)
  // Estados del juego
  const [testStarted, setTestStarted] = useState(true); // Asumimos que al cargar, el juego ya está iniciado
  const [raceEnded, setRaceEnded] = useState(false);
  const [gameTime, setGameTime] = useState(30); // 30 segundos de prueba
  const [repCount, setRepCount] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  // Estado para animar el runner
  const [frameIndex, setFrameIndex] = useState(0);

  // Estado para evitar conteos dobles (cooldown)
  const [canCount, setCanCount] = useState(true);

  // Sonido para beep en cada salto
  const [soundBeep, setSoundBeep] = useState<Audio.Sound | null>(null);

  // Cargar el sonido beep.mp3
  useEffect(() => {
    async function loadBeep() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sonidos/beep.mp3')
        );
        setSoundBeep(sound);
      } catch (error) {
        console.log('Error loading beep sound', error);
      }
    }
    loadBeep();
    return () => {
      if (soundBeep) soundBeep.unloadAsync();
    };
  }, []);

  // Animar los frames del corredor cada 100ms
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    const delayTimeout = setTimeout(() => {
      animationInterval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % RUNNER_FRAMES.length);
      }, 100);
    }, 200); // Retraso de 200 ms (ajusta según lo necesites)
    
    return () => {
      clearTimeout(delayTimeout);
      clearInterval(animationInterval);
    };
  }, []);
  

  // Cronómetro de cuenta regresiva de 30 seg
  useEffect(() => {
    if (testStarted && !raceEnded && gameTime > 0) {
      const timer = setTimeout(() => {
        setGameTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameTime === 0 && testStarted) {
      setRaceEnded(true);
    }
  }, [testStarted, gameTime, raceEnded]);

  // Detección de saltos con acelerómetro
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
          setTimeout(() => setCanCount(true), 1000); // Cooldown de 1 segundo
        }
      });
      Accelerometer.setUpdateInterval(100);
      return () => subscription.remove();
    }
  }, [testStarted, raceEnded, canCount, soundBeep]);

  // Recibir tiempo del cronómetro
  const handleTimeChange = (timeInSeconds: number) => {
    if (!raceEnded) {
      setFinalTime(30 - timeInSeconds);
    }
  };

  // Formatear tiempo (MM:SS)
  function formatTime(seconds: number): string {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {raceEnded ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>¡Prueba Terminada!</Text>
          <Text style={styles.resultText}>Tiempo: {formatTime(finalTime)}</Text>
          <Text style={styles.resultText}>Repeticiones: {repCount}</Text>
        </View>
      ) : (
        <>
          {/* Fondo */}
          <Image
            source={require('../../assets/images/velocidadBackground.jpg')}
            style={styles.background}
          />
          {/* Cronómetro en overlay */}
          <View style={styles.timerOverlay}>
            <Cronometro isRunning={testStarted && !raceEnded} onTimeChange={handleTimeChange} />
          </View>
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
  timerOverlay: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 11,
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
    width: 300, // Más grande
    height: 300, // Más grande
    bottom: 50,
    left: SCREEN_W / 2 - 125, // Centrado (250/2 = 125)
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
