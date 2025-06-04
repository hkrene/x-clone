import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {

  public async showHome({view}: HttpContext) {
    return view.render('pages/home')
  }

  public async showProfile({view}: HttpContext){
    return view.render('pages/profile')
  }

}
