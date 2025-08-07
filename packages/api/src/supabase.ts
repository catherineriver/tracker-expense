import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.EXPO_PUBLIC_SUPABASE_URL ||
                   ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
                   ''
console.log('🔧 Supabase Config:')
console.log('   URL found:', !!supabaseUrl)
console.log('   Key found:', !!supabaseKey)
console.log('   Platform:', typeof window !== 'undefined' ? 'Web' : 'React Native')


export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey)
}
