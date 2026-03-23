import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nntdawowuukgxitwcnlp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5udGRhd293dXVrZ3hpdHdjbmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTg0NjIsImV4cCI6MjA4OTc5NDQ2Mn0.Z67W49oYmtNKHFbBuvzw1xAr_a2xlJMu3SC8039HRVI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}