import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async showProfile({view, response, request}: HttpContext){
    return view.render('pages/profile')
  }

  public async store({view}: HttpContext) {
  }

  public async show({view}: HttpContext) {
  }

}