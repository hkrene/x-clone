import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import Tweet from '#models/tweet'
import User from '#models/user'

export default class TweetsController {
  /**
   * Store a new tweet with optional media (image/video)
   */
  public async store({ request, auth, response }: HttpContext) {
    const tweetText = request.input('tweet')
    const user = auth.user!

    const media = request.file('media', {
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
      mediaUrl: mediaUrl,
    })

    return response.redirect().back()
  }
}
