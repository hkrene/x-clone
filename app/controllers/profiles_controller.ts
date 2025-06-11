import User from '#models/user'
import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  // Affiche la page d'accueil avec les tweets de l'utilisateur et de ceux qu'il suit
  public async showHome({ view, auth }: HttpContext) {
    const user = await auth.use('web').authenticate().catch(() => null)
    let tweets: Tweet[] = []

    if (user) {
      const following = await user.related('following').query()
      const followingIds = following.map((u: User) => u.id)

      tweets = await Tweet.query()
        .whereIn('userId', [user.id, ...followingIds])
        .preload('author')
        .orderBy('createdAt', 'desc')
    }

    return view.render('pages/home', { user, tweets })
  }

  // Affiche le profil d'un utilisateur
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
        avatar: user.avatar , // || '/image/profile0.png'
        bannerImage: user.bannerImage || '/default-banner.jpg',
        postsCount,
        followersCount,
        followingCount,
        joinedDate: user.createdAt.toFormat('MMMM yyyy'),
      },
      tweets,
    })
  }

  // Formulaire d'édition de profil
  public async editProfile({ view, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    return view.render('pages/edit-profile', { user })
  }

  // Mise à jour du profil
  public async updateProfile({ request, response, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()

    const data = request.only([
      'username',
      'surname',
      'firstName',
      'dateOfBirth',
      'location',
      'website',
      'bio',
      'isPrivate',
      'avatar',
      'bannerImage',
    ])

    user.merge(data)
    await user.save()

    return response.redirect().toRoute('profiles.showProfile', { username: user.username })
  }

  // Suivre un utilisateur
  public async follow({ params, auth, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const userToFollow = await User.find(params.id)

    if (!userToFollow || userToFollow.id === user.id) {
      return response.badRequest('Invalid user to follow')
    }

    await user.related('following').attach([userToFollow.id])
    return response.redirect().back()
  }

  // Ne plus suivre un utilisateur
  public async unfollow({ params, auth, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const userToUnfollow = await User.find(params.id)

    if (!userToUnfollow || userToUnfollow.id === user.id) {
      return response.badRequest('Invalid user to unfollow')
    }

    await user.related('following').detach([userToUnfollow.id])
    return response.redirect().back()
  }

  // Liste des abonnés
  public async followers({ params, view }: HttpContext) {
    const user = await User.query()
      .where('username', params.username)
      .preload('followers')
      .first()

    if (!user) {
      return view.render('errors/not-found')
    }

    return view.render('pages/followers', { user, followers: user.followers })
  }

  // Liste des abonnements
  public async following({ params, view }: HttpContext) {
    const user = await User.query()
      .where('username', params.username)
      .preload('following')
      .first()

    if (!user) {
      return view.render('errors/not-found')
    }

    return view.render('pages/following', { user, following: user.following })
  }

  // Supprimer le compte
  public async deleteAccount({ auth, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    await user.delete()
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
