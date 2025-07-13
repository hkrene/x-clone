import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import {
  BaseModel,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

// Related models
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
  declare followersCountDb: number

  @column({ columnName: 'following_count', serializeAs: 'followingCount' })
  declare followingCountDb: number

  @column({ columnName: 'posts_count', serializeAs: 'postsCount' })
  declare postsCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * ORM Relationships
   */
  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Retweet)
  declare retweets: HasMany<typeof Retweet>

  // Users I follow
  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'id_user',
    pivotRelatedForeignKey: 'id_user_following',
  })
  declare following: ManyToMany<typeof User>

  // Users following me
  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'id_user_following',
    pivotRelatedForeignKey: 'id_user',
  })
  declare followers: ManyToMany<typeof User>

  /**
   * Virtual getters for follower/following counts via $extras
   */
  get followersCount(): number {
    return this.$extras.followers_count ?? this.followersCountDb ?? 0
  }

  get followingCount(): number {
    return this.$extras.following_count ?? this.followingCountDb ?? 0
  }
}
