import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Estadísticas</Text>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Próximamente</Text>
        <Text style={styles.description}>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 16,
    color: '#000',
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});