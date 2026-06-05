import { createClient } from '@supabase/supabase-js';

// URL và Anon Key lấy từ biến môi trường APP_CONFIG_ (bảo mật, được UmiJS inject vào bundle)
const SUPABASE_URL = APP_CONFIG_SUPABASE_URL;
const SUPABASE_ANON_KEY = APP_CONFIG_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
