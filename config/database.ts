// import env from '#start/env'
// import { defineConfig } from '@adonisjs/lucid'

// const dbConfig = defineConfig({
//   connection: 'postgres',
//   connections: {
//     postgres: {
//       client: 'pg',
//       connection: {
//         host: env.get('DB_HOST'),
//         port: env.get('DB_PORT'),
//         user: env.get('DB_USER'),
//         password: env.get('DB_PASSWORD'),
//         database: env.get('DB_DATABASE'),
//       },
//       migrations: {
//         naturalSort: true,
//         paths: ['database/migrations'],
//       },
//     },
//   },
// })

// export default dbConfig

// import env from '#start/env'
// import { defineConfig } from '@adonisjs/lucid'

// const dbConfig = defineConfig({
//   connection: 'postgres',
//   connections: {
//     postgres: {
//       client: 'pg',
//       connection: env.get('DATABASE_URL'),
//       migrations: {
//         naturalSort: true,
//         paths: ['database/migrations'],
//       },
//     },
//   },
// })

// export default dbConfig

import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        // Add these explicit options for SCRAM auth
        user: env.get('DB_USER', 'postgres'),
        password: env.get('DB_PASSWORD', 'RFFpjDNoNeGwxqrwEdreiAMgkyyxPtSq')
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations']
      }
    }
  }
})

export default dbConfig
