import { Tabs } from 'expo-router';
import { Chrome as Home, Trophy, ChartBar as BarChart2, User } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#FFF50A',
          tabBarInactiveTintColor: '#FFFFFF',
          headerShown: false,
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
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
    backgroundColor: '#1E293B',
  },
  tabBar: {
    // padding: 10,
    backgroundColor: '#1E293B',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
    paddingBottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    boxShadow: '0px -5px 10px rgba(0, 0, 0, 0.25)',
  },

});
