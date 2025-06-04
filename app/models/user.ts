import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number


  @column()
  declare username: string

  @column()
  declare email: string
  
  @column({ serializeAs: null })
  declare password: string

  @column()
  declare fullName: string | null

  @column.date()
  declare dateOfBirth: DateTime | null

  @column()
  declare city: string | null

  @column()
  declare website: string | null

  @column()
  declare avatar: string | null

  @column()
  declare bannerImage: string | null

  @column()
  declare bio: string | null


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
