// app/profile/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabaseClient';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Al montar el componente, obtenemos la información del usuario
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

  // Función para cerrar sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      // Al cerrar sesión, la próxima vez que se inicie la app se pedirá iniciar sesión
      router.replace('/signin' as never);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando perfil.....</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.userInfo}>
          {user ? `Usuario: ${user.email}` : 'Invitado'}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/achievements')}
          >
            <Text style={styles.buttonText}>Ver Logros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/stats')}
          >
            <Text style={styles.buttonText}>Ver Estadísticas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    marginBottom: 20,
    paddingHorizontal: 16,
    color: '#000',
    textAlign: 'center',
  },
  profileContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  userInfo: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  buttonsContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30', // Rojo para Cerrar Sesión
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});
