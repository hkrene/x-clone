/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.on('/').render('pages/home')

router.get('/profile', [UsersController, 'showProfile'])
router.get('home', [UsersController, 'showHome'])
router.get('posts/:id', [UsersController, 'show'])

