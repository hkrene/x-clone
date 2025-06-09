import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'likes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('tweet_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tweets')
        .onDelete('CASCADE')

      // Empêcher les doublons (un like par user par tweet)
      table.unique(['user_id', 'tweet_id'])

      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
