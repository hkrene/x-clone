import { HttpContext } from '@adonisjs/core/http'
import {createUserValidator} from '#validators/user'
import { DateTime } from 'luxon'

import User from '#models/user'
// import mail from '@adonisjs/mail/services/main'


export default class AuthController {
  

  public async showSignupForm({ view }: HttpContext) {
    // console.log('showSignupForm called');
    return view.render('security/signupForm')
    
  }
  //     /**await mail.send((message) => {
  //       message
  //         .to(user.email)
  //         .from('newtonrenesto3@gmail.com')
  //         .subject('Verify your email address')
  //         .htmlView('security/email', { user })
  //     })**/

  //     return response.redirect('/home')
  //   }



     /**creates users and stores in database */
        
    
        public async showLoginForm({ view }: HttpContext) {
      return view.render('security/loginForm')
    }

        public async create({ request, response, auth}: HttpContext) {
        const data = await request.validateUsing(createUserValidator)
        
        const user = await User.create({
        firstName: data.firstName,
        surname: data.surname,
        username: data.username,
        email: data.email,
        password: data.password
        })
    
        const users = await User.verifyCredentials(data.email, data.password)
        await auth.use('web').login(user)
    
        console.log(data);
        console.log(user);
        console.log(users);
    
        // await mail.send((message) => {
        //   message
        //     .to(user.email)
        //     .from('shortenitapp@gmail.com')
        //     .subject('Verify your email address')
        //     .htmlView('pages/signup_mail', { user })
        // })
    
        return response.redirect('/home')
    }
    /**login users */
    public async store({ request, auth, response }: HttpContext) {
         const { email, password } = request.only(['email', 'password'])
         const user = await User.verifyCredentials(email, password)
         await auth.use('web').login(user)
         console.log('User logged in:', user);
         
         return response.redirect('/home')
      }
    
      //logout users
      public async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/signup')
      }
}



