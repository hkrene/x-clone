import { HttpContext } from '@adonisjs/core/http'
import {createUserValidator} from '#validators/user'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'


export default class AuthController {
  

  public async showSignupForm({ view }: HttpContext) {
    // console.log('showSignupForm called');
    return view.render('security/signupForm')
    
  }

  public async store({ request, response}:HttpContext) {
    console.log('store called');

      const payload = await request.validateUsing(createUserValidator)

      console.log('payload is called');
      
      
      const user = await User.create({
        username: payload.username,
      email: payload.email,
      password: payload.password,
      fullname: payload.fullname,
      // dateOfBirth: payload.dateOfBirth,
      city: payload.city,
      website: payload.website,
      bio: payload.bio,
      // avatar: payload.avatar,
      // bannerImage: payload.bannerImage,
      isVerified: payload.isVerified,
      isPrivate: payload.isPrivate,
      followersCount: payload.followersCount,
      followingCount: payload.followingCount,
      postsCount: payload.postsCount,
      likesCount: payload.likesCount,
      })
      console.log(user);
      console.log(payload);
      

      await mail.send((message) => {
        message
          .to(user.email)
          .from('newtonrenesto3@gmail.com')
          .subject('Verify your email address')
          .htmlView('security/email', { user })
      })

      return response.redirect('/home')
    }

    public async showLoginForm({ view }: HttpContext) {
      return view.render('security/loginForm')
    }

    public async login({ request, response, auth}: HttpContext){
      const { email, password } = request.only(['email', 'password'])
  
      const user = await User.verifyCredentials(email, password)
  
      await auth.use('web').login(user)
  
      return response.redirect('/home')
  
    }
}



