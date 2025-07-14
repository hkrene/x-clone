// config/supabase.ts
import env from '#start/env'

export default {
  url: env.get('SUPABASE_URL')!,
  key: env.get('SUPABASE_API_KEY')!,
}
