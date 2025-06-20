import User from '#models/user'
import {createUserValidator} from '#validators/user'
import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {

    public async showHome({ view }: HttpContext) {
        return view.render('pages/home')
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

public async store({ request, auth, response }: HttpContext) {
     const { email, password } = request.only(['email', 'password'])
     const user = await User.verifyCredentials(email, password)
     await auth.use('web').login(user)
     response.redirect('/home')
  }
} 
