import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Follow from '#models/follow'
import { getSignedUrl } from '#services/uploader'

HttpContext.macro('getSuggestedUsers', async function (this: HttpContext) {
  const authUser = await this.auth.use('web').authenticate()

  const followingRecords = await Follow.query()
    .where('id_user', authUser.id)
    .select('id_user_following')

  const followingIds = followingRecords.map(record => record.idUserFollowing)
  followingIds.push(authUser.id)

  const users = await User.query()
    .whereNotIn('id', followingIds)
    .orderByRaw('RANDOM()')
    .limit(3)

  return await Promise.all(
    users.map(async (user) => ({
      id: user.id,
      firstName: user.firstName || '',
      surname: user.surname || '',
      username: user.username || '',
      avatar: user.avatar ? await getSignedUrl(user.avatar) : '',
    }))
  )
})
