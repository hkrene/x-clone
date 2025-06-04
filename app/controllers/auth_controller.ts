import { HttpContext } from '@adonisjs/core/http'
import {createUserValidator} from '#validators/user'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'


export default class AuthController {
  public async showLoginForm({ view }: HttpContext) {
    return view.render('pages/login')
  }

  public async showSigninForm({ view }: HttpContext) {
    return view.render('pages/signin')
  }

  public async store({ request, response}:HttpContext) {

      const payload = await request.validateUsing(createUserValidator)
      
      const user = await User.create({
        fullName: payload.full_name,
        email: payload.email,
        password: payload.password
      })
      console.log(user);

      await mail.send((message) => {
        message
          .to(user.email)
          .from('newtonrenesto3@gmail.com')
          .subject('Verify your email address')
          .htmlView('pages/signup_mail', { user })
      })

      return response.redirect('/home')
    }

  
  async login({ request }: HttpContext){
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

  }
}



