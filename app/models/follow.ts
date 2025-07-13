import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import User from '#models/user'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Following extends BaseModel {
  public static table = 'follows'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'id_user' })
  declare idUser: number

  @column({ columnName: 'id_user_following' })
  declare idUserFollowing: number

  @hasOne(() => User, {
    foreignKey: 'id',
    localKey: 'idUserFollowing',
  })
  declare userFollowing: relations.HasOne<typeof User>

  @hasOne(() => User, {
    foreignKey: 'id',
    localKey: 'idUser',
  })
  declare user: relations.HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
