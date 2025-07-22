import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import Tweet from '#models/tweet'
import mime from 'mime-types'
// import path from 'node:path'
import { uploadToSupabase } from '#services/uploader'

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
  // public async store({ request, auth, response }: HttpContext) {
  //   const tweetText = request.input('tweet')
  //   const user = auth.user!

  //   const media = request.file('mediaUrl', {
  //     size: '10mb',
  //     extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'],
  //   })

  //   let mediaUrl: string | null = null

  //   if (media) {
  //     const fileName = `${cuid()}.${media.extname}`
  //     await media.move(app.publicPath('uploads'), {
  //       name: fileName,
  //       overwrite: true,
  //     })

  //     mediaUrl = `/uploads/${fileName}`
  //   }

  //   await user.related('tweets').create({
  //     content: tweetText,
  //     mediaUrl,
  //   })

  //   return response.redirect('/home')
  // }

  public async store({ request, auth, response }: HttpContext) {
  const tweetText = request.input('tweet')
  const user = auth.user!
  const media = request.file('mediaUrl', {
    size: '10mb',
    extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'],
  })

  let mediaUrl: string | null = null

  if (media) {
    try {
      await media.move(app.tmpPath()) // Throws on failure
      const fileName = `${cuid()}.${media.extname}`
      const tmpPath = media.filePath! // Only available after move
      const contentType = mime.lookup(media.extname!) || 'application/octet-stream'
      const uploadPath = `tweets/${fileName}`

      await uploadToSupabase(tmpPath, uploadPath, contentType)
      mediaUrl = uploadPath
    } catch (error) {
      console.error('Failed to move/upload media:', error)
      return response.internalServerError('Media upload failed')
    }
  }

  await user.related('tweets').create({
    content: tweetText,
    mediaUrl,
  })

  return response.redirect('/home')
}


}
