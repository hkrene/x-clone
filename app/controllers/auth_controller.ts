import { HttpContext } from '@adonisjs/core/http'
import {createUserValidator} from '#validators/user'
import PasswordResetToken from '#models/password_reset_token'
// import { forgotPasswordValidator, resetPasswordValidator } from '#validators/password_reset'
import { forgotPasswordValidator } from '#validators/forgot_password'
import { resetPasswordValidator } from '#validators/reset_password'

import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'

import User from '#models/user'
// import mail from '@adonisjs/mail/services/main'


export default class AuthController {
  

  public async showSignupForm({ view }: HttpContext) {
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

  public async showForgotPasswordForm({ view }: HttpContext) {
    return view.render('pages/forgotpas')
  }
  public async sendsResetLink({ request, response }: HttpContext) {
    const email = request.input('email')
    // Here you would typically send a reset link to the user's email
    console.log(`Reset link sent to: ${email}`)
    
    // Redirect or render a view after sending the reset link
    return response.redirect('/login')
  }



  async sendResetLink({ request, response, session }: HttpContext) {
  const { email } = await request.validateUsing(forgotPasswordValidator)
  const user = await User.findByOrFail('email', email)
  console.log(user);
  

  // Delete any existing tokens
  await PasswordResetToken.query()
    .where('email', email)
    .delete()

  // Create new token
  const token = nanoid(64)
  await PasswordResetToken.create({
    email,
    token,
    expiresAt: DateTime.now().plus({ hours: 24 }),
    ip: request.ip()
  })

  // Send email
  const resetUrl = `${process.env.APP_URL}/password-reset/${token}`
  console.log(resetUrl);
  
  
  await mail.send((message) => {
    message
      .to(email)
      .from('no-reply@yourdomain.com')
      .subject('Reset Your Password')
      .htmlView('emails/password_reset', { 
        resetUrl: `${process.env.APP_URL}/password-reset/${token}`
      })
  })

  // Set flash message and redirect
  session.flash('success', 'Password reset link sent - check your email')
  return response.redirect().back()
}

async resetPassword({ request, response, session }: HttpContext) {
  const { token, password } = await request.validateUsing(resetPasswordValidator)

  const tokenRecord = await PasswordResetToken.query()
    .where('token', token)
    .where('expires_at', '>', DateTime.now().toSQL())
    .firstOrFail()

  const user = await User.findByOrFail('email', tokenRecord.email)
  user.password = await hash.make(password)
  await user.save()

  // Invalidate token
  await tokenRecord.delete()

  // Set flash message and redirect
  session.flash('success', 'Password reset successful')
  return response.redirect('/login')
}
}



