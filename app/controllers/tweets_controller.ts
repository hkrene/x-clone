import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import Tweet from '#models/tweet'

export default class TweetsController {
  /**
   * Show the home page with tweets
   */
  public async index({ view }: HttpContext) {
    const tweets = await Tweet.query()
      .preload('author')
      .orderBy('createdAt', 'desc')

    return view.render('home', { tweets })
  }

  /**
   * Store a new tweet with optional media (image/video)
   */
  public async store({ request, auth, response }: HttpContext) {
    const tweetText = request.input('tweet')
    const user = auth.user!

    const media = request.file('mediaUrl', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'],
    })

    let mediaUrl: string | null = null

    if (media) {
      const fileName = `${cuid()}.${media.extname}`
      await media.move(app.publicPath('uploads'), {
        name: fileName,
        overwrite: true,
      })

      mediaUrl = `/uploads/${fileName}`
    }

    await user.related('tweets').create({
      content: tweetText,
      mediaUrl,
    })

    return response.redirect('/home')
  }
}
