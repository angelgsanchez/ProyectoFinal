// app/login/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Maneja el registro e inicio de sesión simultáneo
  const handleSignUp = async () => {
    setLoading(true);
    try {
      // Registrar al usuario
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.log('Error al registrarse:', error.message);
        // Aquí podrías mostrar un mensaje de error en la UI
      } else {
        console.log('Usuario registrado:', data.user);

        // Si no se crea automáticamente una sesión, intentar iniciar sesión
        if (!data.session) {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            console.log('Error al iniciar sesión:', signInError.message);
          }
        }
        // Extraer el username a partir del email
        const username = email.split('@')[0];
        // Actualizar user_metadata con el username
        const { error: updateError } = await supabase.auth.updateUser({
          data: { username },
        });
        if (updateError) {
          console.log('Error al actualizar metadata:', updateError.message);
        }
        // Una vez autenticado, redirigir al Home
        router.replace("/");
      }
    } catch (err) {
      console.log('Error en signUp:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/gym.jpeg')}
      style={styles.background}
    >
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Entrenamiento Interactivo</Text>

          {/* Formulario */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Registrate para inciar sesión</Text>
            </TouchableOpacity>
          )}

          
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#FFF',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  signUpButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  signInText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 15,
  },
  signInLink: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
