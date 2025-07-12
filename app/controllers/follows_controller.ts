// import type { HttpContext } from '@adonisjs/core/http'

// export default class FollowsController {
// }

import Follow from '#models/follow'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class FollowsController {
  /**
   * Toggle follow/unfollow with notification
   */
  async followers({ auth, params, response, session }: HttpContext) {
    const userId = Number(auth.user?.id)
    const targetId = Number(params.id)

    if (userId === targetId) {
      session.flash('error', 'You cannot follow yourself.')
      return response.redirect().back()
    }

    const follow = await Follow.query()
      .where('idUser', userId)
      .andWhere('idUserFollowing', targetId)
      .first()

    if (follow) {
      await follow.delete()
      session.flash('info', 'You have unfollowed the user.')
    } else {
      await Follow.create({ idUser: userId, idUserFollowing: targetId })

      // 🔔 Notification (to user being followed)
      const followedUser = await User.find(targetId)
      if (followedUser) {
        // Simulated notification — replace with real system/event
        console.log(`${auth.user!.username} followed ${followedUser.username}`)
      }

      session.flash('success', 'You have followed the user.')
    }

    return response.redirect().back()
  }

  /**
   * Show followers of the current user
   */
  async getFollowers({ view, auth }: HttpContext) {
    const userId = Number(auth.user?.id)

    // 👥 Get all users (excluding self) with follower/following counts
    const allUsers = await User.query()
      .whereNot('id', userId)
      .withCount('followers as followers_count')
      .withCount('followings as followings_count')

    // 🧠 Get IDs the user follows
    const followingRows = await Follow.query().where('idUser', userId)
    const followingIds = followingRows.map((f) => f.idUserFollowing)

    // 👇 Get users who follow the auth user, preload their user data
    const followers = await Follow.query()
      .where('idUserFollowing', userId)
      .whereNot('idUser', userId)
      .preload('user')

    return view.render('pages/followers', {
      abonné: followers,
      tableauAbonnement: followingIds,
      userAll: allUsers,
      user: auth.user,
    })
  }

  /**
   * Show users the current user is following
   */
  async getFollowings({ view, auth }: HttpContext) {
    const userId = Number(auth.user?.id)

    const allUsers = await User.query()
      .whereNot('id', userId)
      .withCount('followers as followers_count')
      .withCount('followings as followings_count')

    const followingRows = await Follow.query().where('idUser', userId)
    const followingIds = followingRows.map((f) => f.idUserFollowing)

    const followings = await Follow.query()
      .where('idUser', userId)
      .preload('userFollowing')

    return view.render('pages/followings', {
      abonnement: followings,
      tableauAbonnement: followingIds,
      userAll: allUsers,
      user: auth.user,
    })
  }
}
