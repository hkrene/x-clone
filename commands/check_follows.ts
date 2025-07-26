import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import Following from '#models/follow'
import Tweet from '#models/tweet'

export default class CheckFollows extends BaseCommand {
  static commandName = 'check:follows'
  static description = 'Check follows table and debug following logic'

  async run() {
    try {
      // Check follows table
      const follows = await db.from('follows').select('*')
      this.logger.info(`Total follows: ${follows.length}`)
      
      if (follows.length > 0) {
        this.logger.info('Sample follows:')
        follows.slice(0, 5).forEach((follow: any) => {
          this.logger.info(`User ${follow.id_user} follows User ${follow.id_user_following}`)
        })
      }

      // Check tweets table
      const tweets = await db.from('tweets').select('id', 'user_id', 'content').limit(5)
      this.logger.info(`Total tweets: ${tweets.length}`)
      
      if (tweets.length > 0) {
        this.logger.info('Sample tweets:')
        tweets.forEach((tweet: any) => {
          this.logger.info(`Tweet ${tweet.id} by User ${tweet.user_id}: ${tweet.content.substring(0, 50)}...`)
        })
      }

      // Test the following logic for user ID 1
      const userId = 1
      const following = await Following.query()
        .where('id_user', userId)
        .select('id_user_following')
      
      const followingIds = following.map(f => f.idUserFollowing)
      this.logger.info(`User ${userId} follows: ${followingIds.join(', ')}`)

      if (followingIds.length > 0) {
        const followingTweets = await Tweet.query()
          .whereIn('user_id', followingIds)
          .preload('author')
          .orderBy('created_at', 'desc')
          .limit(5)
        
        this.logger.info(`Tweets from followed users: ${followingTweets.length}`)
        followingTweets.forEach(tweet => {
          this.logger.info(`Tweet ${tweet.id} by ${tweet.author?.firstName} (User ${tweet.userId})`)
        })
      } else {
        this.logger.info('User is not following anyone')
      }

    } catch (error) {
      this.logger.error('Error:', error as any)
    }
  }
} 