import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = APP_CONFIG_SUPABASE_URL;
const SUPABASE_ANON_KEY = APP_CONFIG_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
