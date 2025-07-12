import { DateTime } from 'luxon'

import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import User from '#models/user'
import * as relations from '@adonisjs/lucid/types/relations'
// import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Follow extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUser: number

  @column()
  declare idUserFollowing: number

  @hasOne(() => User,{
    foreignKey: 'id',
    localKey: 'IdUserFollowing'
  })
  declare userFollowing: relations.HasOne<typeof User>

  @hasOne(() => User,{
    foreignKey: 'id',
    localKey: 'idUser'
  })
  declare user: relations.HasOne<typeof User>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}