// app/achievements.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// Ejemplo de datos de logros
// Podrías obtenerlos de tu backend, AsyncStorage, etc.
const achievementsData = [
  {
    id: '1',
    category: 'Resistencia',
    title: 'Nivel 1 - Resistencia',
    description: 'Mantener trote estático durante 10 minutos',
    progress: 0.6, // 60%
  },
  {
    id: '2',
    category: 'Fuerza',
    title: 'Nivel 1 - Fuerza',
    description: 'Completar 20 sentadillas',
    progress: 0.3, // 30%
  },
  {
    id: '3',
    category: 'Velocidad',
    title: 'Nivel 1 - Velocidad',
    description: 'Realizar 50 saltos en 30 seg',
    progress: 0.9, // 90%
  },
  {
    id: '4',
    category: 'Equilibrio',
    title: 'Nivel 1 - Equilibrio',
    description: 'Mantenerse sin moverse por 60s',
    progress: 0.15, // 15%
  },
];

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState(achievementsData);

  const handleClaim = (id: string) => {
    // Lógica para "reclamar" el logro. Por ejemplo, podrías:
    // - Marcarlo como reclamado en la base de datos
    // - Actualizar el estado local para reflejar que está reclamado
    console.log(`Logro ${id} reclamado`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Logros</Text>

      {achievements.map((ach) => {
        const isComplete = ach.progress >= 1;
        return (
          <View key={ach.id} style={styles.achievementCard}>
            <View style={styles.headerRow}>
              <Text style={styles.categoryText}>{ach.category}</Text>
              {/* Estado de porcentaje */}
              <Text style={[styles.statusText, isComplete && styles.completeText]}>
                {Math.round(ach.progress * 100)}%
              </Text>
            </View>

            <Text style={styles.achievementTitle}>{ach.title}</Text>
            <Text style={styles.description}>{ach.description}</Text>

            {/* Barra de progreso */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${ach.progress * 100}%` }]} />
            </View>

            {/* Botón para reclamar (solo si está al 100%) */}
            <TouchableOpacity
              style={[styles.claimButton, !isComplete && styles.disabledButton]}
              disabled={!isComplete}
              onPress={() => handleClaim(ach.id)}
            >
              <Text style={styles.claimButtonText}>
                {isComplete ? 'Reclamar' : 'En progreso'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 16,
    color: '#000',
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF4757',
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#666',
  },
  completeText: {
    color: '#34C759', // Verde cuando está completo
  },
  achievementTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E5E5EA',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  claimButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  claimButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
  },
});
