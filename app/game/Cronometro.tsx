// app/game/Cronometro.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface CronometroProps {
  isRunning: boolean;                     // true para iniciar, false para pausar/detener
  onTimeChange?: (time: number) => void;  // callback para notificar el tiempo actual en segundos
}

export default function Cronometro({ isRunning, onTimeChange }: CronometroProps) {
  const [seconds, setSeconds] = useState(0);
  const [beepSound, setBeepSound] = useState<Audio.Sound | null>(null);

  // Para saber cuándo cruzamos un nuevo minuto
  const oldMinuteRef = useRef(0);

  // Cargar el beep cada minuto (asegúrate de tener beep.mp3 en assets/sonidos)
  useEffect(() => {
    let loadedSound: Audio.Sound;
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sonidos/beep.mp3')
        );
        loadedSound = sound;
        setBeepSound(sound);
      } catch (error) {
        console.log('Error loading beep sound', error);
      }
    })();

    return () => {
      if (beepSound) {
        beepSound.unloadAsync();
      }
    };
  }, []);

  // Manejo del cronómetro (suma 1 segundo cada vez que isRunning es true)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  // Notificar el tiempo al padre
  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(seconds);
    }
  }, [seconds, onTimeChange]);

  // Cada vez que seconds cambia, verificamos si se cumple un nuevo minuto
  useEffect(() => {
    const currentMinute = Math.floor(seconds / 60);
    if (currentMinute > oldMinuteRef.current && beepSound) {
      // Cruzamos un nuevo minuto
      oldMinuteRef.current = currentMinute;
      (async () => {
        try {
          await beepSound.setPositionAsync(0);
          await beepSound.playAsync();
        } catch (error) {
          console.log('Error playing beep sound', error);
        }
      })();
    }
  }, [seconds, beepSound]);

  // Formatear HH:MM:SS o MM:SS
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;

  let formatted = '';
  if (hh > 0) {
    // Mostrar HH:MM:SS
    const hhStr = hh.toString().padStart(2, '0');
    const mmStr = mm.toString().padStart(2, '0');
    const ssStr = ss.toString().padStart(2, '0');
    formatted = `${hhStr}:${mmStr}:${ssStr}`;
  } else {
    // Mostrar MM:SS
    const mmStr = mm.toString().padStart(2, '0');
    const ssStr = ss.toString().padStart(2, '0');
    formatted = `${mmStr}:${ssStr}`;
  }

  return <Text style={styles.cronometroText}>{formatted}</Text>;
}

const styles = StyleSheet.create({
  cronometroText: {
    fontSize: 36,
    color: '#FFFF00', // Amarillo
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
