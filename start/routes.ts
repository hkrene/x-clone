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

router.on('/').render('pages/profile')

router.get('/profile', [UsersController, 'showProfile'])
router.post('posts', [UsersController, 'store'])
router.get('posts/:id', [UsersController, 'show'])

