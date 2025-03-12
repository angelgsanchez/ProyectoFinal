// app/achievements.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { supabase } from '@/lib/supabaseClient';

// Datos fijos de las 4 categorías
const defaultCategories = [
  {
    category: '1',
    title: 'Nivel 1 - Resistencia',
    description: 'Mantener trote estático durante 10 minutos',
    target: 600,
  },
  {
    category: '2',
    title: 'Nivel 1 - Fuerza',
    description: 'Completar 20 sentadillas',
    target: 20,
  },
  {
    category: '3',
    title: 'Nivel 1 - Velocidad',
    description: 'Realizar 30 saltos en 30 seg',
    target: 30,
  },
  {
    category: '4',
    title: 'Nivel 1 - Equilibrio',
    description: 'Mantenerse sin moverse por 60s',
    target: 60,
  },
];

export default function AchievementsScreen() {
  const [mergedAchievements, setMergedAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Función para obtener logros de DB
  const fetchAchievementsFromDB = async (userId: string) => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching achievements:', error.message);
      return [];
    }
    return data || [];
  };

  // 2. Función para mezclar data local y la de DB
  const mergeAchievements = (defaults: any[], dbData: any[]) => {
    return defaults.map((defCat) => {
      // Busca en DB
      const found = dbData.find(
        (dbAch: any) => dbAch.category === defCat.category && dbAch.level === 1
      );

      if (found) {
        const percentage = Math.min((found.progress / found.target) * 100, 100);
        return {
          ...defCat,
          id: found.id,
          progress: percentage / 100,
          claimed: found.claimed,
          completed: found.completed,
        };
      } else {
        // No existe en DB => 0% de progreso
        return {
          ...defCat,
          id: defCat.category,
          progress: 0,
          claimed: false,
          completed: false,
        };
      }
    });
  };

  // 3. Función para cargar logros del usuario
  const fetchAllAchievements = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (user) {
      const dbAchievements = await fetchAchievementsFromDB(user.id);
      const finalData = mergeAchievements(defaultCategories, dbAchievements);
      setMergedAchievements(finalData);
    } else {
      // Si no hay usuario, quizás redirigir o mostrar mensaje
      setMergedAchievements(defaultCategories); // Muestra placeholders
    }
    setLoading(false);
  };

  // 4. Al montar el componente, carga los logros
  useEffect(() => {
    fetchAllAchievements();
  }, []);

  // 5. Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllAchievements().then(() => setRefreshing(false));
  }, []);

  // 6. Función para “reclamar” el logro
  const handleClaim = async (achId: string) => {
    // Ejemplo: marcar claimed = true
    const { error } = await supabase
      .from('achievements')
      .update({ claimed: true })
      .eq('id', achId);
    if (error) {
      console.error('Error al reclamar logro:', error.message);
    } else {
      // Vuelve a refrescar
      fetchAllAchievements();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando logros...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Logros</Text>

      {mergedAchievements.map((ach) => {
        const isComplete = ach.progress >= 1;
        return (
          <View key={ach.id} style={styles.achievementCard}>
            <View style={styles.headerRow}>
              {/* Nombre “bonito” de la categoría */}
              <Text style={styles.categoryText}>
                {ach.category === '1' ? 'Resistencia'
                  : ach.category === '2' ? 'Fuerza'
                    : ach.category === '3' ? 'Velocidad'
                      : 'Equilibrio'}
              </Text>
              <Text
                style={[styles.statusText, isComplete && styles.completeText]}
              >
                {Math.round(ach.progress * 100)}%
              </Text>
            </View>

            <Text style={styles.achievementTitle}>{ach.title}</Text>
            <Text style={styles.description}>{ach.description}</Text>

            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBarFill, { width: `${ach.progress * 100}%` }]}
              />
            </View>

            <TouchableOpacity
              style={[styles.claimButton, (!isComplete || ach.claimed) && styles.disabledButton]}
              disabled={!isComplete || ach.claimed}
              onPress={() => handleClaim(ach.id)}
            >
              <Text style={styles.claimButtonText}>
                {ach.claimed
                  ? 'Reclamado'
                  : isComplete
                    ? 'Reclamar'
                    : 'En progreso'}
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
    color: '#34C759',
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