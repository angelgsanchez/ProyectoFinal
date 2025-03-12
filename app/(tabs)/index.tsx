import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
  {
    id: 1,
    name: 'Resistencia',
    color: ['#FF9500', '#FF5E00'],
    image: require('../../assets/images/categorias/resistencia.jpg'),
  },
  {
    id: 2,
    name: 'Fuerza',
    color: ['#FF3B30', '#D70015'],
    image: require('../../assets/images/categorias/fuerza.jpg'),
  },
  {
    id: 3,
    name: 'Velocidad',
    color: ['#007AFF', '#0056D6'],
    image: require('../../assets/images/categorias/velocidad.jpg'),
  },
  {
    id: 4,
    name: 'Equilibrio',
    color: ['#AF52DE', '#8E44AD'],
    image: require('../../assets/images/categorias/equilibrio.png'),
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const padding = 16;
  // Para una sola columna, cada tarjeta ocupará casi todo el ancho
  const cardWidth = width - padding * 2;
  const cardHeight = cardWidth * 0.6; // Ajusta el ratio a tu gusto

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* El LinearGradient como contenedor de fondo */}
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Logo y Encabezado */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/frames/1.gif')}
              style={styles.logo}
            />
            <Text style={styles.title}>Minijuegos</Text>
          </View>

          {/* Tarjetas de Categorías en formato columna (4x1) */}
          <View style={styles.grid}>
            {categories.map((category) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  { width: cardWidth, height: cardHeight, marginBottom: 16 },
                ]}
                onPress={() => router.push(`/category/${category.id}`)}
                activeOpacity={0.85}
                key={category.id}
              >
                <ImageBackground
                  source={category.image}
                  style={styles.imageBackground}
                  imageStyle={styles.imageBorder}
                >
                  <LinearGradient
                    colors={category.color as [string, string]}
                    style={styles.overlay}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardText}>{category.name}</Text>
                    <Text style={styles.cardSubtext}> Nivel 1</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A', // color base si quieres que coincida con el gradiente
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    // marginTop: 50, // Quita o reduce este margin si se ve muy recortado
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageBorder: {
    borderRadius: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
    borderRadius: 18,
  },
  cardContent: {
    padding: 16,
  },
  cardText: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  cardSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
