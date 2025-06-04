import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'


export default class AuthController {
  
  async login({ request }: HttpContext){
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

  }
}



