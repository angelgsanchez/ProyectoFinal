// app/game/EquilibrioGame.tsx
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Cronometro from './Cronometro'; // Asegúrate de que la ruta sea correcta
import { useRouter } from 'expo-router';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const EQUILIBRIO_FRAMES = [
    require('../../assets/images/equilibrio/0.gif'),
    require('../../assets/images/equilibrio/1.gif'),
    require('../../assets/images/equilibrio/2.gif'),
    require('../../assets/images/equilibrio/3.gif'),
    require('../../assets/images/equilibrio/4.gif'),
    require('../../assets/images/equilibrio/5.gif'),
    require('../../assets/images/equilibrio/6.gif'),
    require('../../assets/images/equilibrio/7.gif'),
    require('../../assets/images/equilibrio/8.gif'),
    require('../../assets/images/equilibrio/9.gif'),
    require('../../assets/images/equilibrio/10.gif'),
    require('../../assets/images/equilibrio/11.gif'),
    require('../../assets/images/equilibrio/12.gif'),
    require('../../assets/images/equilibrio/13.gif'),
    require('../../assets/images/equilibrio/14.gif'),
    require('../../assets/images/equilibrio/15.gif'),
    require('../../assets/images/equilibrio/16.gif'),
    require('../../assets/images/equilibrio/17.gif'),
    require('../../assets/images/equilibrio/18.gif'),
    require('../../assets/images/equilibrio/19.gif'),
    require('../../assets/images/equilibrio/20.gif'),
    require('../../assets/images/equilibrio/21.gif'),
    require('../../assets/images/equilibrio/22.gif'),
    require('../../assets/images/equilibrio/23.gif'),
    require('../../assets/images/equilibrio/24.gif'),
    require('../../assets/images/equilibrio/25.gif'),
    require('../../assets/images/equilibrio/26.gif'),
    require('../../assets/images/equilibrio/27.gif'),
    require('../../assets/images/equilibrio/28.gif'),
    require('../../assets/images/equilibrio/29.gif'),
    require('../../assets/images/equilibrio/30.gif'),
    require('../../assets/images/equilibrio/31.gif'),
    require('../../assets/images/equilibrio/32.gif'),
    require('../../assets/images/equilibrio/33.gif'),
    require('../../assets/images/equilibrio/34.gif'),
    require('../../assets/images/equilibrio/35.gif'),
    require('../../assets/images/equilibrio/36.gif'),
    require('../../assets/images/equilibrio/37.gif'),
    require('../../assets/images/equilibrio/38.gif'),
    require('../../assets/images/equilibrio/39.gif'),
    require('../../assets/images/equilibrio/40.gif'),
    require('../../assets/images/equilibrio/41.gif'),
    require('../../assets/images/equilibrio/42.gif'),
    require('../../assets/images/equilibrio/43.gif'),
    require('../../assets/images/equilibrio/44.gif'),
    require('../../assets/images/equilibrio/45.gif'),
    require('../../assets/images/equilibrio/46.gif'),
    require('../../assets/images/equilibrio/47.gif'),
    require('../../assets/images/equilibrio/48.gif'),
    require('../../assets/images/equilibrio/49.gif'),
    require('../../assets/images/equilibrio/50.gif'),
    require('../../assets/images/equilibrio/51.gif'),
    require('../../assets/images/equilibrio/52.gif'),
    require('../../assets/images/equilibrio/53.gif'),
    require('../../assets/images/equilibrio/54.gif'),
    require('../../assets/images/equilibrio/55.gif'),
    require('../../assets/images/equilibrio/56.gif'),
    require('../../assets/images/equilibrio/57.gif'),
    require('../../assets/images/equilibrio/58.gif'),
    require('../../assets/images/equilibrio/59.gif'),
    require('../../assets/images/equilibrio/60.gif'),
    require('../../assets/images/equilibrio/61.gif'),
    require('../../assets/images/equilibrio/62.gif'),
    require('../../assets/images/equilibrio/63.gif'),
    require('../../assets/images/equilibrio/64.gif'),
    require('../../assets/images/equilibrio/65.gif'),
    require('../../assets/images/equilibrio/66.gif'),
    require('../../assets/images/equilibrio/67.gif'),
    require('../../assets/images/equilibrio/68.gif'),
    require('../../assets/images/equilibrio/69.gif'),
    require('../../assets/images/equilibrio/70.gif'),
    require('../../assets/images/equilibrio/71.gif'),
    require('../../assets/images/equilibrio/72.gif'),
    require('../../assets/images/equilibrio/73.gif'),
    require('../../assets/images/equilibrio/74.gif'),
    require('../../assets/images/equilibrio/75.gif'),
    require('../../assets/images/equilibrio/76.gif'),
    require('../../assets/images/equilibrio/77.gif'),
    require('../../assets/images/equilibrio/78.gif'),
    require('../../assets/images/equilibrio/79.gif'),
    require('../../assets/images/equilibrio/80.gif'),
    require('../../assets/images/equilibrio/81.gif'),
    require('../../assets/images/equilibrio/82.gif'),
    require('../../assets/images/equilibrio/83.gif'),
    require('../../assets/images/equilibrio/84.gif'),
    require('../../assets/images/equilibrio/85.gif'),
    require('../../assets/images/equilibrio/86.gif'),
    require('../../assets/images/equilibrio/87.gif'),
    require('../../assets/images/equilibrio/88.gif'),
    require('../../assets/images/equilibrio/89.gif'),
    require('../../assets/images/equilibrio/90.gif'),
    require('../../assets/images/equilibrio/91.gif'),
    require('../../assets/images/equilibrio/92.gif'),
    require('../../assets/images/equilibrio/93.gif'),
    require('../../assets/images/equilibrio/94.gif'),
    require('../../assets/images/equilibrio/95.gif'),
    require('../../assets/images/equilibrio/96.gif'),
    require('../../assets/images/equilibrio/97.gif'),
    require('../../assets/images/equilibrio/98.gif'),
    require('../../assets/images/equilibrio/99.gif'),
    require('../../assets/images/equilibrio/100.gif'),
  ];
  
export default function EquilibrioGame() {
  const router = useRouter();

  // Estados del juego
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  // Configuración del acelerómetro para detectar movimiento
  const [cooldown, setCooldown] = useState(false);

  // Lógica del acelerómetro: si el total de aceleración supera el umbral, descontar una vida
  useEffect(() => {
    const subscription = Accelerometer.addListener((data) => {
      const totalAccel = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      const movementThreshold = 1; // Ajusta según pruebas
      if (totalAccel > movementThreshold && !cooldown) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
        setCooldown(true);
        setTimeout(() => setCooldown(false), 2000); // Cooldown de 2s para evitar múltiples detecciones rápidas
      }
    });
    Accelerometer.setUpdateInterval(1000);
    return () => subscription.remove();
  }, [cooldown]);

  // Animación del personaje (puedes ajustar esta parte según la lógica deseada)
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    if (!gameOver) {
      animationInterval = setInterval(() => {
        // En lugar de ciclar solo de 0 a 15, cicla de 0 a 100
        setFrameIndex((prev) => (prev + 1) % 101);
      }, 50);
    }
    return () => clearInterval(animationInterval);
  }, [gameOver]);
  

  // Callback para actualizar el tiempo (Cronometro)
  const handleTimeChange = (seconds: number) => {
    setTime(seconds);
  };

  // Pantalla final: se muestra cuando se agotan las vidas
  if (gameOver) {
    return (
      <SafeAreaView style={styles.finalSafeArea}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>¡Juego Finalizado!</Text>
          <Text style={styles.resultText}>Tiempo sin moverte: {time} s</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Mapa de fondo */}
      <Image
        source={require('../../assets/images/map4.png')}
        style={styles.background}
      />
      {/* Barra superior con vidas y cronómetro */}
      <View style={styles.topBar}>
        <Text style={styles.livesText}>Vidas: {lives}</Text>
        {/* Se integra el componente Cronometro */}
        <Cronometro isRunning={!gameOver} onTimeChange={handleTimeChange} />
      </View>
      {/* Animación del personaje */}
      <View style={styles.animationContainer}>
        <Image
          source={EQUILIBRIO_FRAMES[frameIndex]}
          style={styles.character}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    width: SCREEN_W,
    height: SCREEN_H - 50,
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
   
  },
  
  livesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    position: 'absolute',
    bottom: 70,
    width: 500,
    height: 500,
    resizeMode: 'contain',
    left: SCREEN_W / 2 - 400, 
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
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
  },
  backButtonText: {
    
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
