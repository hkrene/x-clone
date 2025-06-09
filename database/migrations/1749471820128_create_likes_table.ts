import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Likes extends BaseSchema {
  protected tableName = 'likes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('tweet_id').unsigned().references('id').inTable('tweets').onDelete('CASCADE')

      table.unique(['user_id', 'tweet_id']) // Un utilisateur ne peut aimer un tweet qu'une seule fois

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
