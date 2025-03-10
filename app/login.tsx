import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons';

export default function LoginScreen() {
    return (
        <ImageBackground
            source={require('../assets/images/gym.png')} // Cambia por la imagen que desees
            style={styles.background}
        >
            <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']} style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Deportes</Text>

                    {/* Campos de entrada */}
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#999" style={styles.icon} />
                        <TextInput placeholder="Email" placeholderTextColor="#999" style={styles.input} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#999" style={styles.icon} />
                        <TextInput placeholder="Contraseña" placeholderTextColor="#999" style={styles.input} secureTextEntry />
                    </View>

                    {/* Botón de Sign Up */}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>

                    {/* Opción de iniciar sesión con redes */}
                    <Text style={styles.orText}>Or</Text>
                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome name="apple" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <AntDesign name="facebook-square" size={24} color="#3b5998" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <AntDesign name="google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                    </View>

                    {/* Link para iniciar sesión */}
                    <Text style={styles.signInText}>
                        If you have an account?{' '}
                        <Text style={styles.signInLink}>Sign In here</Text>
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
        objectFit: 'cover',

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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        width: '100%',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
        outline: 'none',

    },

    button: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    orText: {
        color: '#FFF',
        marginVertical: 15,
        fontSize: 16,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    socialButton: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
    },
    signInText: {
        color: '#FFF',
        fontSize: 14,
    },
    signInLink: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
});
