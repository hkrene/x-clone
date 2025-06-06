// import type { HttpContext } from '@adonisjs/core/http'

// export default class ProfilesController {
// }

// start/app/controllers/profiles_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ProfilesController {
  public async show({ params, view, response }: HttpContext) {
    const username = params.username
    const user = await User.findBy('username', username)

    if (!user) {
      return response.status(404).send('User not found')
    }

    return view.render('profile', { user })
  }

  public async update({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = request.only(['firstName', 'surname', 'bio', 'city', 'website', 'dateOfBirth'])
    user.merge(data)
    await user.save()
    return response.redirect().back()
  }
}
