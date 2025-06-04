import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async store({ request }: HttpContext){
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

  }
}



