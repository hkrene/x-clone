import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tweets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // L'utilisateur qui a posté le tweet
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Supprimer les tweets si l'utilisateur est supprimé
        .notNullable()

      // Contenu du tweet
      table.text('content').notNullable()

      // Compteurs
      table.integer('likes_count').defaultTo(0)
      table.integer('retweets_count').defaultTo(0)
      table.integer('comments_count').defaultTo(0)

      table.timestamps(true) // created_at & updated_at gérés automatiquement
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
