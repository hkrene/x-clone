import User from '#models/user'
// import { createUserValidator } from '#validators/user'
import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'


//Shows home page with tweets
export default class ProfilesController {
  public async showHome({ view, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    // Load tweets with author information
    const tweets = await Tweet.query()
      // .whereNot('user_id', user.id)
      .preload('author')
      .limit(50)
      .orderBy('createdAt', 'desc')

    return view.render('pages/home', {
      user: {
        ...user.serialize(),
        avatar: user.avatar || '',
        firstName: user.firstName || '',
        surname: user.surname || '',
        username: user.username || '', 
        isVerified: user.isVerified || false,
      },
      tweets: tweets.map(tweet => ({
        ...tweet.serialize(),
        shortTime: this.formatShortTime(tweet.createdAt)
      }))
    })
  }


  //This method renders the edit profile page with the user's current information
  public async showEditProfile({ view, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()

    return view.render('pages/editProfil', {
      user: {
        ...user.serialize(),
        bannerImage: user.bannerImage || '',
        avatar: user.avatar || '',
        firstName: user.firstName || '',
        surname: user.surname || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth || '',
      },
    })
  }


  //This method updates the user's profile information based on the input received from the request 
  // After updating, it redirects the user back to their profile page

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
    return response.redirect('/profile')
  }


  
// This method retrieves the user's profile based on the username parameter or the authenticated user  
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

    const tweets = (user.tweets || []).map((tweet) => ({
      ...tweet.serialize(),
      shortTime: this.formatShortTime(tweet.createdAt), 
    }))

    const followersCount = user.followers?.length || 0
    const followingCount = user.following?.length || 0
    const postsCount = tweets.length

    return view.render('pages/profile', {
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
      tweets,
    })
  }


public async showOtherProfile({ params, view, auth, response }: HttpContext) {
    const userAuth = auth.user!
    const user = await User.query()
      .where('id', params.id)
      .preload('tweets', (query) => {
        query.orderBy('created_at', 'desc')
      })
      .preload('followers')
      .preload('following')
      .firstOrFail()

    if (user.id === userAuth.id) {
      response.redirect('/profile')
    } else {
      
      const postsCount = user.tweets.length
      const followersCount = user.followers.length
      const followingCount = user.following.length

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
        tweets: user.tweets.map(tweet => ({
          ...tweet.serialize(),
        })),
      })
    }
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