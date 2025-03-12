// app/game/ResistenciaNivel1Game.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import Cronometro from './Cronometro';
import { supabase } from '@/lib/supabaseClient';
import { updateAchievementProgress } from '@/lib/achievementsService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 800;

// Array de frames del corredor
const RUNNER_FRAMES = [
  require('../../assets/images/frames/0.gif'),
  require('../../assets/images/frames/1.gif'),
  require('../../assets/images/frames/2.gif'),
  require('../../assets/images/frames/3.gif'),
  require('../../assets/images/frames/4.gif'),
  require('../../assets/images/frames/5.gif'),
  require('../../assets/images/frames/6.gif'),
  require('../../assets/images/frames/7.gif'),
  require('../../assets/images/frames/8.gif'),
  require('../../assets/images/frames/9.gif'),
  require('../../assets/images/frames/10.gif'),
  require('../../assets/images/frames/11.gif'),
  require('../../assets/images/frames/12.gif'),
  require('../../assets/images/frames/13.gif'),
  require('../../assets/images/frames/14.gif'),
  require('../../assets/images/frames/15.gif'),
  require('../../assets/images/frames/16.gif'),
  require('../../assets/images/frames/17.gif'),
  require('../../assets/images/frames/18.gif'),
];

function AnimatedMap() {
  const mapX = useRef(new Animated.Value(0)).current;
  const [frameIndex, setFrameIndex] = useState(0);

  // Animar el mapa de 0 a -(MAP_WIDTH - SCREEN_WIDTH) en un bucle infinito
  useEffect(() => {
    const scrollLoop = () => {
      mapX.setValue(0);
      Animated.timing(mapX, {
        toValue: -(MAP_WIDTH - SCREEN_WIDTH),
        duration: 10000, // 10s
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) scrollLoop();
      });
    };
    scrollLoop();
  }, [mapX]);

  // Animar los frames del corredor cada 100ms, con un pequeño retraso inicial para evitar titileo
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    const delayTimeout = setTimeout(() => {
      animationInterval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % RUNNER_FRAMES.length);
      }, 100);
    }, 200); // Retraso de 200 ms

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <View style={styles.animatedMapContainer}>
      <Animated.View
        style={[
          styles.scrollingContainer,
          { transform: [{ translateX: mapX }] },
        ]}
      >
        <Image
          source={require('../../assets/images/bigMap3.jpg')}
          style={styles.mapImage}
        />
        <Image
          source={require('../../assets/images/bigMap3.jpg')}
          style={styles.mapImage}
        />
      </Animated.View>
      {/* Corredor animado */}
      <Image source={RUNNER_FRAMES[frameIndex]} style={styles.runner} />
    </View>
  );
}

export default function ResistenciaNivel1Game() {
  const [introVisible, setIntroVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [testStarted, setTestStarted] = useState(false);
  const [raceEnded, setRaceEnded] = useState(false);
  const [stillTime, setStillTime] = useState(0);
  const [finalWarning, setFinalWarning] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState(0);
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

  // Cuenta regresiva de 5s
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

  // Detección de inmovilidad con acelerómetro
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

  // Activar advertencia final si el usuario está inmóvil 2s
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

  // Decrementar advertencia y terminar juego
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

  // Nueva effect para actualizar logros cuando se termine el juego
// Actualización de logros cuando termina el juego
useEffect(() => {
  if (raceEnded) {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Para Resistencia (categoría "1"), se acumula el tiempo total de trote.
        updateAchievementProgress(user.id, '1', 1, finalTime, true);
      }
    })();
  }
}, [raceEnded, finalTime]);


  // Callback para el cronómetro
  const handleTimeChange = (timeInSeconds: number) => {
    if (!raceEnded) {
      setFinalTime(timeInSeconds);
    }
  };

  function formatTime(seconds: number): string {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
    if (hh > 0) {
      return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    } else {
      return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
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
          <AnimatedMap />
          <View style={styles.timerOverlay}>
            <Cronometro
              isRunning={testStarted && !raceEnded}
              onTimeChange={handleTimeChange}
            />
          </View>
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
  animatedMapContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  scrollingContainer: {
    flexDirection: 'row',
  },
  animatedMap: {
    position: 'absolute',
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
  mapImage: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    resizeMode: 'cover',
  },
  runner: {
    position: 'absolute',
    width: 175,
    height: 175,
    bottom: 80,
    left: SCREEN_WIDTH / 2 - 75,
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
