import { createClient } from '@supabase/supabase-js';

// Estos valores los obtienes de tu panel de Supabase
const supabaseUrl = 'https://blponccxpcbkexlwnorb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscG9uY2N4cGNia2V4bHdub3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTAxNzksImV4cCI6MjA1NzI2NjE3OX0.e2eATQeIMTU2szgCjbIf1giN-yGP8IeIB3Q1uAr9mkw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);