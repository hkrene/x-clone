

import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const url = env.get('DATABASE_URL')
if (!url) {
  throw new Error('DATABASE_URL is not defined')
}

const dbConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: {
        connectionString: url,
        ssl: {
          rejectUnauthorized: false, // Required by Railway
        },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig



