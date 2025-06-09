import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key

      table.string('username', 20).notNullable().unique()
      table.string('email', 100).notNullable().unique()
      table.string('password', 180).notNullable()

      table.string('surname', 50).nullable()
      table.string('first_name', 50).nullable()

      table.date('date_of_birth').nullable()
      table.string('location', 100).nullable()
      table.string('website', 255).nullable()
      table.string('avatar', 255).nullable()
      table.string('banner_image', 255).nullable()
      table.string('bio', 280).nullable() // 280 chars = tweet limit

      table.boolean('is_verified').notNullable().defaultTo(false)
      table.boolean('is_private').notNullable().defaultTo(false)

      table.integer('followers_count').unsigned().notNullable().defaultTo(0)
      table.integer('following_count').unsigned().notNullable().defaultTo(0)
      table.integer('posts_count').unsigned().notNullable().defaultTo(0)

      table.timestamps(true, true) // created_at & updated_at with timezone
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
