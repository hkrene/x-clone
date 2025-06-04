import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('username', 50).notNullable().unique()
      table.string('email', 50).notNullable().unique()
      table.string('password').notNullable()
      table.string('fullname', 100).nullable()           // Full name
      table.date('date_of_birth').nullable()             // Date of birth
      table.string('city', 100).nullable()               // City
      table.string('website', 255).nullable()            // Website URL
      table.string('avatar').nullable()                  // Profile image
      table.string('banner_image').nullable()        // Banner image
      table.string('bio', 280).nullable()
      table.timestamps(true)
    })
    
    
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
