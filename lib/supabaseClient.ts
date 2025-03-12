import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUnknownError, createClient } from '@supabase/supabase-js';

// Estos valores los obtienes de tu panel de Supabase
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://blponccxpcbkexlwnorb.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscG9uY2N4cGNia2V4bHdub3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTAxNzksImV4cCI6MjA1NzI2NjE3OX0.e2eATQeIMTU2szgCjbIf1giN-yGP8IeIB3Q1uAr9mkw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
