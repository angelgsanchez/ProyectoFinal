import { Tabs } from 'expo-router';
import { Chrome as Home, Trophy, ChartBar as BarChart2, User } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="achievements"
          options={{
            title: 'Logros',
            tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Estadísticas',
            tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // o el color de fondo que desees
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 5,
    paddingTop: 5,
  },
});
