import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('username', 50).notNullable().unique()
      table.string('email', 50).notNullable().unique()
      table.string('password').notNullable()
      table.string('fullname', 25).notNullable()           // Full name
      table.date('date_of_birth').notNullable()             // Date of birth
      table.string('city', 100).nullable()               // City
      table.string('website', 255).nullable()            // Website URL
      table.string('avatar', 255).nullable()                  // Profile image
      table.string('banner_image', 255).nullable()        // Banner image
      table.string('bio', 100).nullable()
      table.boolean('is_verified').defaultTo(false)      // Verification status
      table.boolean('is_private').defaultTo(false)       // Privacy status
      table.integer('followers_count').defaultTo(0)      // Followers count
      table.integer('following_count').defaultTo(0)      // Following count
      table.integer('posts_count').defaultTo(0)          // Posts count
      table.integer('likes_count').defaultTo(0)          // Likes count
      table.timestamps(true)
    })
    
    
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
