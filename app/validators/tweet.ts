import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createTweetValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    slug: vine.string().trim(),
    description: vine.string().trim().escape()
  })
)
