import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, 
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import Cronometro from './Cronometro';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ResistenciaNivel1Game() {
  const [introVisible, setIntroVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [testStarted, setTestStarted] = useState(false);
  const [raceEnded, setRaceEnded] = useState(false);

  const [stillTime, setStillTime] = useState(0);
  const [finalWarning, setFinalWarning] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState(0);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Carga sonido
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
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Mensaje inicial 2s
  useEffect(() => {
    if (introVisible) {
      const timer = setTimeout(() => {
        setIntroVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [introVisible]);

  // Cuenta regresiva 5s
  useEffect(() => {
    if (!introVisible && !testStarted && countdown > 0) {
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

  // Detección de inmovilidad
  useEffect(() => {
    if (testStarted && !raceEnded) {
      const subscription = Accelerometer.addListener((data) => {
        const totalAccel = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
        if (totalAccel < 1.2) {
          setStillTime((prev) => prev + 0.5);
        } else {
          setStillTime(0);
          if (finalWarning !== null) {
            setFinalWarning(null);
            sound?.stopAsync();
          }
        }
      });
      Accelerometer.setUpdateInterval(500);
      return () => subscription.remove();
    }
  }, [testStarted, raceEnded, finalWarning, sound]);

  // Activa advertencia final si inmóvil 2s
  useEffect(() => {
    if (stillTime >= 2 && finalWarning === null && !raceEnded && testStarted) {
      setFinalWarning(5);
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

  // Decrementa advertencia
  useEffect(() => {
    let warningInterval: NodeJS.Timeout | null = null;
    if (finalWarning !== null && finalWarning > 0 && !raceEnded) {
      warningInterval = setInterval(() => {
        setFinalWarning((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (finalWarning === 0 && !raceEnded) {
      setRaceEnded(true);
    }
    return () => {
      if (warningInterval) clearInterval(warningInterval);
    };
  }, [finalWarning, raceEnded]);

  // Recibir tiempo del cronómetro
  const handleTimeChange = (timeInSeconds: number) => {
    if (!raceEnded) {
      setFinalTime(timeInSeconds);
    }
  };

  // Formatear tiempo final
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
    <SafeAreaView style={styles.safeArea}>
      {raceEnded ? (
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
          {/* Mapa de fondo */}
          <Image
            source={require('../../assets/images/map.png')}
            style={styles.map}
          />
          {/* Corredor */}
          <Image
            source={require('../../assets/images/runner.gif')}
            style={styles.runner}
          />

          {/* Cronómetro en overlay */}
          <View style={styles.timerOverlay}>
            <Cronometro
              isRunning={testStarted && !raceEnded}
              onTimeChange={handleTimeChange}
            />
          </View>

          {/* Advertencia */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  // Mapa a pantalla completa DENTRO del safe area
  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT, 
    resizeMode: 'cover',
  },
  runner: {
    width: 120,
    height: 120,
    position: 'absolute',
    bottom: 80,
    left: 30,
  },
  timerOverlay: {
    position: 'absolute',
    top: 100,
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
