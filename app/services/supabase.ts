// import { createClient } from '@supabase/supabase-js'
// import { env } from '@adonisjs/core/env'

// export const supabase = createClient(
//   env.get('SUPABASE_URL'),
//   env.get('SUPABASE_API_KEY')
// )

// import { createClient } from '@supabase/supabase-js'
// import Env from '@adonisjs/core/services/env'

// export const supabase = createClient(
//   Env.get('SUPABASE_URL'),
//   Env.get('SUPABASE_API_KEY')
// )

import { createClient } from '@supabase/supabase-js'
import supabaseConfig from '#config/supabase'

export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.key
)
