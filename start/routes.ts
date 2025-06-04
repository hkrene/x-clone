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

router.on('/').render('pages/login')

router.get('/signup', [AuthController, 'showSignupForm'])
router.post('/signup', [AuthController, 'store'])

router.get('/login', [AuthController, 'showLoginForm'])
router.post('/login', [AuthController, 'login'])


router.group(() => {
  router.get('/profile', [UsersController, 'showProfile'])
  router.get('/home', [UsersController, 'showHome'])
  
  
}) .use(middleware.auth())