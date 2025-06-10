// import User from '#models/user'
// import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  public async showHome({view}: HttpContext) {
    return view.render('pages/home')
  }

  public async showProfile({view}: HttpContext){
    return view.render('pages/profile')
  }

  
}





