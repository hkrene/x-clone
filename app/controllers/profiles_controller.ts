// import User from '#models/user'
// import auth from '@adonisjs/auth/services/main'
// import type { HttpContext } from '@adonisjs/core/http'

// export default class ProfilesController {
//   public async showHome({view}: HttpContext) {
//     return view.render('pages/home')
//   }

//   public async showProfile({view}: HttpContext){
//     return view.render('pages/profile')
//   }

  
// }




import User from '#models/user'
import Tweet from '#models/tweet'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {

  // Affiche la page d'accueil avec tweets de l'utilisateur et ses abonnements
  public async showHome({ view }: HttpContext) {
    const user = await auth.use().authenticate().catch(() => null)
    let tweets = []

    if (user) {
      const following = await user.related('following').query()
      const followingIds = following.map(u => u.id)

      tweets = await Tweet.query()
        .where('userId', user.id)
        .orWhereIn('userId', followingIds)
        .preload('author')
        .orderBy('createdAt', 'desc')
    }

    return view.render('pages/home', { user, tweets })
  }

  // Affiche le profil d'un utilisateur (ou profil connecté par défaut)
  public async showProfile({ params, view }: HttpContext) {
    const username = params.username
    let user: User | null = null

    if (username) {
      user = await User.query()
        .where('username', username)
        .preload('tweets', (q) => q.orderBy('createdAt', 'desc'))
        .first()
    } else {
      user = await auth.use().authenticate().catch(() => null)
    }

    if (!user) {
      return view.render('errors/not-found')
    }

    return view.render('pages/profile', { user })
  }

  // Affiche le formulaire d'édition de profil (GET)
  public async editProfile({ view, auth }: HttpContext) {
    const user = await auth.use().authenticate()
    return view.render('pages/edit-profile', { user })
  }

  // Met à jour le profil (POST/PUT)
  public async updateProfile({ request, response, auth }: HttpContext) {
    const user = await auth.use().authenticate()

    const data = request.only([
      'username',
      'surname',
      'firstName',
      'dateOfBirth',
      'location',
      'website',
      'bio',
      'isPrivate',
    ])

    user.merge(data)
    await user.save()

    return response.redirect().toRoute('profiles.showProfile', { username: user.username })
  }

  // Suivre un utilisateur
  public async follow({ params, auth, response }: HttpContext) {
    const user = await auth.use().authenticate()
    const userToFollow = await User.find(params.id)

    if (!userToFollow || userToFollow.id === user.id) {
      return response.badRequest('Invalid user to follow')
    }

    await user.related('following').attach([userToFollow.id])

    return response.redirect().back()
  }

  // Ne plus suivre un utilisateur
  public async unfollow({ params, auth, response }: HttpContext) {
    const user = await auth.use().authenticate()
    const userToUnfollow = await User.find(params.id)

    if (!userToUnfollow || userToUnfollow.id === user.id) {
      return response.badRequest('Invalid user to unfollow')
    }

    await user.related('following').detach([userToUnfollow.id])

    return response.redirect().back()
  }

  // Affiche la liste des abonnés d'un utilisateur
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

  // Affiche la liste des abonnements d'un utilisateur
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

  // Supprimer le compte de l'utilisateur (optionnel)
  public async deleteAccount({ auth, response }: HttpContext) {
    const user = await auth.use().authenticate()

    await user.delete()

    await auth.use().logout()

    return response.redirect().toRoute('home')
  }
}

