// start/controllers/followers_and_followings_controller.ts
import Follow from '#models/follow'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class FollowsController {
  public async follow({ auth, params, request, response }: HttpContext) {
  const currentUserId = auth.user!.id
  const targetUserId = Number(params.id)
  const action = request.input('action') // 'follow' or 'unfollow'

  const existing = await Follow.query()
    .where('id_user', currentUserId)
    .andWhere('id_user_following', targetUserId)
    .first()

  if (action === 'unfollow') {
    if (existing) await existing.delete()
  } else {
    if (!existing) {
      await Follow.create({
        idUser: currentUserId,
        idUserFollowing: targetUserId,
      })
    }
  }

  return response.redirect().back()
}


  public async getFollowers({ view, auth }: HttpContext) {
    const currentUserId = auth.user!.id
    const userAll = await User.query().whereNot('id', currentUserId)
    const followings = await Follow.query().where('id_user', currentUserId)
    const followingIds = followings.map((f) => f.idUserFollowing)

    const followers = await Follow.query()
      .where('id_user_following', currentUserId)
      .preload('user')

    return view.render('pages/followers', {
      abonné: followers,
      tableauAbonnement: followingIds,
      userAll,
      user: auth.user,
    })
  }

  public async getFollowings({ view, auth }: HttpContext) {
    const currentUserId = auth.user!.id
    const userAll = await User.query().whereNot('id', currentUserId)
    const followings = await Follow.query().where('id_user', currentUserId)
    const followingIds = followings.map((f) => f.idUserFollowing)

    const abonnement = await Follow.query()
      .where('id_user', currentUserId)
      .preload('userFollowing')

    return view.render('pages/followings', {
      abonnement,
      tableauAbonnement: followingIds,
      userAll,
      user: auth.user,
    })
  }

  public async showOtherProfile({ params, view, auth, response }: HttpContext) {
    const userAuth = auth.user!

    const user = await User.query()
      .where('id', params.id)
      .preload('tweets', (q) => q.orderBy('created_at', 'desc'))
      .withCount('followers', (query) => {
        query.as('followers_count')
      })
      .withCount('following', (query) => {
        query.as('following_count')
      })

      .firstOrFail()

    if (user.id === userAuth.id) return response.redirect('/profile')

    const postsCount = user.tweets.length
    const followersCount = user.$extras.followers_count
    const followingCount = user.$extras.following_count

    const isFollowing = !!(await Follow.query()
      .where('id_user', userAuth.id)
      .andWhere('id_user_following', user.id)
      .first())

    return view.render('pages/otherProfile', {
      user: {
        ...user.serialize(),
        username: user.username ? `@${user.username}` : '',
        avatar: user.avatar,
        bannerImage: user.bannerImage || '',
        postsCount,
        followersCount,
        followingCount,
        joinedDate: user.createdAt.toFormat('MMMM yyyy'),
      },
      tweets: user.tweets.map((tweet) => ({
        ...tweet.serialize(),
        shortTime: tweet.createdAt.toRelative(),
      })),
      isFollowing,
    })
  }
}
