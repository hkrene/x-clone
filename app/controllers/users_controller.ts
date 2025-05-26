import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async showProfile({view, response, request}: HttpContext){
    return view.render('pages/profile')
  }

  public async showHome({view}: HttpContext) {
    return view.render('pages/home')
  }

  public async show({view}: HttpContext) {
    return view.render('pages/')
  }

}