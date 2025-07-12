// import { BaseSchema } from '@adonisjs/lucid/schema'

// export default class extends BaseSchema {
//   protected tableName = 'follows'

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
  protected tableName = 'follows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('id_user')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('id_user_following')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      // 👇 Composite unique constraint to prevent duplicates
      table.unique(['id_user', 'id_user_following'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
