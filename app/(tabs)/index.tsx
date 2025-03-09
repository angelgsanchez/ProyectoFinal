import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
  { id: 1, name: 'Resistencia', color: '#FF9500' },
  { id: 2, name: 'Fuerza', color: '#FF3B30' },
  { id: 3, name: 'Flexibilidad', color: '#5856D6' },
  { id: 4, name: 'Coordinación', color: '#34C759' },
  { id: 5, name: 'Velocidad', color: '#007AFF' },
  { id: 6, name: 'Equilibrio', color: '#AF52DE' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  //cuadro 2*3
  const padding = 16;
  const gap = 16;
  const cardWidth = (width - (padding * 2) - gap) / 2;
  const cardHeight = cardWidth * 0.8; 

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Minijuegos de Rutinas</Text>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.card,
              {
                backgroundColor: category.color,
                width: cardWidth,
                height: cardHeight,
              },
            ]}
            onPress={() => router.push(`/category/${category.id}`)}>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>{category.name}</Text>
              <Text style={styles.cardSubtext}>1 nivel</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    marginTop: 60,
    marginBottom: 24,
    paddingHorizontal: 16,
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    gap: 8,
  },
  cardText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  cardSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});