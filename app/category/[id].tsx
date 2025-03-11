import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const getCategoryName = (id: string) => {
  const categories = {
    '1': 'Resistencia',
    '2': 'Fuerza',
    '3': 'Velocidad',
    '4': 'Equilibrio',
  };
  return categories[id as keyof typeof categories] || 'Categoría';
};

const getCategoryColor = (id: string) => {
  const colors = {
    '1': '#FF9500',
    '2': '#FF3B30',
    '3': '#5856D6',
    '4': '#34C759',
  };
  return colors[id as keyof typeof colors] || '#000000';
};

const getLevelDetails = (categoryId: string) => {
  // Puedes personalizar el texto de cada categoría
  switch (categoryId) {
    case '1': // Resistencia
      return {
        id: 1,
        name: 'Nivel 1',
        description: 'Corre, corre sin parar',
        purpose: 'Logra tu máximo tiempo',
        difficulty: 'Principiante',
      };
    case '2': // Fuerza
      return {
        id: 1,
        name: 'Nivel 1',
        description: 'Arriba y abajo',
        purpose: 'Llega a tu máximo de repeticiones',
        difficulty: 'Principiante',
      };
    case '3': // Velocidad
      return {
        id: 1,
        name: 'Nivel 1',
        description: 'Lo más rápido que puedas',
        purpose: 'Haz tu máximo en menos de 30 seg',
        difficulty: 'Principiante',
      };
      case '4': // Velocidad
      return {
        id: 1,
        name: 'Nivel 1',
        description: '¡No te muevas!',
        purpose: 'Manten tus 3 vidas en el mayor tiempo posible',
        difficulty: 'Principiante',
      };
    // Puedes agregar otros casos o usar valores por defecto:
    default:
      return {
        id: 1,
        name: 'Nivel 1',
        description: 'Introducción a los ejercicios básicos',
        purpose: '10 minutos',
        difficulty: 'Principiante',
      };
  }
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const level = getLevelDetails(id as string);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{getCategoryName(id as string)}</Text>
      <View style={styles.levelList}>
        <TouchableOpacity
          style={[styles.levelCard, { borderColor: getCategoryColor(id as string) }]}
          onPress={() => router.push(`/game/${id}/${level.id}`)}
          activeOpacity={0.85}
          key={level.id}
        >
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>{level.name}</Text>
            <View style={[styles.badge, { backgroundColor: getCategoryColor(id as string) }]}>
              <Text style={styles.badgeText}>{level.difficulty}</Text>
            </View>
          </View>
          <Text style={styles.levelDescription}>{level.description}</Text>
          <View style={styles.levelFooter}>
            <Text style={styles.levelDuration}>{level.purpose}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    color: '#000',
  },
  levelList: {
    padding: 16,
  },
  levelCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  levelDescription: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  levelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelDuration: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#666',
  },
});
