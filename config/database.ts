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

// config/database.ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const connection = env.get('DATABASE_URL') || {
  host: env.get('DB_HOST'),
  port: env.get('DB_PORT'),
  user: env.get('DB_USER'),
  password: env.get('DB_PASSWORD'),
  database: env.get('DB_DATABASE'),
  ssl: env.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false
}

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: connection,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations']
      }
    }
  }
})

export default dbConfig
