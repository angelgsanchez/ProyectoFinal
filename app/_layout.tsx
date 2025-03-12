import { useEffect } from 'react';
import { Stack, Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

// Evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Una vez cargadas las fuentes, ocultamos el splash
  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded]);

  // Mientras no estén cargadas las fuentes, no renderizamos nada (splash permanece)
  if (!fontsLoaded) {
    return null;
  }

  return (
    
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
