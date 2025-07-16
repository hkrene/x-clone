// import vine from '@vinejs/vine'
import vine from '@vinejs/vine'

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim().minLength(64).maxLength(64),
    password: vine
      .string()
      .trim()
      .minLength(8)
      .maxLength(32)
      .confirmed()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  })
)