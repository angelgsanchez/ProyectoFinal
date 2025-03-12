import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  Award,
  ChartNoAxesCombined,
  LogOut,
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabaseClient';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error al obtener usuario:', error.message);
      }
      setUser(user);
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      router.replace('/signin' as never);
    }
  };

  const handleItemPress = (id: number) => {
    if (id === 1) {
      router.push('/achievements');
    } else if (id === 2) {
      router.push('/stats');
    }
  };

  const achievements = [
    {
      id: 1,
      title: 'Logros',
      icon: Award,
    },
    {
      id: 2,
      title: 'Estadisticas',
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
              <Image
                 source={require('../../assets/images/perfil.png')}
                 style={styles.profileImage}
                  />
                </View>
            <Text style={styles.userTag}>
              {user ? `${user.email}` : 'Invitado'}
            </Text>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
          </View>

     
          {achievements.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={styles.archivesContainer}
              onPress={() => handleItemPress(achievement.id)}
            >
              <View style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <achievement.icon size={24} color="#FFFf" />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity style={styles.shareButton} onPress={handleLogout}>
          <LogOut size={20} color="#FFF" />
          <Text style={styles.shareButtonText}>Salir</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF50A',
  },
  userTag: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  achievementsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  archivesContainer: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1F25',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {},
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
