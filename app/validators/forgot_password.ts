// import vine from '@vinejs/vine'
import vine from '@vinejs/vine'

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
  })
)