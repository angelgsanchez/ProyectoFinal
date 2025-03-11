
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUnknownError, createClient } from '@supabase/supabase-js';

// Estos valores los obtienes de tu panel de Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth:{
        storage: AsyncStorage,
        autoRefreshToken:true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})

