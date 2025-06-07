import User from '#models/user'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  public async show({ auth, view }: HttpContext) {
    const user = await User.findBy('user_id', auth.user?.id)
    console.log('user', user);
    

    // Here you would typically fetch the user profile from the database
    // For now, we will just pass the username to the view
    return view.render('pages/profile', { user })
  }
}


