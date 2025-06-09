// import User from '#models/user'
// import auth from '@adonisjs/auth/services/main'
// import type { HttpContext } from '@adonisjs/core/http'

// export default class ProfilesController {
//   public async show({ auth, view }: HttpContext) {
//     const user = await User.findBy('user_id', auth.user?.id)
//     console.log('user', user);
    
//     return view.render('pages/profile', { user })
//   }
// }

import User from '#models/user'
import Tweet from '#models/tweet'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ProfilesController {
  public async show({ params, view, auth }: HttpContext) {
    const username = params.username

    // Find the user by username with tweets count
    const user = await User.query()
      .where('username', username)
      .withCount('tweets', (query) => query.as('posts_count'))
      .firstOrFail()

    // Get authenticated user (if logged in)
    const authUser = auth.user

    // Get user's tweets
    const tweets = await Tweet.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')

    // Format user data for the view
    const userData = {
      id: user.id,
      name: user.firstName ? `${user.firstName} ${user.surname}` : user.username,
      username: user.username,
      profileImage: user.avatar || '/default-profile.png',
      bannerImage: user.bannerImage || '/default-banner.jpg',
      bio: user.bio || '',
      location: user.city,
      website: user.website,
      dob: user.dateOfBirth ? DateTime.fromJSDate(user.dateOfBirth).toFormat('dd LLL yyyy') : null,
      joinedAt: DateTime.fromJSDate(user.createdAt).toFormat('LLL yyyy'),
      verified: user.isVerified,
      postsCount: user.$extras.posts_count || 0,
      followingCount: user.followingCount,
      followersCount: user.followersCount,
    }

    // Format tweets data
    const tweetsData = tweets.map((tweet) => ({
      id: tweet.id,
      content: tweet.content,
      media: tweet.media,
      createdAt: DateTime.fromJSDate(tweet.createdAt).toRelative(),
      replies: tweet.repliesCount || 0,
      retweets: tweet.retweetsCount || 0,
      likes: tweet.likesCount || 0,
      user: {
        name: user.firstName ? `${user.firstName} ${user.surname}` : user.username,
        username: user.username,
        profileImage: user.avatar || '/default-profile.png',
        verified: user.isVerified,
      },
    }))

    return view.render('pages/profile', {
      user: userData,
      tweets: tweetsData,
      isCurrentUser: authUser?.id === user.id,
    })
  }

  public async edit({ auth, view }: HttpContext) {
    const user = auth.user!

    return view.render('components/edit_profile_modal', {
      user: {
        firstName: user.firstName,
        surname: user.surname,
        username: user.username,
        profileImage: user.avatar || '/default-profile.png',
        bannerImage: user.bannerImage || '/default-banner.jpg',
        bio: user.bio,
        city: user.city,
        website: user.website,
        dateOfBirth: user.dateOfBirth ? DateTime.fromJSDate(user.dateOfBirth).toFormat('yyyy-MM-dd') : null,
      },
    })
  }

  public async update({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const data = request.only([
      'firstName',
      'surname',
      'bio',
      'city',
      'website',
      'dateOfBirth',
      'avatar',
      'bannerImage',
    ])

    // Update user data
    user.merge({
      firstName: data.firstName,
      surname: data.surname,
      avatar: data.avatar,
      bannerImage: data.bannerImage,
      bio: data.bio,
      city: data.city,
      website: data.website,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    })

    await user.save()

    session.flash('success', 'Profile updated successfully')
    return response.redirect().toRoute('profile.show', { username: user.username })
  }
}