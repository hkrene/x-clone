// import type { HttpContext } from '@adonisjs/core/http'
// import app from '@adonisjs/core/services/app'
// import { cuid } from '@adonisjs/core/helpers'
// import Tweet from '#models/tweet'
// import mime from 'mime-types'
// // import path from 'node:path'
// import { uploadToSupabase } from '#services/uploader'

// export default class TweetsController {
//   








import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Tweet from '#models/tweet'
import fs from 'node:fs/promises'

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

    let mediaData: string | null = null
    let mediaType: string | null = null

    if (media) {
      try {
        await media.move(app.tmpPath())
        
        // Read the file and convert to base64
        const fileBuffer = await fs.readFile(media.filePath!)
        mediaData = fileBuffer.toString('base64')
        mediaType = media.headers['content-type'] || 'application/octet-stream'
        
        // Clean up the temporary file
        await fs.unlink(media.filePath!).catch(() => {})
      } catch (error) {
        console.error('Failed to process media:', error)
        return response.internalServerError('Media processing failed')
      }
    }

    await user.related('tweets').create({
      content: tweetText,
      mediaData,
      mediaType,
    })

    return response.redirect('/home')
  }
}