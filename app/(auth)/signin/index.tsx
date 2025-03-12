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
  Alert,
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

  // Maneja el registro e inicio de sesión en un mismo formulario
  const handleSignUp = async () => {
    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe ser un mínimo de 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      // Intentar registrar al usuario
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        // Si el error indica que el usuario ya está registrado
        if (error.message.toLowerCase().includes("already registered") ||
            error.message.toLowerCase().includes("duplicate")) {
          // Intentar iniciar sesión
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            console.log('Error al iniciar sesión:', signInError.message);
            Alert.alert("Error", "Contraseña incorrecta");
            setLoading(false);
            return;
          }
        } else {
          // Otro error
          console.log('Error al registrarse:', error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
          return;
        }
      }
      
      // Si el usuario es nuevo y no se crea automáticamente la sesión, intentar iniciar sesión
      if (!data.session) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          console.log('Error al iniciar sesión:', signInError.message);
          Alert.alert("Error", signInError.message);
          setLoading(false);
          return;
        }
      }
      
      // Extraer el username a partir del email (todo lo que está antes del "@")
      const username = email.split('@')[0];
      
      // Actualizar la metadata del usuario con el username
      const { error: updateError } = await supabase.auth.updateUser({
        data: { username },
      });
      if (updateError) {
        console.log('Error al actualizar metadata:', updateError.message);
      }
      
      // Redirigir al Home
      router.replace("/");
    } catch (err) {
      console.log('Error en signUp:', err);
      Alert.alert("Error", "Ocurrió un error al iniciar sesión");
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
              <Text style={styles.signUpButtonText}>Regístrate para iniciar sesión</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.signInText}>
            ¿Ya tienes una cuenta?{' '}
            <Text style={styles.signInLink}>Inicia sesión aquí</Text>
          </Text>
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
