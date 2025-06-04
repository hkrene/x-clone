/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import AuthController from '#controllers/auth_controller'
import TweetsController from '#controllers/posts_controller'



router.get('/profile', [UsersController, 'showProfile'])
router.get('/home', [UsersController, 'showHome'])
router.get('/posts/:id', [UsersController, 'show'])


router.group(() => {
  router.on('/').render('pages/home')
  
}) .use(middleware.auth())