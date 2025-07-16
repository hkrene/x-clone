// import { BaseSchema } from '@adonisjs/lucid/schema'

// export default class extends BaseSchema {
//   protected tableName = 'password_reset_tokens'

//   async up() {
//     this.schema.createTable(this.tableName, (table) => {
//       table.increments('id')

//       table.timestamp('created_at')
//       table.timestamp('updated_at')
//     })
//   }

//   async down() {
//     this.schema.dropTable(this.tableName)
//   }
// }

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'password_reset_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').notNullable()
      table.string('token').notNullable().unique()
      table.timestamp('expires_at').notNullable()
      table.string('ip').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}