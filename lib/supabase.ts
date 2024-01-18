import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gtwebbaqocbmwxlezvbr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0d2ViYmFxb2NibXd4bGV6dmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxNjc4NDAsImV4cCI6MjAxOTc0Mzg0MH0.EU6VK-Bb8vRiEOo5S20LmySTH4Q0OE3tGWM__i8qVoc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})