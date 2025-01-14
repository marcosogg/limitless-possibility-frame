import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idvwqwlgbscbyjiylzin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkdndxd2xnYnNjYnlqaXlsemluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0ODk2MDAsImV4cCI6MjAyMTA2NTYwMH0.SZEsz8kOyV-9KDU5QNqHX8Eo_B7zQhPGJJkrHEQB_Vw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});