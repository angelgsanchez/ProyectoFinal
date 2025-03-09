import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

// Importa tu componente de cronómetro
import Cronometro from './Cronometro';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ResistenciaNivel1Game() {
  // ESTADOS PRINCIPALES
  const [introVisible, setIntroVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [testStarted, setTestStarted] = useState(false);
  const [raceEnded, setRaceEnded] = useState(false);

  const [stillTime, setStillTime] = useState(0);
  const [finalWarning, setFinalWarning] = useState<number | null>(null);

  // Guardar tiempo final para mostrarlo en pantalla final
  const [finalTime, setFinalTime] = useState(0);

  // Sonido para countdown
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Cargar sonido countdown.mp3
  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sonidos/countdown.mp3')
        );
        setSound(sound);
      } catch (error) {
        console.log('Error loading sound', error);
      }
    }
    loadSound();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  // Mensaje inicial de 2s
  useEffect(() => {
    if (introVisible) {
      const timer = setTimeout(() => {
        setIntroVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [introVisible]);

  // Cuenta regresiva
  useEffect(() => {
    if (!introVisible && !testStarted && countdown > 0) {
      // Reproduce sonido en cada tick
      if (sound) {
        (async () => {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && !status.isPlaying) {
            await sound.setPositionAsync(0);
            await sound.playAsync();
          }
        })();
      }
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !testStarted && !introVisible) {
      setTestStarted(true);
    }
  }, [introVisible, countdown, testStarted, sound]);

  // Acelerómetro: detecta inmovilidad
  useEffect(() => {
    if (testStarted && !raceEnded) {
      const subscription = Accelerometer.addListener((data) => {
        const totalAccel = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
        if (totalAccel < 1.2) {
          setStillTime((prev) => prev + 0.5);
        } else {
          // Si se mueve, reseteamos la advertencia
          setStillTime(0);
          if (finalWarning !== null) {
            setFinalWarning(null);
            if (sound) {
              sound.stopAsync();
            }
          }
        }
      });
      Accelerometer.setUpdateInterval(500);
      return () => subscription.remove();
    }
  }, [testStarted, raceEnded, finalWarning, sound]);

  // Si inmóvil 2s => finalWarning = 5
  useEffect(() => {
    if (stillTime >= 2 && finalWarning === null && !raceEnded && testStarted) {
      setFinalWarning(5);
      // Reproduce el sonido de advertencia una sola vez
      if (sound) {
        (async () => {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && !status.isPlaying) {
            await sound.setPositionAsync(0);
            await sound.playAsync();
          }
        })();
      }
    }
  }, [stillTime, finalWarning, raceEnded, testStarted, sound]);

  // Decrementa la advertencia
  useEffect(() => {
    let warningInterval: NodeJS.Timeout | null = null;
    if (finalWarning !== null && finalWarning > 0 && !raceEnded) {
      warningInterval = setInterval(() => {
        setFinalWarning((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (finalWarning === 0 && !raceEnded) {
      // Termina la carrera
      setRaceEnded(true);
    }
    return () => {
      if (warningInterval) clearInterval(warningInterval);
    };
  }, [finalWarning, raceEnded]);

  // Maneja el tiempo que viene del cronómetro
  const handleTimeChange = (timeInSeconds: number) => {
    if (!raceEnded) {
      setFinalTime(timeInSeconds);
    }
  };

  // Formato para mostrar el tiempo final
  function formatTime(seconds: number): string {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;

    if (hh > 0) {
      return `${hh.toString().padStart(2, '0')}:${mm
        .toString()
        .padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    } else {
      return `${mm.toString().padStart(2, '0')}:${ss
        .toString()
        .padStart(2, '0')}`;
    }
  }

  return (
    <View style={styles.container}>
      {/* Barra superior con botón de Volver */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {raceEnded ? (
        // Pantalla final
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>¡Carrera Terminada!</Text>
          <Text style={styles.resultText}>
            Tiempo activo: {formatTime(finalTime)}
          </Text>
        </View>
      ) : introVisible ? (
        <View style={styles.content}>
          <Text style={styles.title}>Comienza tu trote estático, ¡prepárate!</Text>
        </View>
      ) : !testStarted ? (
        <View style={styles.content}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      ) : (
        <>
          {/* Imagen de fondo (mapa) */}
          <Image
            source={require('../../assets/images/map.png')}
            style={styles.map}
          />
          {/* GIF del corredor, más grande y más arriba */}
          <Image
            source={require('../../assets/images/runner.gif')}
            style={styles.runner}
          />

          {/* Cronómetro encima del mapa, con letras negras y sombra */}
          <View style={styles.timerOverlay}>
            <Cronometro
              isRunning={testStarted && !raceEnded}
              onTimeChange={handleTimeChange}
            />
          </View>

          {/* Mensaje de advertencia */}
          {finalWarning !== null && (
            <View style={styles.overlayContainer}>
              <Text style={styles.warningText}>
                Continua no pares!!!
                {'\n'}
                {finalWarning}s restantes
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },

  // El mapa debe cubrir toda la pantalla
  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  // Corredor un poco más grande y más arriba
  runner: {
    width: 120,
    height: 120,
    position: 'absolute',
    bottom: 80,
    left: 30,
  },

  // Contenedor del cronómetro, encima del mapa
  timerOverlay: {
    position: 'absolute',
    top: 100, // Debajo de la barra superior
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 11,
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
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF4757',
  },

  overlayContainer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
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
