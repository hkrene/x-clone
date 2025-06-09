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

export default class ProfilesController {
  public async show({ auth, view, params }: HttpContext) {
    // Get the username from route parameters
    const username = params.username

    // Find the user by username (not auth.user)
    const user = await User.query()
      .where('username', username)
      .preload('profile')
      .firstOrFail()

    // Get authenticated user (if logged in)
    const authUser = auth.user

    // Get user's tweets with related data
    const tweets = await Tweet.query()
      .where('user_id', user.id)
      .preload('user')
      .orderBy('created_at', 'desc')

    // Format user data for the view
    const userData = {
      id: user.id,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage || '/default-profile.png',
      bannerImage: user.bannerImage || '/default-banner.jpg',
      bio: user.profile?.bio || '',
      location: user.profile?.location,
      website: user.profile?.website,
      dob: user.profile?.dob?.toFormat('dd LLL yyyy'),
      joinedAt: user.createdAt.toFormat('LLL yyyy'),
      verified: user.isVerified,
      postsCount: await Tweet.query().where('user_id', user.id).getCount(),
      followingCount: await user.related('following').query().getCount(),
      followersCount: await user.related('followers').query().getCount(),
      subscriptionCount: await user.related('subscriptions').query().getCount(),
    }

    // Format tweets data
    const tweetsData = await Promise.all(
      tweets.map(async (tweet) => ({
        id: tweet.id,
        content: tweet.content,
        media: tweet.media,
        createdAt: tweet.createdAt.toRelative(),
        replies: await tweet.related('replies').query().getCount(),
        retweets: await tweet.related('retweets').query().getCount(),
        likes: await tweet.related('likes').query().getCount(),
        user: {
          name: tweet.user.name,
          username: tweet.user.username,
          profileImage: tweet.user.profileImage || '/default-profile.png',
          verified: tweet.user.isVerified,
        },
      }))
    )

    return view.render('pages/profile', {
      user: userData,
      tweets: tweetsData,
      isCurrentUser: authUser?.id === user.id,
    })
  }

  public async edit({ auth, view }: HttpContext) {
    const user = auth.user!
    await user.load('profile')

    return view.render('pages/profile/edit', {
      user: {
        name: user.name,
        username: user.username,
        profileImage: user.profileImage || '/default-profile.png',
        bannerImage: user.bannerImage || '/default-banner.jpg',
        bio: user.profile?.bio || '',
        location: user.profile?.location,
        website: user.profile?.website,
        dob: user.profile?.dob?.toFormat('yyyy-MM-dd'),
      },
    })
  }

  public async update({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const data = request.only([
      'name',
      'bio',
      'location',
      'website',
      'dob',
      'profileImage',
      'bannerImage',
    ])

    // Update user data
    user.merge({
      name: data.name,
      profileImage: data.profileImage,
      bannerImage: data.bannerImage,
    })
    await user.save()

    // Update or create profile
    await user.related('profile').updateOrCreate({}, {
      bio: data.bio,
      location: data.location,
      website: data.website,
      dob: data.dob ? new Date(data.dob) : null,
    })

    session.flash('success', 'Profile updated successfully')
    return response.redirect().toRoute('profile.show', { username: user.username })
  }
}