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

// import { createClient } from '@supabase/supabase-js'
// import supabaseConfig from '#config/supabase'

// export const supabase = createClient(
//   supabaseConfig.url,
//   supabaseConfig.key
// )

// services/supabase.ts
import { createClient } from '@supabase/supabase-js'
import supabaseConfig from '#config/supabase'
import logger from '@adonisjs/core/services/logger'

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key)

// Verify bucket exists on startup
export async function verifyBucket() {
  try {
    const { data, error } = await supabase
      .storage
      .getBucket(process.env.SUPABASE_BUCKET || 'xclone-database')
    
    if (error) {
      logger.error(`Supabase bucket verification failed: ${error.message}`)
      throw error
    }
    
    logger.info(`Verified Supabase bucket: ${data.name}`)
    return true
  } catch (error) {
    logger.fatal('Supabase bucket verification failed', error)
    throw error
  }
}

// Call this during application startup
verifyBucket().catch(() => process.exit(1))