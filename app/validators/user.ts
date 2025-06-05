import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(50),
    email: vine.string().trim().email().maxLength(50),
    password: vine.string().trim().minLength(8).maxLength(50),
    surname: vine.string().trim().maxLength(20).nullable(), // Optional, can be null
    firstName: vine.string().trim().maxLength(20).nullable(), // Optional, can be null
  })
)