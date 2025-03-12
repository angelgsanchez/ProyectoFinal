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
  Trophy,
  Timer,
  Dumbbell,
  Heart,
  LogOut,
  ChartNoAxesCombined,
  MessageCircleQuestion
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
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

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.title}>Cargando perfil.....</Text>
  //     </View>
  //   );
  // }

  const userStats = {
    workouts: 48,
    minutes: 1240,
    streak: 7,
    points: 2500
  };

  const achievements = [
    {
      id: 1,
      title: "Logros",
      icon: Award

    },
    {
      id: 2,
      title: "Estadisticas",
      icon: ChartNoAxesCombined
    },
    {
      id: 3,
      title: "Ayuda  & Soporte",
      icon: MessageCircleQuestion
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.profileImage}
              />

            </View>
            <Text style={styles.userTag}>  {user ? `${user.email}` : 'Invitado'}</Text>
          </View>

        </View>

        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cuenta</Text>

          </View>

          {achievements.map(achievement => (
            <View style={styles.archivesContainer}>
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <achievement.icon size={24} color="#FFF50A" />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>

                </View>

              </View>
              <Ionicons name="chevron-forward" size={20} color="#9B9B9B" />

            </View>

          ))}
        </View>

        {/* Share Profile */}
        <TouchableOpacity style={styles.shareButton} onPress={handleLogout}>
          <LogOut size={20} color="#000" />
          <Text style={styles.shareButtonText}>Salir</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF50A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#1A1F25',
    fontWeight: 'bold',
    fontSize: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  userTag: {
    fontSize: 14,
    color: '#FFF50A',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  statCard: {
    backgroundColor: '#2A2F35',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '30%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFF50A',
  },
  levelSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 16,
    color: '#FFF50A',
    marginLeft: 'auto',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2A2F35',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF50A',
  },
  progressText: {
    fontSize: 12,
    color: '#9B9B9B',
    marginTop: 8,
    textAlign: 'center',
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
    color: '#fff',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#FFF50A',
    marginRight: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  archivesContainer: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: "center",
    borderRadius: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
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
  achievementInfo: {
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#9B9B9B',
    marginBottom: 8,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#FFF50A',
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF50A',
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#1A1F25',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});







// // app/profile/index.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import { supabase } from '@/lib/supabaseClient';

// export default function ProfileScreen() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   // Al montar el componente, obtenemos la información del usuario
//   useEffect(() => {
//     (async () => {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) {
//         console.error('Error al obtener usuario:', error.message);
//       }
//       setUser(user);
//       setLoading(false);
//     })();
//   }, []);

//   // Función para cerrar sesión
//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error('Error al cerrar sesión:', error.message);
//     } else {
//       // Al cerrar sesión, la próxima vez que se inicie la app se pedirá iniciar sesión
//       router.replace('/signin' as never);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Cargando perfil.....</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Perfil</Text>
//       <View style={styles.profileContainer}>
//         <Text style={styles.userInfo}>
//           {user ? `Usuario: ${user.email}` : 'Invitado'}
//         </Text>

//         <View style={styles.buttonsContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.push('/achievements')}
//           >
//             <Text style={styles.buttonText}>Ver Logros</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.push('/stats')}
//           >
//             <Text style={styles.buttonText}>Ver Estadísticas</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, styles.logoutButton]}
//             onPress={handleLogout}
//           >
//             <Text style={styles.buttonText}>Cerrar Sesión</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F2F2F7',
//     paddingTop: 60,
//   },
//   title: {
//     fontFamily: 'Inter_700Bold',
//     fontSize: 28,
//     marginBottom: 20,
//     paddingHorizontal: 16,
//     color: '#000',
//     textAlign: 'center',
//   },
//   profileContainer: {
//     padding: 16,
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 3,
//   },
//   userInfo: {
//     fontFamily: 'Inter_400Regular',
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 20,
//   },
//   buttonsContainer: {
//     gap: 10,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   logoutButton: {
//     backgroundColor: '#FF3B30', // Rojo para Cerrar Sesión
//   },
//   buttonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 16,
//   },
// });


// const router = useRouter();
// const [user, setUser] = useState<any>(null);
// const [loading, setLoading] = useState(true);

// // Al montar el componente, obtenemos la información del usuario
// useEffect(() => {
//   (async () => {
//     const { data: { user }, error } = await supabase.auth.getUser();
//     if (error) {
//       console.error('Error al obtener usuario:', error.message);
//     }
//     setUser(user);
//     setLoading(false);
//   })();
// }, []);

// // Función para cerrar sesión
// const handleLogout = async () => {
//   const { error } = await supabase.auth.signOut();
//   if (error) {
//     console.error('Error al cerrar sesión:', error.message);
//   } else {
//     // Al cerrar sesión, la próxima vez que se inicie la app se pedirá iniciar sesión
//     router.replace('/signin' as never);
//   }
// };