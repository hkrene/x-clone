import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'


// Importer les modèles liés (ex: Tweet, Comment, Like, etc.)
import Tweet from '#models/tweet'
import Comment from '#models/comment'
import Like from '#models/like'
import Retweet from '#models/retweet'


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
  declare surname: string | null

  @column()
  declare firstName: string | null


  @column.date()
  declare dateOfBirth: DateTime | null

  @column()
  declare location: string | null

  @column()
  declare website: string | null

  @column()
  declare avatar: string | null

  @column()
  declare bannerImage: string | null

  @column()
  declare bio: string | null

  @column()
  declare isVerified: boolean

  @column()
  declare isPrivate: boolean

  @column({ columnName: 'followers_count', serializeAs: 'followersCount' })
  declare followersCount: number

  @column({ columnName: 'following_count', serializeAs: 'followingCount' })
  declare followingCount: number

  @column({ columnName: 'posts_count', serializeAs: 'postsCount' })
  declare postsCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

    /**
   * Relations ORM
   */
  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Retweet)
  declare retweets: HasMany<typeof Retweet>


  /**
   * Relations de suivi entre utilisateurs
   */
@manyToMany(() => User, {
  pivotTable: 'follows',
  pivotForeignKey: 'id_user', // follower
  pivotRelatedForeignKey: 'id_user_following', // following
})
declare following: ManyToMany<typeof User>

@manyToMany(() => User, {
  pivotTable: 'follows',
  pivotForeignKey: 'id_user_following', // being followed
  pivotRelatedForeignKey: 'id_user', // follower
})
declare followers: ManyToMany<typeof User>

}
