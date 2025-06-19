import User from '#models/user'
import {createUserValidator} from '#validators/user'
import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {

      public async create({ request, response, auth}: HttpContext) {
      const data = await request.validateUsing(createUserValidator)
      
      const user = await User.create({
        firstName: data.firstName,
        surname: data.surname,
        username: data.username,
        email: data.email,
        password: data.password
      })

      const user = await User.verifyCredentials(data.email, data.password)
      console.log(user);

      await mail.send((message) => {
        message
          .to(user.email)
          .from('shortenitapp@gmail.com')
          .subject('Verify your email address')
          .htmlView('pages/signup_mail', { user })
      })

      return response.redirect('/list')
    }
} 
