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
import AuthController from '#controllers/auth_controller'
import FollowsController from '#controllers/follows_controller'
import TweetsController from '#controllers/tweets_controller'
import ProfilesController from '#controllers/profiles_controller'

router.on('/').render('security/login')

router.get('/signup', [AuthController, 'showSignupForm'])
router.post('/signup', [AuthController, 'create'])

router.get('/login', [AuthController, 'showLoginForm'])
router.post('/login', [AuthController, 'store'])

router.group(() => {
  router.get('/home', [ProfilesController, 'showHome'])
  router.get('/profile', [ProfilesController, 'showProfile'])
  router.get('/editProfile', [ProfilesController, 'showEditProfile'])
  router.post('/update', [ProfilesController, 'update'])
  router.post('/tweets', [TweetsController, 'store'])
  router.post('/logout', [AuthController, 'logout'])    
  router.get('/otherProfile/:id', [ProfilesController, 'showOtherProfile'])
router.post('/follow/:id', [FollowsController, 'follow']).as('follow.user')

}).use(middleware.auth())
