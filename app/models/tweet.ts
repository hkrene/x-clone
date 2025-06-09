import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Like from '#models/like'
import Comment from '#models/comment'
import Retweet from '#models/retweet'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'likes_count', serializeAs: 'likesCount' })
  declare likesCount: number

  @column({ columnName: 'retweets_count', serializeAs: 'retweetsCount' })
  declare retweetsCount: number

  @column({ columnName: 'comments_count', serializeAs: 'commentsCount' })
  declare commentsCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
    Relation vers l'auteur du tweet
   */
  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  /**
    Relation vers les likes
   */
  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  /**
   Relation vers les retweets
   */
  @hasMany(() => Retweet)
  declare retweets: HasMany<typeof Retweet>

  /**
   Relation vers les commentaires
   */
  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>
}
