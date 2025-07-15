// import type { HttpContext } from '@adonisjs/core/http'
// import type { NextFn } from '@adonisjs/core/types/http'

// export default class ShareUserWithViewsMiddleware {
//   async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    // console.log(ctx)

    /**
     * Call next method in the pipeline and return its output
     */
//     const output = await next()
//     return output
//   }
// }

import type { HttpContext } from '@adonisjs/core/http'
import { getSignedUrl } from '#services/uploader'

export default class ShareUserWithViews {
  async handle({ auth, view }: HttpContext, next: () => Promise<void>) {
    try {
      const user = await auth.use('web').authenticate()
      
      // Generate signed URL for avatar
      const avatarUrl = user.avatar ? await getSignedUrl(user.avatar) : ''

      // Share user data with all views
      view.share({
        user: {
          ...user.serialize(),
          avatar: avatarUrl,
          firstName: user.firstName || '',
          surname: user.surname || '',
          username: user.username || '',
          isVerified: user.isVerified || false,
        }
      })
    } catch {
      // If not authenticated, set user to null
      view.share({ user: null })
    }

    await next() // Continue to the next middleware/route
  }
}