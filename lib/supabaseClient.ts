import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Initialize Supabase client. In production, supply environment variables:
//   NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
