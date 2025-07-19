import User from '#models/user'
import { uploadToSupabase, deleteFromSupabase, getSignedUrl } from '#services/uploader'
import Follow from '#models/follow'
import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

type SuggestedUser = {
  id: number
  firstName: string
  surname: string
  username: string
  avatar: string
  isVerified: boolean
}
export default class ProfilesController {

  public async getSuggestedUsers(authUserId: number) {
  const following = await Follow.query()
    .where('id_user', authUserId)
    .select('id_user_following')

  const followingIds = following.map(f => f.idUserFollowing)
  followingIds.push(authUserId) // exclude yourself

  const users = await User.query()
    .whereNotIn('id', followingIds)
    .orderByRaw('RANDOM()')
    .limit(3)

  return await Promise.all(users.map(async (user) => ({
    id: user.id,
    firstName: user.firstName || '',
    surname: user.surname || '',
    username: user.username || '',
    avatar: user.avatar ? await getSignedUrl(user.avatar) : '',
    isVerified: user.isVerified || false,
  })))
}





  public async showHome({ view, auth }: HttpContext) {
  const user = await auth.use('web').authenticate()
  const avatarUrl = user.avatar ? await getSignedUrl(user.avatar) : ''

  const suggestedUsers = await this.getSuggestedUsers(user.id)
  
  const following = await Follow.query()
    .where('id_user', user.id)
    .select('id_user_following')
  const followingIds = following.map(f => f.idUserFollowing)

  // Updated For You feed - includes your tweets and people you follow
  const forYouTweets = await Tweet.query()
    .where(q => {
      q.whereIn('user_id', followingIds)
       .orWhere('user_id', user.id)
    })
    .preload('author')
    .orderBy('created_at', 'desc')
    .limit(50)

  // Following feed remains the same (just people you follow)
  const followingTweets = followingIds.length > 0
    ? await Tweet.query()
        .whereIn('user_id', followingIds)
        .preload('author')
        .orderBy('created_at', 'desc')
        .limit(50)
    : []

  return view.render('pages/home', {
    user: {
      ...user.serialize(),
      avatar: avatarUrl,
      firstName: user.firstName || '',
      surname: user.surname || '',
      username: user.username || '', 
      isVerified: user.isVerified || false,
      following_count: followingIds.length
    },
    forYouTweets: await Promise.all(forYouTweets.map(async (tweet) => ({
      ...tweet.serialize(),
      shortTime: this.formatShortTime(tweet.createdAt),
      mediaUrl: tweet.mediaUrl ? await getSignedUrl(tweet.mediaUrl) : null
    }))),
    followingTweets: await Promise.all(followingTweets.map(async (tweet) => ({
      ...tweet.serialize(),
      shortTime: this.formatShortTime(tweet.createdAt),
      mediaUrl: tweet.mediaUrl ? await getSignedUrl(tweet.mediaUrl) : null
    }))),
    suggestedUsers,  
  })
}

  public async showEditProfile({ view, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()

    const avatarUrl = user.avatar ? await getSignedUrl(user.avatar) : ''
    const bannerUrl = user.bannerImage ? await getSignedUrl(user.bannerImage) : ''

    return view.render('pages/editProfil', {
      user: {
        ...user.serialize(),
        bannerImage: bannerUrl,
        avatar: avatarUrl,
        firstName: user.firstName || '',
        surname: user.surname || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth || '',
      },
    })
  }

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
      await bannerImage.move(app.tmpPath())

      if (user.bannerImage?.includes('media/')) {
        await deleteFromSupabase(user.bannerImage)
      }

      const path = `banners/${user.id}_${Date.now()}.${bannerImage.extname}`
      const publicPath = await uploadToSupabase(bannerImage.filePath!, path, bannerImage.headers['content-type'])
      user.bannerImage = publicPath
    }

    if (avatar) {
      await avatar.move(app.tmpPath())

      if (user.avatar?.includes('media/')) {
        await deleteFromSupabase(user.avatar)
      }

      const path = `avatars/${user.id}_${Date.now()}.${avatar.extname}`
      const publicPath = await uploadToSupabase(avatar.filePath!, path, avatar.headers['content-type'])
      user.avatar = publicPath
    }

    await user.save()
    return response.redirect('/profile')
  }

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

    const avatarUrl = user.avatar ? await getSignedUrl(user.avatar) : ''
    const bannerUrl = user.bannerImage ? await getSignedUrl(user.bannerImage) : ''

    const tweets = await Promise.all(
      (user.tweets || []).map(async (tweet) => ({
        ...tweet.serialize(),
        shortTime: this.formatShortTime(tweet.createdAt),
        mediaUrl: tweet.mediaUrl ? await getSignedUrl(tweet.mediaUrl) : null,
      }))
    )

    const followersCount = user.followers?.length || 0
    const followingCount = user.following?.length || 0
    const postsCount = tweets.length
    
    const authUser = await auth.use('web').authenticate().catch(() => null)
  let suggestedUsers: SuggestedUser[] = []

  if (authUser) {
    suggestedUsers = await this.getSuggestedUsers(authUser.id)
  }


    return view.render('pages/profile', {
      user: {
        ...user.serialize(),
        username: user.username ? `@${user.username}` : '', 
        avatar: avatarUrl,
        bannerImage: bannerUrl || '',
        postsCount,
        followersCount,
        followingCount,
        joinedDate: user.createdAt.toFormat('MMMM yyyy'),
      },
      tweets,
      suggestedUsers,
    })
  }

  public async showOtherProfile({ params, view, auth, response }: HttpContext) {
    const userAuth = auth.user!

    const user = await User.query()
      .where('id', params.id)
      .preload('tweets', (query) => {
        query.orderBy('created_at', 'desc')
      })
      .withCount('followers', (query) => query.as('followers_count'))
      .withCount('following', (query) => query.as('following_count'))
      .firstOrFail()

    if (user.id === userAuth.id) {
      return response.redirect('/profile')
    }

    const avatarUrl = user.avatar ? await getSignedUrl(user.avatar) : ''
    const bannerUrl = user.bannerImage ? await getSignedUrl(user.bannerImage) : ''

    const postsCount = user.tweets.length

    const followRelation = await Follow.query()
      .where('id_user', userAuth.id)
      .andWhere('id_user_following', user.id)
      .first()

    const isFollowing = !!followRelation

    return view.render('pages/otherProfile', {
      user: {
        ...user.serialize(),
        username: user.username ? `@${user.username}` : '',
        avatar: avatarUrl,
        bannerImage: bannerUrl || '',
        postsCount,
        joinedDate: user.createdAt.toFormat('MMMM yyyy'),
      },
      tweets: user.tweets.map((tweet) => ({
        ...tweet.serialize(),
        shortTime: tweet.createdAt.toRelative(),
      })),
      isFollowing,
    })
  }

  private formatShortTime(date: DateTime): string {
    const diffMinutes = date.diffNow().as('minutes') * -1
    
    if (diffMinutes < 1) {
      return 'now'
    }
    if (diffMinutes < 60) {
      return `${Math.round(diffMinutes)}m`
    }
    if (diffMinutes < 1440) {
      return `${Math.round(diffMinutes / 60)}h`
    }
    return `${Math.round(diffMinutes / 1440)}d`
  }
}
