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
import ProfilesController from '#controllers/profiles_controller'

router.on('/').render('security/login')

router.get('/signup', [AuthController, 'showSignupForm'])
router.post('/signup', [AuthController, 'store'])

router.get('/login', [AuthController, 'showLoginForm'])
router.post('/login', [AuthController, 'login'])

router.group(() => {
  router.get('/home', [UsersController, 'showHome'])
  router.get('/profile', [UsersController, 'showProfile'])
  router.get('/:username', [ProfilesController, 'show'])
  
  
}).use(middleware.auth())
