import User from '#models/user'
import { createUserValidator } from '#validators/user'
import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class ProfilesController {
  /** Updates user profile */
  public async update({ request, response, auth }: HttpContext) {
    const firstName = request.input('firstName')
    const surname = request.input('surname')
    const bio = request.input('bio')
    const location = request.input('location')
    const website = request.input('website')
    const dateOfBirth = request.input('dateOfBirth')
    const bannerImage = request.file('banner')
    const avatar = request.file('avatar')

    const user = await User.findOrFail(auth.use('web').user?.id)

    if (firstName) user.firstName = firstName
    if (surname) user.surname = surname
    if (bio) user.bio = bio
    if (location) user.location = location
    if (website) user.website = website
    if (dateOfBirth) user.dateOfBirth = dateOfBirth

    if (bannerImage) {
      await bannerImage.move(app.makePath('public/uploads'), {
        name: `${cuid()}.${bannerImage.extname}`,
      })
      user.bannerImage = bannerImage.fileName || ''
    }

    if (avatar) {
      await avatar.move(app.makePath('public/uploads'), {
        name: `${cuid()}.${avatar.extname}`,
      })
      user.avatar = avatar.fileName || ''
    }

    await user.save()
    return response.redirect().back()
  }

  /** Displays user profile */
  public async showProfile({ params, view, auth }: HttpContext) {
    let user: User | null = null

    if (params.username) {
      user = await User.query()
        .where('username', params.username)
        .preload('tweets', (query) => query.orderBy('createdAt', 'desc'))
        .preload('followers')
        .preload('following')
        .first()
    } else {
      user = await auth.use('web').authenticate().catch(() => null)
      if (user) {
        await user.load('tweets', (query) => query.orderBy('createdAt', 'desc'))
        await user.load('followers')
        await user.load('following')
      }
    }

    if (!user) {
      return view.render('pages/profile')
    }

    const tweets: Tweet[] = user.tweets || []
    const followersCount = user.followers?.length || 0
    const followingCount = user.following?.length || 0
    const postsCount = tweets.length

    return view.render('pages/profile', {
      user: {
        ...user.serialize(),
        avatar: user.avatar,
        bannerImage: user.bannerImage || '/default-banner.jpg',
        postsCount,
        followersCount,
        followingCount,
        joinedDate: user.createdAt.toFormat('MMMM yyyy'),
      },
      tweets,
    })
  }
}
