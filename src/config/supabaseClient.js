import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wzakkvzznjuyzftqhoht.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YWtrdnp6bmp1eXpmdHFob2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDYxMTksImV4cCI6MjA4NTE4MjExOX0.uMinpLU-KWDAzGyYMJMj8gyJ5bGJLCaUFUyEGR5vP8A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
